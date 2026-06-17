import { useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Hashes a string into a 32-bit seed.
 */
function hashSeed(input: string): number {
    let h = 2166136261;

    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }

    return h >>> 0;
}

/**
 * Mulberry32 — a tiny deterministic PRNG so each project always renders the
 * same artwork.
 */
function makeRandom(seed: number): () => number {
    let state = seed;

    return () => {
        state |= 0;
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const W = 400;
const H = 250;

/**
 * A deterministic, abstract geometric composition used as the backdrop for a
 * project card when it has no image. Shapes are drawn in the current text
 * colour over a dark panel, picking one of several variants from the seed.
 */
export function ProjectArtwork({
    seed,
    className,
}: {
    seed: string;
    className?: string;
}) {
    const shapes = useMemo(() => {
        const rand = makeRandom(hashSeed(seed));
        const variant = Math.floor(rand() * 6);
        const cx = W * (0.45 + rand() * 0.3);
        const cy = H * (0.35 + rand() * 0.25);

        switch (variant) {
            // Eclipse — a large disc with an offset ring and a rising triangle.
            case 0:
                return (
                    <>
                        <circle
                            cx={cx}
                            cy={cy}
                            r={70 + rand() * 25}
                            fill="currentColor"
                        />
                        <circle
                            cx={cx + 20}
                            cy={cy + 30}
                            r={95 + rand() * 20}
                            fill="none"
                            stroke="currentColor"
                            strokeOpacity={0.3}
                        />
                        <polygon
                            points={`${cx},${H} ${cx - 55},${H + 40} ${cx + 55},${H + 40}`}
                            fill="currentColor"
                            opacity={0.85}
                        />
                    </>
                );
            // Concentric rings — a target.
            case 1:
                return (
                    <>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <circle
                                key={i}
                                cx={cx}
                                cy={cy}
                                r={18 + i * 22}
                                fill="none"
                                stroke="currentColor"
                                strokeOpacity={0.18 + i * 0.05}
                            />
                        ))}
                        <circle cx={cx} cy={cy} r={10} fill="currentColor" />
                    </>
                );
            // Stacked bars of varying widths.
            case 2:
                return (
                    <>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <rect
                                key={i}
                                x={40}
                                y={45 + i * 32}
                                width={(0.4 + rand() * 0.55) * (W - 80)}
                                height={14}
                                rx={7}
                                fill="currentColor"
                                opacity={0.35 + i * 0.13}
                            />
                        ))}
                    </>
                );
            // Dot grid with one dominant disc.
            case 3:
                return (
                    <>
                        {Array.from({ length: 6 }).map((_, row) =>
                            Array.from({ length: 9 }).map((_, col) => (
                                <circle
                                    key={`${row}-${col}`}
                                    cx={42 + col * 40}
                                    cy={40 + row * 34}
                                    r={3}
                                    fill="currentColor"
                                    opacity={0.4}
                                />
                            )),
                        )}
                        <circle
                            cx={cx}
                            cy={cy}
                            r={55 + rand() * 25}
                            fill="currentColor"
                        />
                    </>
                );
            // Crossing diagonals over a half-disc.
            case 4:
                return (
                    <>
                        <path
                            d={`M ${cx - 90} ${cy} A 90 90 0 0 1 ${cx + 90} ${cy} Z`}
                            fill="currentColor"
                            opacity={0.9}
                        />
                        {Array.from({ length: 7 }).map((_, i) => (
                            <line
                                key={i}
                                x1={-50 + i * 80}
                                y1={0}
                                x2={50 + i * 80}
                                y2={H}
                                stroke="currentColor"
                                strokeOpacity={0.16}
                            />
                        ))}
                    </>
                );
            // Arc family — sweeping thin lines plus a solid quarter.
            default:
                return (
                    <>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <circle
                                key={i}
                                cx={W}
                                cy={H}
                                r={70 + i * 45}
                                fill="none"
                                stroke="currentColor"
                                strokeOpacity={0.4 - i * 0.06}
                            />
                        ))}
                        <circle
                            cx={cx * 0.6}
                            cy={cy * 0.8}
                            r={34 + rand() * 18}
                            fill="currentColor"
                        />
                    </>
                );
        }
    }, [seed]);

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            className={cn(
                'size-full bg-foreground text-background transition-transform duration-500 group-hover:scale-105',
                className,
            )}
        >
            {shapes}
        </svg>
    );
}
