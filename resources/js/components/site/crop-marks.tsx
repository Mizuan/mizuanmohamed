import { cn } from '@/lib/utils';

/** Filament-style corner ticks that frame a card or graphic. */
export function CropMarks({ className }: { className?: string }) {
    const corners = [
        'top-0 left-0 border-t border-l',
        'top-0 right-0 border-t border-r',
        'bottom-0 left-0 border-b border-l',
        'bottom-0 right-0 border-b border-r',
    ];

    return (
        <span
            aria-hidden
            className={cn(
                'pointer-events-none absolute -inset-2 text-border',
                className,
            )}
        >
            {corners.map((corner) => (
                <span
                    key={corner}
                    className={cn('absolute size-3 border-current', corner)}
                />
            ))}
        </span>
    );
}
