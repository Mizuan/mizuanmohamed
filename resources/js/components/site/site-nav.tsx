import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { SectionLabel } from '@/components/site/section-label';
import { SocialIconLinks } from '@/components/site/social-links';
import {
    Sheet,
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

    const isActive = (url: string) =>
        url === '/' ? currentUrl === '/' : currentUrl.startsWith(url);

    const links = items.filter((item) => !item.is_cta);
    const cta = items.find((item) => item.is_cta);

    return (
        <header>
            {/* Masthead: the brand carries the identity so the body can lead with content. */}
            <div className="sticky top-0 z-40 border-b border-border bg-background sm:relative sm:border-b-0">
                <MastheadField />

                <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:py-6 lg:px-8">
                    <div>
                        {settings.tagline && (
                            <SectionLabel className="mb-1.5 hidden text-xs sm:flex">
                                {settings.tagline}
                            </SectionLabel>
                        )}
                        <Link
                            href={home()}
                            className="font-display text-2xl font-bold tracking-tight transition-colors hover:text-brand sm:text-3xl"
                        >
                            {settings.brand_name}
                        </Link>
                    </div>

                    <SocialIconLinks className="hidden items-center gap-5 sm:flex" />

                    <MobileMenu
                        items={items}
                        isActive={isActive}
                        brandName={settings.brand_name}
                    />
                </div>
            </div>

            {/* Nav strip: sticky on its own once the masthead scrolls away. */}
            <div className="sticky top-0 z-40 hidden border-y border-border bg-background sm:block">
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
                                    '-mb-px border-b-2 py-3.5 font-medium transition-colors hover:text-brand',
                                    isActive(item.url)
                                        ? 'border-brand text-brand'
                                        : 'border-transparent text-muted-foreground',
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {cta && (
                        <Link
                            href={cta.url}
                            className={cn(
                                'my-2 rounded-full px-4 py-1.5 font-medium transition-colors',
                                isActive(cta.url)
                                    ? 'bg-brand text-brand-foreground'
                                    : 'border border-border bg-card hover:border-brand/40 hover:text-brand',
                            )}
                        >
                            {cta.label}
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

function MobileMenu({
    items,
    isActive,
    brandName,
}: {
    items: NavItem[];
    isActive: (url: string) => boolean;
    brandName: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label="Open menu"
                    className="-mr-1.5 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-brand sm:hidden"
                >
                    <Menu className="size-5" />
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-4/5 max-w-xs gap-0 border-border bg-background p-0"
            >
                <SheetTitle className="border-b border-border px-6 py-4 font-display text-base font-semibold tracking-[-0.01em]">
                    {brandName}
                </SheetTitle>

                <nav className="flex flex-col px-6 py-4">
                    {items.map((item) => {
                        const active = isActive(item.url);

                        return (
                            <Link
                                key={item.url}
                                href={item.url}
                                onClick={() => setOpen(false)}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'flex items-center gap-2.5 border-b border-border py-4 font-display text-lg font-medium transition-colors last:border-b-0',
                                    active ? 'text-brand' : 'hover:text-brand',
                                )}
                            >
                                <span
                                    aria-hidden
                                    className={cn(
                                        'text-brand transition-opacity',
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

                <SocialIconLinks className="mt-auto flex items-center gap-5 border-t border-border px-6 py-5" />
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
