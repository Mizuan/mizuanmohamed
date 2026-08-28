import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';

export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-svh flex-col bg-background text-foreground antialiased">
            <SiteNav />

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 pt-12 pb-20 lg:px-8 lg:pt-16">
                {children}
            </main>

            <SiteFooter />
        </div>
    );
}
