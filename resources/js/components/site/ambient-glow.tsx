import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// A tileable film-grain texture (SVG fractal noise) for the cinematic overlay.
const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * A cinematic ambient background: a warm "doorway of light" that slowly
 * breathes and drifts on near-black, under a film-grain overlay and a vignette.
 * Honours reduced-motion (renders a static glow).
 */
export function AmbientGlow({ className }: { className?: string }) {
    const glow = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = glow.current;

        if (!el) {
            return;
        }

        gsap.set(el, { xPercent: -50, yPercent: -50, transformOrigin: 'center' });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const ctx = gsap.context(() => {
            // Pronounced brightness + scale "breathe".
            gsap.fromTo(
                el,
                { scaleX: 0.9, scaleY: 0.92, opacity: 0.45 },
                {
                    scaleX: 1.35,
                    scaleY: 1.14,
                    opacity: 1,
                    duration: 3.8,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                },
            );
            // Slow lateral drift so the light feels alive.
            gsap.to(el, {
                xPercent: -42,
                yPercent: -55,
                duration: 7,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className={cn('overflow-hidden bg-[#0a0605]', className)}>
            <div
                ref={glow}
                className="absolute top-1/2 left-1/2 h-[48%] w-[66%] rounded-[45%] blur-[70px] will-change-transform"
                style={{
                    background:
                        'radial-gradient(ellipse at center, rgba(255,94,40,0.95), rgba(198,36,22,0.45) 38%, transparent 72%)',
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
                style={{ backgroundImage: GRAIN }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.72))',
                }}
            />
        </div>
    );
}
