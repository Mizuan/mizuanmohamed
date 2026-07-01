import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import type { ElementType } from 'react';
import { cn } from '@/lib/utils';

type Props = {
    text: string;
    as?: ElementType;
    className?: string;
    charClassName?: string;
    delay?: number;
    stagger?: number;
    duration?: number;
};

/**
 * Reveals a line (or lines, split on "\n") one character at a time: each glyph
 * slides up, fades, and unblurs into place. Honours reduced-motion by rendering
 * the final state immediately, and exposes the full text via aria-label.
 */
export function SplitText({
    text,
    as: Tag = 'span',
    className,
    charClassName,
    delay = 0,
    stagger = 0.03,
    duration = 0.7,
}: Props) {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const el = ref.current;

        if (!el) {
            return;
        }

        const chars = el.querySelectorAll<HTMLElement>('[data-char]');
        const reduce = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        const ctx = gsap.context(() => {
            gsap.set(el, { opacity: 1 });

            if (reduce) {
                gsap.set(chars, { opacity: 1, yPercent: 0, filter: 'blur(0px)' });

                return;
            }

            gsap.fromTo(
                chars,
                { opacity: 0, yPercent: 70, filter: 'blur(6px)' },
                {
                    opacity: 1,
                    yPercent: 0,
                    filter: 'blur(0px)',
                    duration,
                    ease: 'power3.out',
                    stagger,
                    delay,
                },
            );
        }, ref);

        return () => ctx.revert();
    }, [text, delay, stagger, duration]);

    const lines = text.split('\n');
    let charIndex = 0;

    return (
        <Tag ref={ref} aria-label={text} className={cn('opacity-0', className)}>
            {lines.map((line, li) => (
                <span key={li} aria-hidden="true" className="block">
                    {line.split(' ').map((word, wi) => (
                        <span
                            key={wi}
                            className="inline-block whitespace-nowrap"
                        >
                            {[...word].map((char) => (
                                <span
                                    key={charIndex++}
                                    data-char
                                    className={cn(
                                        'inline-block will-change-transform',
                                        charClassName,
                                    )}
                                >
                                    {char}
                                </span>
                            ))}
                            {wi < line.split(' ').length - 1 && (
                                <span className="inline-block">&nbsp;</span>
                            )}
                        </span>
                    ))}
                </span>
            ))}
        </Tag>
    );
}
