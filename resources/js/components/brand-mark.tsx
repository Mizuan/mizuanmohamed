import { cn } from '@/lib/utils';

/**
 * The brand monogram — a white "M" on a brand-red tile, identical in both
 * themes. Pass sizing via `className` (e.g. `size-8 text-lg`).
 */
export default function BrandMark({ className }: { className?: string }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'inline-flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-brand font-display text-lg font-semibold leading-none text-white',
                className,
            )}
        >
            M
        </span>
    );
}
