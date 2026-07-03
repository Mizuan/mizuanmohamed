import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SplitText } from '@/components/site/split-text';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { index as articlesIndex } from '@/routes/site/articles';
import { show as pageShow } from '@/routes/site/pages';
import { index as projectsIndex } from '@/routes/site/projects';

const navLinks = [
    { label: 'Home', href: home().url },
    { label: 'Work', href: projectsIndex().url },
    { label: 'Writing', href: articlesIndex().url },
    { label: 'About', href: pageShow('about').url },
    { label: 'Contact', href: pageShow('contact').url },
];

/**
 * The shared public-site chrome: a slim top bar with a menu trigger on the
 * left, the name centred, and the year on the right. Triggering the menu slides
 * a vertical rail in from the left — rotated labels with a red box on the active
 * page. The whole public site runs on the dark cinematic theme.
 */
export function SiteNav() {
    const currentUrl = usePage().url;
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isActive = (href: string) =>
        href === '/' ? currentUrl === '/' : currentUrl.startsWith(href);

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-40 border-b text-foreground transition-colors duration-300',
                scrolled
                    ? 'border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60'
                    : 'border-transparent bg-transparent',
            )}
        >
            <div className="relative flex items-center justify-between px-5 py-3.5 font-display text-xs font-medium tracking-[0.12em] uppercase lg:px-7">
                {/* Menu trigger → vertical rail drawer from the left */}
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
                        side="left"
                        className="dark w-16 border-r bg-background p-0 text-foreground lg:w-16 2xl:w-20"
                    >
                        <SheetTitle className="sr-only">Menu</SheetTitle>
                        <nav className="flex h-full flex-col items-stretch justify-center gap-2 py-16">
                            {navLinks.map((link) => {
                                const active = isActive(link.href);

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        aria-current={active ? 'page' : undefined}
                                        className={cn(
                                            'flex w-full items-center justify-center font-poster text-sm tracking-[0.14em] uppercase transition-colors',
                                            active
                                                ? 'bg-brand py-5 text-white'
                                                : 'py-3 text-foreground/55 hover:text-foreground',
                                        )}
                                    >
                                        <span className="rotate-180 [writing-mode:vertical-rl]">
                                            {link.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </SheetContent>
                </Sheet>

                <Link
                    href={home()}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-poster text-sm font-normal tracking-[0.18em] whitespace-nowrap transition-opacity hover:opacity-70 lg:text-base"
                >
                    <SplitText
                        text="Mizuan Mohamed"
                        delay={0.15}
                        stagger={0.02}
                        duration={0.5}
                    />
                </Link>

                <span className="text-muted-foreground">
                    &copy;{new Date().getFullYear()}
                </span>
            </div>
        </header>
    );
}
