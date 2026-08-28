import { Link } from '@inertiajs/react';
import BrandMark from '@/components/brand-mark';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

/**
 * Auth chrome for the admin subdomain: a quiet, professional centred card —
 * no site theatrics, just the brand mark, a clear heading, and the form. A
 * thin brand-red hairline at the top of the card is the only flourish.
 */
export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-6 md:p-10 dark:bg-background">
            <div className="w-full max-w-sm">
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div aria-hidden className="h-0.5 bg-brand" />

                    <div className="p-8">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-3"
                        >
                            <BrandMark className="size-9 text-xl" />
                            <span className="font-display text-sm font-semibold tracking-[0.16em] uppercase">
                                Mizuan Mohamed
                            </span>
                        </Link>

                        <div className="mt-7 space-y-1.5">
                            <h1 className="font-display text-xl font-semibold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        <div className="mt-7">{children}</div>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Mizuan Mohamed · Admin
                </p>
            </div>
        </div>
    );
}
