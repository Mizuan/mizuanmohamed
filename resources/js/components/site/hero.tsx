import { gsap } from 'gsap';
import { Globe } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { LocalClock } from '@/components/site/local-clock';
import { SplitText } from '@/components/site/split-text';
import { cn } from '@/lib/utils';

// A tileable film-grain texture (SVG fractal noise) for the cinematic overlay.
const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * The home hero: a warm "doorway of light" receding into near-black under film
 * grain and a vignette, with the role headline bleeding off the base. The light
 * slowly breathes and drifts; honours reduced-motion by rendering it static.
 */
export function Hero() {
    const root = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let onMove: ((event: PointerEvent) => void) | undefined;

        const ctx = gsap.context(() => {
            // Entrance: glow fades up, then the chrome staggers in. (The
            // headline runs its own per-character reveal via SplitText.)
            gsap.timeline()
                .fromTo(
                    '.hero-bg',
                    { opacity: 0 },
                    { opacity: 1, duration: 1.1, ease: 'power2.out' },
                )
                .fromTo(
                    '.hero-fade',
                    { opacity: 0, y: 16 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: 'power3.out',
                        stagger: 0.08,
                    },
                    0.25,
                );

            // Ambient life: the light breathes and drifts forever.
            gsap.fromTo(
                '[data-glow]',
                { scale: 0.94, opacity: 0.6 },
                {
                    scale: 1.12,
                    opacity: 1,
                    duration: 4,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                },
            );
            gsap.to('[data-drift]', {
                xPercent: 5,
                yPercent: -4,
                duration: 7,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
            });

            // Cursor parallax: the whole light field leans toward the pointer.
            const bg = root.current?.querySelector('.hero-bg');

            if (bg && !window.matchMedia('(hover: none)').matches) {
                const xTo = gsap.quickTo(bg, 'x', {
                    duration: 0.9,
                    ease: 'power3',
                });
                const yTo = gsap.quickTo(bg, 'y', {
                    duration: 0.9,
                    ease: 'power3',
                });

                onMove = (event) => {
                    xTo((event.clientX / window.innerWidth - 0.5) * 34);
                    yTo((event.clientY / window.innerHeight - 0.5) * 26);
                };

                window.addEventListener('pointermove', onMove);
            }
        }, root);

        return () => {
            if (onMove) {
                window.removeEventListener('pointermove', onMove);
            }

            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={root}
            className="dark relative isolate flex h-svh min-h-160 flex-col overflow-hidden bg-[#080405] text-foreground"
        >
            {/* Doorway: bright core + horizontal spread of light */}
            <div className="hero-bg absolute inset-0 -z-10 will-change-transform">
                <div
                    data-drift
                    className="absolute top-[42%] left-1/2 h-[30%] w-[86%] -translate-x-1/2 -translate-y-1/2 blur-[90px]"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent, rgba(255,72,40,0.45) 32%, rgba(255,96,54,0.7) 50%, rgba(255,72,40,0.45) 68%, transparent)',
                    }}
                />
                <div
                    data-glow
                    className="absolute top-[42%] left-1/2 h-[46%] w-[34%] -translate-x-1/2 -translate-y-1/2 blur-[55px]"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, rgba(255,72,44,1), rgba(206,26,16,0.6) 46%, transparent 74%)',
                    }}
                />
                <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 60% 55% at center 42%, transparent 30%, rgba(0,0,0,0.78))',
                    }}
                />
            </div>

            {/* Corner registration marks */}
            {[
                'left-5 top-24 lg:left-7',
                'right-5 top-24 lg:right-7',
                'bottom-24 left-5 lg:left-7',
                'bottom-24 right-5 lg:right-7',
            ].map((pos) => (
                <span
                    key={pos}
                    aria-hidden
                    className={cn(
                        'hero-fade pointer-events-none absolute z-20 font-display text-lg text-white/25 select-none',
                        pos,
                    )}
                >
                    +
                </span>
            ))}

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-6 pt-24 pb-24 lg:px-8">
                <p className="hero-fade flex items-center gap-2 font-display text-xs font-medium tracking-[0.22em] text-white/60 uppercase">
                    <Globe className="size-3.5" strokeWidth={1.5} />
                    Malé, Maldives
                </p>
                <div>
                    <p className="hero-fade mb-3 font-display text-xs font-medium tracking-[0.24em] text-[#ff5233] uppercase">
                        Portfolio — 2026
                    </p>
                    <SplitText
                        as="h1"
                        text={'Full Stack\nDeveloper'}
                        delay={0.4}
                        stagger={0.04}
                        duration={0.85}
                        className="font-display text-[clamp(2.75rem,11vw,9rem)] leading-[0.86] font-bold tracking-[-0.03em] text-brand uppercase"
                    />
                </div>
            </div>

            {/* Film grain */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 opacity-[0.13] mix-blend-overlay"
                style={{ backgroundImage: GRAIN }}
            />

            {/* Status bar: availability · contact · live clock */}
            <div className="hero-fade pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-6 pb-8 font-display text-[11px] font-medium tracking-[0.14em] text-white/70 uppercase lg:px-8">
                <span>Available for work</span>
                <a
                    href="mailto:mizuan.mohamed@gmail.com"
                    className="pointer-events-auto transition-colors hover:text-white"
                >
                    Contact
                </a>
                <LocalClock className="tabular-nums" />
            </div>
        </section>
    );
}
