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
 * The shared public-site navigation: a fixed bar that is transparent over the
 * top of the page and fades to a solid, blurred background once scrolled.
 * Includes a mobile sheet menu and a theme toggle.
 */
export function SiteNav() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const currentUrl = usePage().url;
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

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
                'fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300',
                scrolled
                    ? 'border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'
                    : 'border-transparent bg-transparent',
            )}
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
                <Link
                    href={home()}
                    className="inline-flex items-center text-base font-semibold tracking-tight"
                >
                    Mizuan.dev
                </Link>

                <nav className="hidden items-center gap-8 text-sm md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'transition-colors',
                                isActive(link.href)
                                    ? 'font-medium text-foreground'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
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
                        className="rounded-full border p-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="size-4" />
                        ) : (
                            <Moon className="size-4" />
                        )}
                    </button>

                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <button
                                type="button"
                                aria-label="Open menu"
                                className="rounded-full border p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
                            >
                                <Menu className="size-4" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 p-6">
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                            <nav className="mt-8 flex flex-col gap-1 text-lg">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            'rounded-md px-2 py-2 transition-colors',
                                            isActive(link.href)
                                                ? 'font-semibold text-foreground'
                                                : 'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-10 flex items-center gap-4 border-t pt-6 text-muted-foreground">
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
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
