import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

export default function SiteLayout({ children }: { children: ReactNode }) {
    const isHome = usePage().component === 'site/home';

    useSmoothScroll();

    // Home carries its own chrome: a menu pill instead of the masthead.
    if (isHome) {
        return (
            <div className="min-h-svh bg-background text-foreground antialiased">
                {children}
            </div>
        );
    }

    return (
        <div className="flex min-h-svh flex-col bg-background text-foreground antialiased">
            <SiteNav />

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 pt-10 pb-20 lg:px-8 lg:pt-12">
                {children}
            </main>

            <SiteFooter />
        </div>
    );
}
