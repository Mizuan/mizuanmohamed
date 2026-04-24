import { Link, usePage } from '@inertiajs/react';
import { Mail, Menu } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
    GithubIcon,
    InstagramIcon,
    LinkedinIcon,
    XIcon,
} from '@/components/site/social-icons';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { home } from '@/routes';
import { index as articlesIndex } from '@/routes/site/articles';
import { show as pageShow } from '@/routes/site/pages';
import { index as projectsIndex } from '@/routes/site/projects';
import { cn } from '@/lib/utils';

type NavLink = { label: string; href: string };

const navLinks: NavLink[] = [
    { label: 'Articles', href: articlesIndex().url },
    { label: 'Projects', href: projectsIndex().url },
    { label: 'About', href: pageShow('about').url },
    { label: 'Contact', href: pageShow('contact').url },
];

const socials = [
    { label: 'GitHub', href: 'https://github.com/Mizuan', Icon: GithubIcon },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/mizuanmohamed/',
        Icon: LinkedinIcon,
    },
    { label: 'X', href: 'https://x.com/mizuanmohamed', Icon: XIcon },
    {
        label: 'Instagram',
        href: 'https://instagram.com/mizuanmohamed',
        Icon: InstagramIcon,
    },
    { label: 'Email', href: 'mailto:mizuan.mohamed@gmail.com', Icon: Mail },
];

const avatarUrl = '/avatar.png';

export default function SiteLayout({ children }: { children: ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const currentUrl = usePage().url;
    const homeUrl = home().url;

    const isActive = (href: string) =>
        href === homeUrl ? currentUrl === href : currentUrl.startsWith(href);

    return (
        <div className="flex min-h-svh flex-col bg-background text-foreground">
            {/* Mobile top bar */}
            <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                    <Brand />
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <button
                                type="button"
                                className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Open menu"
                            >
                                <Menu className="size-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-72 p-6 sm:max-w-sm"
                        >
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                            <div className="mt-8">
                                <Brand />
                            </div>
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
                            <div className="mt-10 border-t pt-6">
                                <div className="flex items-center gap-4 text-muted-foreground">
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
                </div>
            </header>

            {/* Desktop 3-col grid / mobile single column */}
            <div className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 lg:grid lg:grid-cols-[180px_minmax(0,1fr)_260px] lg:gap-10 lg:px-6 lg:pt-16">
                <aside className="hidden lg:block">
                    <div className="sticky top-10">
                        <Brand />
                        <nav className="mt-10 flex flex-col gap-2 text-base">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'transition-colors',
                                        isActive(link.href)
                                            ? 'font-semibold text-foreground'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                <main className="min-w-0">{children}</main>

                <aside className="hidden lg:block">
                    <div className="sticky top-10">
                        <AuthorCard />
                    </div>
                </aside>
            </div>

            <footer className="mt-16 border-t">
                <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground lg:px-6">
                    <p>&copy; {new Date().getFullYear()} Mizuan Mohamed.</p>
                </div>
            </footer>
        </div>
    );
}

function Brand() {
    return (
        <Link
            href={home()}
            className="inline-flex items-center gap-2 font-semibold tracking-tight"
        >
            <img src="/logo.png" alt="" className="size-8 rounded" />
            <span className="text-base">Mizuan.dev</span>
        </Link>
    );
}

function AuthorCard() {
    return (
        <div className="space-y-4">
            <img
                src={avatarUrl}
                alt="Mizuan"
                className="size-20 rounded-full border bg-muted"
            />
            <div>
                <p className="text-sm font-semibold">Mizuan Mohamed</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Software developer in Malé, Maldives. Seven years with
                    Laravel, React &amp; TypeScript. Leading a small team at a
                    government SOE.
                </p>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
                {socials.map(({ label, href, Icon }) => (
                    <a
                        key={label}
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noreferrer' : undefined}
                        aria-label={label}
                        className="transition-colors hover:text-foreground"
                    >
                        <Icon className="size-4" />
                    </a>
                ))}
            </div>
        </div>
    );
}
