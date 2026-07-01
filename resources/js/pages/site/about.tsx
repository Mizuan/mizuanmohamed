import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { HumanSilhouette } from '@/components/site/human-silhouette';
import { SeoHead } from '@/components/site/seo-head';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';
import { SplitHeadline } from '@/components/site/split-headline';

gsap.registerPlugin(ScrollTrigger);

// A tileable film-grain texture (SVG fractal noise) for the cinematic overlay.
const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

type Section = {
    label: string;
    title: string;
    body: string;
    tags: string[];
};

// Used when the about page has no sections configured in the admin yet.
const DEFAULT_SECTIONS: Section[] = [
    {
        label: 'Intro',
        title: 'About',
        body: "I'm Mizuan, a full-stack developer based in Malé, Maldives. For over seven years I've built fast, considered web applications end to end, from the data model to the last micro-interaction.\n\nI care about the whole arc of a product, and about software that feels quick, considered, and quietly reliable.",
        tags: [],
    },
    {
        label: 'Experience',
        title: 'Experience',
        body: 'I currently lead a small development team at a government SOE, shipping products with Laravel, React, and TypeScript.\n\nMy work spans the full lifecycle: data modelling and architecture, backend APIs, polished frontends, and the infrastructure that holds it all together.',
        tags: [],
    },
    {
        label: 'Approach',
        title: 'Approach',
        body: 'Good software feels obvious in hindsight. I sweat the details, the motion, the empty states, the edge cases, because those are the things people actually feel.\n\nI like building from the raw structure outward: a solid core, then a considered layer of craft on top.',
        tags: [],
    },
    {
        label: 'Toolkit',
        title: 'Toolkit',
        body: '',
        tags: [
            'Laravel',
            'PHP',
            'React',
            'TypeScript',
            'Inertia.js',
            'Tailwind CSS',
            'PostgreSQL',
            'MySQL',
            'Redis',
            'Node.js',
            'AWS',
            'Git',
        ],
    },
];

const pad = (n: number) => String(n).padStart(2, '0');

export default function About({
    metaDescription,
    sections: configured,
}: {
    metaDescription?: string | null;
    sections?: Section[] | null;
}) {
    const sections =
        configured && configured.length > 0 ? configured : DEFAULT_SECTIONS;
    const root = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const reduce = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        const ctx = gsap.context(() => {
            if (reduce) {
                gsap.set('[data-reveal]', { opacity: 1, y: 0 });

                return;
            }

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

            gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
                gsap.from(el, {
                    y: 40,
                    opacity: 0,
                    duration: 0.85,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' },
                });
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={root}
            className="dark min-h-svh bg-background text-foreground antialiased"
        >
            <SeoHead title="About" description={metaDescription ?? undefined} />

            <SiteNav />

            {/* ── Hero: giant ABOUT with a silhouette in the negative space ── */}
            <section className="relative isolate flex h-svh min-h-160 flex-col items-center justify-center overflow-hidden">
                <div
                    data-glow
                    aria-hidden
                    className="absolute top-1/2 left-1/2 -z-10 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
                    style={{
                        background:
                            'radial-gradient(circle at center, rgba(255,72,44,0.55), rgba(206,26,16,0.25) 46%, transparent 72%)',
                    }}
                />

                <p className="absolute top-24 left-1/2 flex -translate-x-1/2 items-center gap-2 font-display text-xs font-medium tracking-[0.22em] text-white/60 uppercase">
                    <Globe className="size-3.5" strokeWidth={1.5} />
                    Malé, Maldives — Full-Stack Developer
                </p>

                <div className="relative">
                    <SplitHeadline
                        text="About"
                        className="font-display text-[clamp(4.5rem,27vw,20rem)] leading-none font-bold tracking-[-0.04em] text-brand uppercase"
                    />
                    <HumanSilhouette className="absolute bottom-0 left-1/2 z-20 h-[62%] -translate-x-1/2 translate-y-[14%]" />
                </div>

                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-10 opacity-[0.13] mix-blend-overlay"
                    style={{ backgroundImage: GRAIN }}
                />

                <span
                    aria-hidden
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 font-display text-[11px] font-medium tracking-[0.24em] text-white/40 uppercase"
                >
                    Scroll
                </span>
            </section>

            {/* ── Editable sections as cinematic editorial blocks ── */}
            <div className="mx-auto w-full max-w-6xl px-6 pb-32 lg:px-8 lg:pb-48">
                {sections.map((section, i) => (
                    <section
                        key={i}
                        data-reveal
                        className="grid gap-6 border-t border-border py-16 lg:grid-cols-12 lg:gap-10 lg:py-24"
                    >
                        <div className="flex items-center gap-4 lg:col-span-3 lg:flex-col lg:items-start lg:gap-3">
                            <span className="font-display text-xs font-medium text-brand tabular-nums">
                                {pad(i + 1)}
                            </span>
                            <span className="font-display text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                                {section.label}
                            </span>
                        </div>

                        <div className="lg:col-span-9">
                            <h2 className="font-display text-[clamp(2rem,5.5vw,3.75rem)] leading-[0.95] font-semibold tracking-[-0.03em] uppercase">
                                {section.title}
                            </h2>

                            {section.body && (
                                <div className="mt-6 max-w-2xl space-y-5 text-lg leading-relaxed text-muted-foreground">
                                    {section.body
                                        .split(/\n\n+/)
                                        .filter(Boolean)
                                        .map((paragraph, p) => (
                                            <p key={p}>{paragraph}</p>
                                        ))}
                                </div>
                            )}

                            {section.tags.length > 0 && (
                                <div className="mt-8 flex flex-wrap gap-2">
                                    {section.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-border px-3.5 py-1.5 font-display text-xs font-medium tracking-wide transition-colors hover:border-brand hover:text-brand"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                ))}
            </div>

            <SiteFooter />
        </div>
    );
}
