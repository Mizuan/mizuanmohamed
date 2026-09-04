import { cn } from '@/lib/utils';

/** Text that briefly loses signal, like a mistuned broadcast. */
export function GlitchText({
    text,
    className,
}: {
    text: string;
    className?: string;
}) {
    return (
        <span data-text={text} className={cn('glitch', className)}>
            {text}
        </span>
    );
}
