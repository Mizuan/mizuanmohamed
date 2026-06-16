import { useEffect, useRef } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
};

const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A lightweight, theme-aware constellation field rendered on a 2D canvas.
 * Particles drift, link to nearby neighbours, and lean gently toward the
 * pointer. Honours reduced-motion (renders a single static frame) and pauses
 * automatically while the tab is hidden.
 */
export function HeroCanvas({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { resolvedAppearance } = useAppearance();

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        const isDark = resolvedAppearance === 'dark';
        const ink = isDark ? '255, 255, 255' : '17, 17, 17';
        const reduced = prefersReducedMotion();

        let width = 0;
        let height = 0;
        let dpr = 1;
        let particles: Particle[] = [];
        let raf = 0;
        const pointer = { x: -9999, y: -9999, active: false };

        const seed = () => {
            const area = width * height;
            const target = Math.min(110, Math.max(28, Math.round(area / 16000)));
            particles = Array.from({ length: target }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 1.6 + 0.6,
            }));
        };

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            seed();
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            const linkDist = Math.min(160, width / 6);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (!reduced) {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (pointer.active) {
                        const dx = pointer.x - p.x;
                        const dy = pointer.y - p.y;
                        const dist = Math.hypot(dx, dy);

                        if (dist < 140 && dist > 0.001) {
                            const pull = (1 - dist / 140) * 0.6;
                            p.x += (dx / dist) * pull;
                            p.y += (dy / dist) * pull;
                        }
                    }

                    if (p.x < 0 || p.x > width) {
                        p.vx *= -1;
                    }

                    if (p.y < 0 || p.y > height) {
                        p.vy *= -1;
                    }

                    p.x = Math.max(0, Math.min(width, p.x));
                    p.y = Math.max(0, Math.min(height, p.y));
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${ink}, ${isDark ? 0.55 : 0.5})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dist = Math.hypot(p.x - q.x, p.y - q.y);

                    if (dist < linkDist) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(${ink}, ${(1 - dist / linkDist) * 0.18})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            if (!reduced) {
                raf = requestAnimationFrame(draw);
            }
        };

        const onPointerMove = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = event.clientX - rect.left;
            pointer.y = event.clientY - rect.top;
            pointer.active = true;
        };

        const onPointerLeave = () => {
            pointer.active = false;
            pointer.x = -9999;
            pointer.y = -9999;
        };

        const onVisibility = () => {
            if (reduced) {
                return;
            }

            cancelAnimationFrame(raf);

            if (!document.hidden) {
                raf = requestAnimationFrame(draw);
            }
        };

        resize();
        draw();

        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerleave', onPointerLeave);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerleave', onPointerLeave);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [resolvedAppearance]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={className}
        />
    );
}
