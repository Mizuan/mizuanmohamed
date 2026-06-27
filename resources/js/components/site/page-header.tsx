import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The shared editorial page header used across the public site: a small
 * uppercase eyebrow label above a large Fraunces display title, matching the
 * home page aesthetic.
 */
export function PageHeader({
    eyebrow,
    title,
    description,
    className,
}: {
    eyebrow?: string;
    title: ReactNode;
    description?: ReactNode;
    className?: string;
}) {
    return (
        <header className={cn('mb-12 lg:mb-16', className)}>
            {eyebrow && (
                <p className="mb-5 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                    {eyebrow}
                </p>
            )}
            <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[1.02] font-medium tracking-[-0.02em] text-balance">
                {title}
            </h1>
            {description && (
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    {description}
                </p>
            )}
        </header>
    );
}
