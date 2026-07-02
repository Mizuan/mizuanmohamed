import { gsap } from 'gsap';
import { ArrowDownRight, Check, Copy, Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LocalClock } from '@/components/site/local-clock';
import { SeoHead } from '@/components/site/seo-head';
import { SiteNav } from '@/components/site/site-nav';
import { SplitText } from '@/components/site/split-text';
import { cn } from '@/lib/utils';

const EMAIL = 'mizuan.mohamed@gmail.com';

const LINKS = [
    { label: 'Email', href: `mailto:${EMAIL}` },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mizuanmohamed/' },
    { label: 'GitHub', href: 'https://github.com/Mizuan' },
    { label: 'X', href: 'https://x.com/mizuanmohamed' },
];

// A tileable film-grain texture (SVG fractal noise) for the cinematic overlay.
const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Contact({
    metaDescription,
}: {
    metaDescription?: string | null;
}) {
    const root = useRef<HTMLDivElement | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.contact-fade',
                { opacity: 0, y: 16 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    stagger: 0.09,
                    delay: 0.2,
                },
            );
            gsap.fromTo(
                '[data-glow]',
                { scale: 0.94, opacity: 0.6 },
                {
                    scale: 1.14,
                    opacity: 1,
                    duration: 4,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                },
            );
            gsap.to('[data-spin]', {
                rotate: 360,
                duration: 22,
                ease: 'none',
                repeat: -1,
            });
        }, root);

        return () => ctx.revert();
    }, []);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            window.location.href = `mailto:${EMAIL}`;
        }
    };

    return (
        <div
            ref={root}
            className="dark relative isolate flex min-h-svh flex-col overflow-hidden bg-background text-foreground antialiased"
        >
            <SeoHead title="Contact" description={metaDescription ?? undefined} />

            <SiteNav />

            {/* Ambient glow */}
            <div
                data-glow
                aria-hidden
                className="absolute top-1/2 left-1/2 -z-10 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
                style={{
                    background:
                        'radial-gradient(circle at center, rgba(255,72,44,0.42), rgba(206,26,16,0.18) 46%, transparent 72%)',
                }}
            />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-32 lg:px-8">
                <p className="contact-fade flex items-center gap-2 font-display text-xs font-medium tracking-[0.24em] text-brand uppercase">
                    <Globe className="size-3.5" strokeWidth={1.5} />
                    Contact — Available for work
                </p>

                <SplitText
                    as="h1"
                    text={"Let's\ntalk"}
                    delay={0.25}
                    stagger={0.05}
                    duration={0.8}
                    className="mt-6 font-poster text-[clamp(3.5rem,14vw,11rem)] leading-[0.9] font-normal tracking-[-0.01em] text-brand uppercase"
                />

                <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="contact-fade min-w-0">
                        {/* Click-to-copy email */}
                        <button
                            type="button"
                            onClick={copyEmail}
                            className="group inline-flex max-w-full flex-wrap items-center gap-3 text-left font-display text-[clamp(1.15rem,3.5vw,2.25rem)] font-semibold tracking-[-0.02em] break-all transition-colors hover:text-brand"
                        >
                            {EMAIL}
                            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-brand group-hover:text-brand">
                                {copied ? (
                                    <Check className="size-4" />
                                ) : (
                                    <Copy className="size-3.5" />
                                )}
                            </span>
                        </button>
                        <p className="mt-2 h-4 font-display text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                            {copied ? 'Copied to clipboard' : 'Click to copy'}
                        </p>

                        {/* Social text links */}
                        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                            {LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target={
                                        link.href.startsWith('http')
                                            ? '_blank'
                                            : undefined
                                    }
                                    rel={
                                        link.href.startsWith('http')
                                            ? 'noreferrer'
                                            : undefined
                                    }
                                    className="font-display text-sm font-medium tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-brand"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Rotating availability badge */}
                    <RotatingBadge className="contact-fade self-start lg:self-end" />
                </div>
            </main>

            {/* Chrome: location + live clock */}
            <div className="contact-fade pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-6 pb-8 font-display text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase lg:px-8">
                <span>Malé, Maldives</span>
                <LocalClock className="tabular-nums" />
            </div>

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 opacity-[0.12] mix-blend-overlay"
                style={{ backgroundImage: GRAIN }}
            />
        </div>
    );
}

/** A slowly rotating circular badge with an arrow — the page's playful anchor. */
function RotatingBadge({ className }: { className?: string }) {
    return (
        <div className={cn('relative size-36 shrink-0 sm:size-44', className)}>
            <svg
                data-spin
                viewBox="0 0 200 200"
                className="size-full text-brand"
                aria-hidden
            >
                <defs>
                    <path
                        id="badge-circle"
                        d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
                    />
                </defs>
                <text
                    fill="currentColor"
                    className="font-display text-[15px] font-semibold tracking-[0.12em] uppercase"
                >
                    <textPath href="#badge-circle" startOffset="0">
                        Available for work · Let&apos;s build something ·
                    </textPath>
                </text>
            </svg>
            <ArrowDownRight
                className="absolute top-1/2 left-1/2 size-9 -translate-x-1/2 -translate-y-1/2 text-brand"
                strokeWidth={1.5}
            />
        </div>
    );
}
