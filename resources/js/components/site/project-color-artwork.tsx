import { useMemo } from 'react';
import { cn } from '@/lib/utils';

// Curated bold solids — each project gets a distinct one, deterministically.
const PALETTE = [
    '#2f56d8', // blue
    '#e2552b', // orange
    '#1f9d57', // green
    '#7b3ff2', // purple
    '#d9356a', // pink
    '#0d9488', // teal
    '#e0a30b', // amber
    '#3949c4', // indigo
    '#c026d3', // magenta
    '#65a30d', // lime
];

function hashSeed(input: string): number {
    let h = 2166136261;

    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }

    return h >>> 0;
}

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

const W = 100;
const H = 130;

/**
 * A bold, full-bleed abstract artwork on a solid colour, unique per project.
 * White geometric forms over a deterministic palette colour — used in place of
 * project screenshots.
 */
export function ProjectColorArtwork({
    seed,
    className,
}: {
    seed: string;
    className?: string;
}) {
    const { color, shapes } = useMemo(() => {
        const rand = makeRandom(hashSeed(seed));
        const color = PALETTE[Math.floor(rand() * PALETTE.length)];
        const variant = Math.floor(rand() * 5);
        const cx = W * (0.4 + rand() * 0.3);
        const cy = H * (0.35 + rand() * 0.3);

        const white = (o: number) => `rgba(255,255,255,${o})`;
        const ink = (o: number) => `rgba(0,0,0,${o})`;

        let content: React.ReactNode;

        switch (variant) {
            case 0: // disc + offset ring
                content = (
                    <>
                        <circle
                            cx={cx}
                            cy={cy}
                            r={34 + rand() * 12}
                            fill={white(0.92)}
                        />
                        <circle
                            cx={cx + 14}
                            cy={cy + 18}
                            r={52 + rand() * 10}
                            fill="none"
                            stroke={ink(0.16)}
                            strokeWidth={2}
                        />
                    </>
                );
                break;
            case 1: // concentric rings
                content = (
                    <>
                        {Array.from({ length: 7 }).map((_, i) => (
                            <circle
                                key={i}
                                cx={cx}
                                cy={cy}
                                r={10 + i * 12}
                                fill="none"
                                stroke={white(0.18 + i * 0.06)}
                                strokeWidth={2}
                            />
                        ))}
                        <circle cx={cx} cy={cy} r={6} fill={white(0.95)} />
                    </>
                );
                break;
            case 2: // rising triangle + bar
                content = (
                    <>
                        <rect
                            x={0}
                            y={cy}
                            width={W}
                            height={6}
                            fill={ink(0.14)}
                        />
                        <polygon
                            points={`${cx},${cy - 60} ${cx - 42},${cy} ${cx + 42},${cy}`}
                            fill={white(0.92)}
                        />
                    </>
                );
                break;
            case 3: // diagonal bars
                content = (
                    <>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <rect
                                key={i}
                                x={-30 + i * 26}
                                y={-20}
                                width={12}
                                height={H + 40}
                                transform={`rotate(18 ${-30 + i * 26} 0)`}
                                fill={i % 2 ? white(0.16) : ink(0.1)}
                            />
                        ))}
                        <circle cx={cx} cy={cy} r={26} fill={white(0.92)} />
                    </>
                );
                break;
            default: // corner arcs + dot
                content = (
                    <>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <circle
                                key={i}
                                cx={0}
                                cy={H}
                                r={36 + i * 24}
                                fill="none"
                                stroke={white(0.28 - i * 0.05)}
                                strokeWidth={2}
                            />
                        ))}
                        <circle
                            cx={W * 0.66}
                            cy={H * 0.3}
                            r={22 + rand() * 10}
                            fill={white(0.92)}
                        />
                    </>
                );
        }

        return { color, shapes: content };
    }, [seed]);

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            className={cn('size-full', className)}
            style={{ backgroundColor: color }}
        >
            {shapes}
        </svg>
    );
}
