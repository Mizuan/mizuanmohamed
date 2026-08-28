import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** The site's recurring motif: a small red dash ahead of a section label. */
export function SectionLabel({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <p
            className={cn(
                'flex items-center gap-2 font-display text-sm font-medium text-muted-foreground',
                className,
            )}
        >
            <span aria-hidden className="text-brand">
                —
            </span>
            {children}
        </p>
    );
}
