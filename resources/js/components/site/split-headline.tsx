import { gsap } from 'gsap';
import { useEffect, useRef  } from 'react';
import type {ElementType} from 'react';
import { cn } from '@/lib/utils';

type Props = {
    text: string;
    as?: ElementType;
    className?: string;
    charClassName?: string;
    delay?: number;
};

/**
 * Splits a line into individual characters that fly in from scattered
 * positions and assemble into words — the "code bits forming the product"
 * motif. Honours reduced-motion by rendering the final state immediately.
 * The full text is exposed to assistive tech via aria-label.
 */
export function SplitHeadline({
    text,
    as: Tag = 'h1',
    className,
    charClassName,
    delay = 0.15,
}: Props) {
    const ref = useRef<HTMLHeadingElement | null>(null);

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
                gsap.set(chars, { opacity: 1, x: 0, y: 0, rotate: 0 });

                return;
            }

            gsap.from(chars, {
                opacity: 0,
                x: () => gsap.utils.random(-220, 220),
                y: () => gsap.utils.random(-140, 140),
                rotate: () => gsap.utils.random(-55, 55),
                duration: 0.9,
                ease: 'power3.out',
                stagger: { each: 0.018, from: 'random' },
                delay,
            });
        }, ref);

        return () => ctx.revert();
    }, [text, delay]);

    const words = text.split(' ');

    return (
        <Tag
            ref={ref}
            aria-label={text}
            className={cn('opacity-0', className)}
        >
            {words.map((word, wi) => (
                <span
                    key={wi}
                    aria-hidden="true"
                    className="inline-block whitespace-nowrap"
                >
                    {[...word].map((char, ci) => (
                        <span
                            key={ci}
                            data-char
                            className={cn('inline-block will-change-transform', charClassName)}
                        >
                            {char}
                        </span>
                    ))}
                    {wi < words.length - 1 && (
                        <span className="inline-block">&nbsp;</span>
                    )}
                </span>
            ))}
        </Tag>
    );
}
