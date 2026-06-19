import { Link } from '@inertiajs/react';
import BrandMark from '@/components/brand-mark';
import { HeroCanvas } from '@/components/site/hero-canvas';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
            <HeroCanvas className="pointer-events-none absolute inset-0 -z-10 size-full opacity-50" />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-radial from-background/0 to-background"
            />

            <div className="w-full max-w-sm">
                <div className="rounded-2xl border bg-card/80 p-8 shadow-sm backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-6">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-3"
                        >
                            <BrandMark className="size-11 text-xl" />
                            <span className="font-serif text-lg leading-none font-medium tracking-tight">
                                Mizuan.dev
                            </span>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="font-serif text-2xl font-medium tracking-tight">
                                {title}
                            </h1>
                            <p className="text-sm text-balance text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">{children}</div>
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Mizuan Mohamed
                </p>
            </div>
        </div>
    );
}
