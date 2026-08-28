import { CropMarks } from '@/components/site/crop-marks';
import { cn } from '@/lib/utils';

const CROSSES = [
    { x: 110, y: 92 },
    { x: 330, y: 238 },
    { x: 152, y: 266 },
];

/** The hero's quiet field: a fading blueprint grid, pencil crosses, one live dot. */
export function HeroGraphic({ className }: { className?: string }) {
    return (
        <div className={cn('relative', className)}>
            <CropMarks />

            <svg
                viewBox="0 0 440 340"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                aria-hidden
                className="size-full"
            >
                <defs>
                    <pattern
                        id="hero-grid"
                        width="22"
                        height="22"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 22 0 H 0 V 22"
                            className="stroke-border"
                            strokeWidth="1"
                        />
                    </pattern>
                    <radialGradient id="hero-fade" cx="50%" cy="46%" r="62%">
                        <stop offset="55%" stopColor="#fff" />
                        <stop offset="100%" stopColor="#000" />
                    </radialGradient>
                    <mask id="hero-mask">
                        <rect width="440" height="340" fill="url(#hero-fade)" />
                    </mask>
                </defs>

                <rect
                    width="440"
                    height="340"
                    fill="url(#hero-grid)"
                    mask="url(#hero-mask)"
                />

                <g
                    className="stroke-muted-foreground"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    opacity="0.55"
                >
                    {CROSSES.map(({ x, y }) => (
                        <path
                            key={`${x}-${y}`}
                            d={`M ${x} ${y - 6} v 12 M ${x - 6} ${y} h 12`}
                        />
                    ))}
                </g>
            </svg>

            <span className="absolute top-[35%] left-[65%] flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex size-2.5 rounded-full bg-brand" />
            </span>
        </div>
    );
}
