import { cn } from '@/lib/utils';

/**
 * The brand monogram — the favicon's red "M" on a near-black tile, identical
 * in both themes. Pass sizing via `className` (e.g. `size-8 text-lg`).
 */
export default function BrandMark({ className }: { className?: string }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'inline-flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-[#0a0506] font-poster text-lg leading-none text-brand',
                className,
            )}
        >
            M
        </span>
    );
}
