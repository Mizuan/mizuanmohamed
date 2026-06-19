import { cn } from '@/lib/utils';

/**
 * The Mizuan.dev brand monogram — a serif "M" in a rounded square. Replaces
 * the old logo image and adapts to the current theme. Pass sizing via
 * `className` (e.g. `size-8 text-lg`).
 */
export default function BrandMark({ className }: { className?: string }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'inline-flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-foreground font-serif text-lg leading-none font-medium text-background',
                className,
            )}
        >
            M
        </span>
    );
}
