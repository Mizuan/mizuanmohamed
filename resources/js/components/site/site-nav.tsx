import { Link, usePage } from '@inertiajs/react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { socials } from '@/components/site/site-footer';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { index as articlesIndex } from '@/routes/site/articles';
import { show as pageShow } from '@/routes/site/pages';
import { index as projectsIndex } from '@/routes/site/projects';

const navLinks = [
    { label: 'Work', href: projectsIndex().url },
    { label: 'Writing', href: articlesIndex().url },
    { label: 'About', href: pageShow('about').url },
    { label: 'Contact', href: pageShow('contact').url },
];

/**
 * The shared public-site top bar: a print-style chrome with a menu trigger on
 * the left, the name centred, and the year + theme toggle on the right. The
 * navigation itself lives in a full side drawer so pages stay full-bleed.
 */
export function SiteNav({ darkTop = false }: { darkTop?: boolean }) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const currentUrl = usePage().url;
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    // Over a forced-dark hero, the unscrolled bar adopts dark-theme tokens so
    // its text stays legible; once scrolled into the solid bar it reverts.
    const onDark = darkTop && !scrolled;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isActive = (href: string) => currentUrl.startsWith(href);

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-40 border-b text-foreground transition-colors duration-300',
                scrolled
                    ? 'border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60'
                    : 'border-transparent bg-transparent',
                onDark && 'dark',
            )}
        >
            <div className="relative flex items-center justify-between px-5 py-3.5 font-display text-xs font-medium tracking-[0.12em] uppercase lg:px-7">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Open menu"
                        >
                            <Menu className="size-4" />
                            <span className="hidden sm:inline">Menu</span>
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="w-full border-l p-0 sm:max-w-md"
                    >
                        <SheetTitle className="sr-only">Menu</SheetTitle>
                        <div className="flex h-full flex-col justify-between p-8 lg:p-10">
                            <nav className="mt-10 flex flex-col">
                                {navLinks.map((link, i) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            'group flex items-baseline gap-4 border-b py-4 font-display text-3xl font-medium tracking-tight transition-colors sm:text-4xl',
                                            isActive(link.href)
                                                ? 'text-foreground'
                                                : 'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        <span className="font-sans text-xs text-muted-foreground tabular-nums">
                                            0{i + 1}
                                        </span>
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="flex items-center gap-5 border-t pt-6 text-muted-foreground">
                                {socials.map(({ label, href, Icon }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target={
                                            href.startsWith('http')
                                                ? '_blank'
                                                : undefined
                                        }
                                        rel={
                                            href.startsWith('http')
                                                ? 'noreferrer'
                                                : undefined
                                        }
                                        aria-label={label}
                                        className="transition-colors hover:text-foreground"
                                    >
                                        <Icon className="size-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                <Link
                    href={home()}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium tracking-[0.14em] whitespace-nowrap transition-opacity hover:opacity-70 lg:text-sm"
                >
                    Mizuan Mohamed
                </Link>

                <div className="flex items-center gap-3">
                    <span className="hidden text-muted-foreground sm:inline">
                        &copy;{new Date().getFullYear()}
                    </span>
                    <button
                        type="button"
                        onClick={() =>
                            updateAppearance(
                                resolvedAppearance === 'dark'
                                    ? 'light'
                                    : 'dark',
                            )
                        }
                        aria-label="Toggle theme"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="size-4" />
                        ) : (
                            <Moon className="size-4" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
