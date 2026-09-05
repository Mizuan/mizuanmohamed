import { Link, usePage } from '@inertiajs/react';
import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { GlitchText } from '@/components/site/glitch-text';
import { SiteSearch, useSearchDialog } from '@/components/site/site-search';
import { SocialIconLinks } from '@/components/site/social-links';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

export type NavItem = {
    label: string;
    url: string;
    is_cta: boolean;
};

function useNavItems(): NavItem[] {
    return usePage<{ site: { nav: NavItem[] } }>().props.site.nav;
}

export function SiteNav() {
    const currentUrl = usePage().url;
    const settings = useSiteSettings();
    const items = useNavItems();

    const { open: searchOpen, setOpen: setSearchOpen } = useSearchDialog();

    const isActive = (url: string) =>
        url === '/' ? currentUrl === '/' : currentUrl.startsWith(url);

    const links = items.filter((item) => !item.is_cta);
    const cta = items.find((item) => item.is_cta);

    return (
        <>
            {settings.tagline && (
                <div className="bg-foreground">
                    <div className="mx-auto max-w-7xl px-6 py-1 lg:px-8">
                        <GlitchText
                            text={settings.tagline}
                            className="text-xs text-background/80"
                        />
                    </div>
                </div>
            )}

            {/* Sticky on the header itself: a sticky child would only stick within it. */}
            <header className="sticky top-0 z-40">
                {/* Masthead: the brand carries the identity so the body can lead with content. */}
                <div className="relative border-b border-border bg-background sm:border-b-0">
                    <MastheadField />

                    <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:py-6 lg:px-8">
                        <Link
                            href={home()}
                            className="font-display text-2xl font-bold tracking-tight transition-colors hover:text-brand sm:text-4xl"
                        >
                            {settings.brand_name}
                        </Link>

                        <SocialIconLinks className="hidden items-center gap-5 sm:flex" />

                        <div className="flex items-center gap-1 sm:hidden">
                            <button
                                type="button"
                                aria-label="Search"
                                onClick={() => setSearchOpen(true)}
                                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-brand"
                            >
                                <Search className="size-5" />
                            </button>

                            <MobileMenu
                                items={items}
                                isActive={isActive}
                                brandName={settings.brand_name}
                                onSearch={() => setSearchOpen(true)}
                            />
                        </div>
                    </div>
                </div>

                {/* Nav strip */}
                <div className="hidden border-y border-border bg-background sm:block">
                    <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 text-sm lg:px-8">
                        <div className="flex items-center gap-7">
                            {links.map((item) => (
                                <Link
                                    key={item.url}
                                    href={item.url}
                                    aria-current={
                                        isActive(item.url) ? 'page' : undefined
                                    }
                                    className={cn(
                                        '-mb-px border-b-2 py-2.5 font-medium transition-colors hover:text-brand',
                                        isActive(item.url)
                                            ? 'border-brand text-brand'
                                            : 'border-transparent text-muted-foreground',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setSearchOpen(true)}
                                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-brand"
                            >
                                <Search className="size-4" />
                                <span className="hidden text-xs lg:inline">
                                    ⌘K
                                </span>
                            </button>

                            {cta && (
                                <Link
                                    href={cta.url}
                                    className={cn(
                                        'my-1.5 rounded-full px-4 py-1.5 font-medium transition-colors',
                                        isActive(cta.url)
                                            ? 'bg-brand text-brand-foreground'
                                            : 'border border-border bg-card hover:border-brand/40 hover:text-brand',
                                    )}
                                >
                                    {cta.label}
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>

                <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
            </header>
        </>
    );
}

function MobileMenu({
    items,
    isActive,
    brandName,
    onSearch,
}: {
    items: NavItem[];
    isActive: (url: string) => boolean;
    brandName: string;
    onSearch: () => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label="Open menu"
                    className="-mr-1.5 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-brand"
                >
                    <Menu className="size-5" />
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                hideClose
                className="flex h-full w-full max-w-none flex-col gap-0 border-0 bg-background/70 p-0 text-foreground backdrop-blur-xl"
            >
                {/* Mirrors the masthead so the header appears to stay put. */}
                <div className="flex items-center justify-between px-6 py-4">
                    <SheetTitle className="font-display text-2xl font-bold tracking-tight">
                        {brandName}
                    </SheetTitle>

                    <SheetClose
                        aria-label="Close menu"
                        className="-mr-1.5 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-brand"
                    >
                        <X className="size-5" />
                    </SheetClose>
                </div>

                <nav className="flex flex-col px-6 pt-6">
                    {items.map((item) => {
                        const active = isActive(item.url);

                        return (
                            <Link
                                key={item.url}
                                href={item.url}
                                onClick={() => setOpen(false)}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'flex items-center gap-3 py-4 font-display text-3xl font-semibold tracking-tight transition-colors',
                                    active ? 'text-brand' : 'hover:text-brand',
                                )}
                            >
                                <span
                                    aria-hidden
                                    className={cn(
                                        'text-xl text-brand transition-opacity',
                                        active ? 'opacity-100' : 'opacity-0',
                                    )}
                                >
                                    —
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    type="button"
                    onClick={() => {
                        setOpen(false);
                        onSearch();
                    }}
                    className="mx-6 mt-8 flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
                >
                    <Search className="size-4" />
                    Search the site
                </button>

                <SocialIconLinks className="mt-auto flex items-center gap-5 border-t border-border px-6 py-6" />
            </SheetContent>
        </Sheet>
    );
}

/** A faint slice of the hero's grid, fading in behind the masthead's right side. */
function MastheadField() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 mask-[linear-gradient(to_left,black_35%,transparent)] lg:block"
        >
            <svg className="size-full" fill="none">
                <defs>
                    <pattern
                        id="masthead-grid"
                        width="22"
                        height="22"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 22 0 H 0 V 22"
                            className="stroke-border"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="url(#masthead-grid)"
                    opacity="0.7"
                />
            </svg>
        </div>
    );
}
