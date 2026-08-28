import type { ReactNode } from 'react';
import { SectionLabel } from '@/components/site/section-label';
import { cn } from '@/lib/utils';

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
        <header className={cn('mb-10', className)}>
            {eyebrow && <SectionLabel className="mb-3">{eyebrow}</SectionLabel>}
            <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl">
                {title}
            </h1>
            {description && (
                <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                    {description}
                </p>
            )}
        </header>
    );
}
