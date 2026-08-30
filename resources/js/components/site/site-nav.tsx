import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
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

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
                <Link
                    href={home()}
                    className="font-display font-semibold tracking-[-0.01em] transition-colors hover:text-brand"
                >
                    {settings.brand_name}
                </Link>

                <nav className="hidden items-center gap-6 text-sm sm:flex">
                    {items.map((item) =>
                        item.is_cta ? (
                            <Link
                                key={item.url}
                                href={item.url}
                                className={cn(
                                    'rounded-full px-4 py-1.5 font-medium transition-colors',
                                    isActive(item.url)
                                        ? 'bg-brand text-brand-foreground'
                                        : 'border border-border bg-card hover:border-brand/40 hover:text-brand',
                                )}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <Link
                                key={item.url}
                                href={item.url}
                                aria-current={
                                    isActive(item.url) ? 'page' : undefined
                                }
                                className={cn(
                                    'transition-colors hover:text-brand',
                                    isActive(item.url)
                                        ? 'text-brand'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {item.label}
                            </Link>
                        ),
                    )}
                </nav>

                <MobileMenu
                    items={items}
                    isActive={isActive}
                    brandName={settings.brand_name}
                />
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
