import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export type TideBand = {
    label: string;
    href: string;
    info: [string, string];
    ink?: boolean;
};

const HEIGHTS = ['78%', '64%', '50%', '36%'];
const SHADES = ['#ecebe8', '#e2e0dc', '#d7d4cf'];
const STEP_MS = 70;

/** Bands rise from the bottom like a tide and settle at falling heights. */
export function TideMenu({ bands }: { bands: TideBand[] }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <>
            <button
                type="button"
                aria-expanded={open}
                aria-controls="tide-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((value) => !value)}
                className="fixed top-4 right-4 z-50 grid size-10 place-items-center text-foreground transition-colors hover:text-brand"
            >
                {open ? (
                    <X className="size-6" strokeWidth={1.75} />
                ) : (
                    <Menu className="size-6" strokeWidth={1.75} />
                )}
            </button>

            <nav
                id="tide-menu"
                aria-label="Site"
                aria-hidden={!open}
                className={cn(
                    'fixed inset-0 z-40 grid grid-rows-4 sm:left-auto sm:w-[min(66vw,980px)] sm:grid-cols-4 sm:grid-rows-1 sm:items-end',
                    !open && 'pointer-events-none',
                )}
            >
                {bands.map((band, index) => {
                    // Rise left to right, fall back right to left.
                    const delay =
                        (open ? index : bands.length - 1 - index) * STEP_MS;

                    return (
                        <Link
                            key={band.href}
                            href={band.href}
                            tabIndex={open ? 0 : -1}
                            onClick={() => setOpen(false)}
                            style={
                                {
                                    '--h': HEIGHTS[index] ?? '36%',
                                    backgroundColor: band.ink
                                        ? undefined
                                        : SHADES[index],
                                    transitionDelay: `${delay}ms, 0ms, 0ms`,
                                } as CSSProperties
                            }
                            className={cn(
                                'group flex items-end justify-between px-5 py-4 transition-[translate,background-color,color] duration-700 ease-[cubic-bezier(.76,0,.24,1)] hover:!bg-brand hover:text-white focus-visible:!bg-brand focus-visible:text-white motion-reduce:transition-none sm:h-(--h) sm:flex-col sm:items-start sm:px-5 sm:pt-5 sm:pb-6',
                                band.ink
                                    ? 'bg-foreground text-background'
                                    : 'text-foreground',
                                open
                                    ? 'translate-x-0 sm:translate-y-0'
                                    : 'translate-x-[101%] sm:translate-x-0 sm:translate-y-[101%]',
                            )}
                        >
                            <span className="font-display text-[clamp(2rem,10vw,2.8rem)] leading-[0.9] font-bold tracking-[-0.05em] sm:text-[clamp(1.8rem,3.4vw,3.2rem)]">
                                {band.label}
                            </span>
                            <span
                                className={cn(
                                    'text-right font-display text-[13px] leading-snug font-semibold transition-colors group-hover:text-white/80 sm:text-left',
                                    band.ink
                                        ? 'text-background/65'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {band.info[0]}
                                <br />
                                {band.info[1]}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
