import { router } from '@inertiajs/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

const MIN_LENGTH = 2;

type Result = {
    title: string;
    description: string | null;
    url: string;
};

type Group = {
    label: string;
    items: Result[];
};

export function SiteSearch({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [term, setTerm] = useState('');
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(0);

    const tooShort = term.trim().length < MIN_LENGTH;

    // Derived so a shrinking term never shows results for the longer one.
    const sections = useMemo(() => {
        if (tooShort) {
            return [];
        }

        let offset = 0;

        return groups.map((group) => {
            const start = offset;
            offset += group.items.length;

            return { ...group, start };
        });
    }, [groups, tooShort]);

    const flat = useMemo(
        () => sections.flatMap((section) => section.items),
        [sections],
    );

    useEffect(() => {
        if (tooShort) {
            return;
        }

        const controller = new AbortController();
        const timer = window.setTimeout(() => {
            setLoading(true);

            fetch(`/search?q=${encodeURIComponent(term.trim())}`, {
                headers: { Accept: 'application/json' },
                signal: controller.signal,
            })
                .then((response) => response.json())
                .then((data: { groups?: Group[] }) => {
                    setGroups(data.groups ?? []);
                    setActive(0);
                })
                .catch(() => undefined)
                .finally(() => setLoading(false));
        }, 200);

        return () => {
            controller.abort();
            window.clearTimeout(timer);
        };
    }, [term, tooShort]);

    const change = (next: boolean) => {
        if (!next) {
            setTerm('');
            setGroups([]);
            setActive(0);
        }

        onOpenChange(next);
    };

    const visit = (result: Result) => {
        change(false);

        if (result.url.startsWith('http')) {
            window.open(result.url, '_blank', 'noreferrer');

            return;
        }

        router.visit(result.url);
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (flat.length === 0) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActive((index) => (index + 1) % flat.length);
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActive((index) => (index - 1 + flat.length) % flat.length);
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            visit(flat[active]);
        }
    };

    return (
        <DialogPrimitive.Root open={open} onOpenChange={change}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />

                <DialogPrimitive.Content
                    onKeyDown={onKeyDown}
                    className="fixed inset-x-4 top-4 z-50 flex max-h-[85svh] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-lg data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:animate-in data-[state=open]:slide-in-from-top sm:inset-x-0 sm:top-20 sm:mx-auto sm:w-full sm:max-w-2xl"
                >
                    <DialogPrimitive.Title className="sr-only">
                        Search
                    </DialogPrimitive.Title>

                    <div className="flex items-center gap-3 border-b border-border px-4">
                        <Search className="size-4 shrink-0 text-muted-foreground" />
                        <input
                            autoFocus
                            value={term}
                            onChange={(event) => setTerm(event.target.value)}
                            placeholder="Search writing, projects and pages…"
                            className="w-full bg-transparent py-4 text-sm outline-hidden placeholder:text-muted-foreground"
                        />
                        <DialogPrimitive.Close
                            aria-label="Close search"
                            className="text-muted-foreground transition-colors hover:text-brand"
                        >
                            <X className="size-4" />
                        </DialogPrimitive.Close>
                    </div>

                    <div className="overflow-y-auto p-2">
                        {tooShort && (
                            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                                Type at least two characters.
                            </p>
                        )}

                        {!tooShort && !loading && flat.length === 0 && (
                            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                                Nothing found for “{term.trim()}”.
                            </p>
                        )}

                        {sections.map((section) => (
                            <div key={section.label} className="mb-2 last:mb-0">
                                <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                                    {section.label}
                                </p>

                                {section.items.map((item, itemIndex) => {
                                    const index = section.start + itemIndex;

                                    return (
                                        <button
                                            key={`${section.label}-${item.url}-${item.title}`}
                                            type="button"
                                            onMouseEnter={() =>
                                                setActive(index)
                                            }
                                            onClick={() => visit(item)}
                                            className={cn(
                                                'block w-full cursor-pointer rounded-md px-3 py-2 text-left transition-colors',
                                                index === active
                                                    ? 'bg-muted'
                                                    : 'hover:bg-muted',
                                            )}
                                        >
                                            <span className="block truncate font-display text-sm font-medium">
                                                {item.title}
                                            </span>
                                            {item.description && (
                                                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                                                    {item.description}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

/** Opens the search dialog, and wires the ⌘K / Ctrl-K shortcut. */
export function useSearchDialog() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen((value) => !value);
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    return { open, setOpen };
}
