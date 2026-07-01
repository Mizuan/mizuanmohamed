import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * A clean, full-body human silhouette that stands in the light: a filled figure
 * with a warm rim-glow so it reads on both the red glow and the black around
 * it. It breathes and sways very gently; static under reduced-motion.
 */
export function HumanSilhouette({ className }: { className?: string }) {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const el = ref.current;

        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const ctx = gsap.context(() => {
            // Gentle breathing.
            gsap.to('[data-breathe]', {
                scaleY: 1.015,
                scaleX: 1.008,
                transformOrigin: 'center bottom',
                duration: 2.6,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
            });
            // Slow weight-shift sway.
            gsap.to(el, {
                rotate: 1.1,
                transformOrigin: 'center bottom',
                duration: 5.5,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
            });
        }, ref);

        return () => ctx.revert();
    }, []);

    return (
        <svg
            ref={ref}
            viewBox="0 0 100 232"
            aria-hidden
            className={cn('text-[#070405]', className)}
            style={{
                filter: 'drop-shadow(0 0 10px rgba(255,72,44,0.55)) drop-shadow(0 0 34px rgba(255,72,44,0.3))',
            }}
        >
            <g data-breathe fill="currentColor">
                {/* head */}
                <ellipse cx="50" cy="18" rx="11" ry="12.5" />
                {/* neck */}
                <path d="M44 28h12v9H44z" />
                {/* torso — shoulders tapering to hips */}
                <path d="M50 33c9 0 15 5 16 13l3 40c.4 6-3 9-8 9H39c-5 0-8.4-3-8-9l3-40c1-8 7-13 16-13Z" />
                {/* left arm, slightly out */}
                <path
                    d="M37 40c-4 2-6 6-7 12l-6 40c-.6 4 5 5 6 1l7-34Z"
                    strokeLinejoin="round"
                />
                {/* right arm, slightly out */}
                <path d="M63 40c4 2 6 6 7 12l6 40c.6 4-5 5-6 1l-7-34Z" />
                {/* left leg */}
                <path d="M42 92h7l-1 68c-.2 6-8 6-8.4 0l-1-52c-.2-8 .8-13 3.4-16Z" />
                {/* right leg */}
                <path d="M58 92h-7l1 68c.2 6 8 6 8.4 0l1-52c.2-8-.8-13-3.4-16Z" />
            </g>
        </svg>
    );
}
