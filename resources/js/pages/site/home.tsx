import { Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Globe, Mail } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { HeroCanvas } from '@/components/site/hero-canvas';
import { LocalClock } from '@/components/site/local-clock';
import { ProjectArtwork } from '@/components/site/project-artwork';
import { ProjectCard } from '@/components/site/project-card';
import { SeoHead } from '@/components/site/seo-head';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';
import { SplitHeadline } from '@/components/site/split-headline';
import { cn } from '@/lib/utils';
import { index as articlesIndex, show as articleShow } from '@/routes/site/articles';
import { index as projectsIndex } from '@/routes/site/projects';

gsap.registerPlugin(ScrollTrigger);

type LatestArticle = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    published_at: string | null;
};

type FeaturedProject = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    tags: string[] | null;
    technologies: string[] | null;
    image: string | null;
    link: string | null;
};

type Props = {
    latestArticles: LatestArticle[];
    featuredProjects: FeaturedProject[];
};

export default function Home({ latestArticles, featuredProjects }: Props) {
    const root = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const reduce = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        const ctx = gsap.context(() => {
            if (reduce) {
                gsap.set('[data-reveal], .hero-fade', {
                    opacity: 1,
                    y: 0,
                });

                return;
            }

            gsap.from('.hero-fade', {
                y: 24,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.12,
                delay: 0.6,
            });

            gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
                gsap.from(el, {
                    y: 40,
                    opacity: 0,
                    duration: 0.85,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                    },
                });
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={root}
            className="min-h-svh bg-background text-foreground antialiased"
        >
            <SeoHead
                title="Mizuan Mohamed — Full-Stack Developer"
                description="Full-stack developer in Malé, Maldives. Seven years building web apps with Laravel, React, and TypeScript. Selected work, writing, and notes from the modern web."
            />

            <SiteNav darkTop />

            {/* ── Hero (always dark) ─────────────────────────────── */}
            <section className="dark relative isolate flex h-svh min-h-160 flex-col overflow-hidden bg-background text-foreground">
                <HeroCanvas
                    className="absolute inset-0 -z-10 h-full w-full"
                    tone="dark"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/0 via-background/0 to-background"
                />

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
                            'pointer-events-none absolute font-display text-lg text-muted-foreground/40 select-none',
                            pos,
                        )}
                    >
                        +
                    </span>
                ))}

                <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pt-24 pb-8 lg:px-8">
                    {/* Top half: centered statement */}
                    <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                        <p className="hero-fade flex items-center justify-center gap-2 font-display text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                            <Globe className="size-3.5" strokeWidth={1.5} />
                            Malé, Maldives
                        </p>
                        <SplitHeadline
                            text="Full-Stack Software Developer"
                            className="mt-5 max-w-3xl font-display text-[clamp(2rem,6vw,4.25rem)] leading-[0.95] font-semibold tracking-[-0.02em] uppercase"
                        />
                    </div>

                    {/* Bottom half: selected-work teaser */}
                    {featuredProjects.length > 0 && (
                        <div className="hero-fade">
                            <div className="mb-4 flex items-end justify-between font-display text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                                <span>Selected work</span>
                                <Link
                                    href={projectsIndex()}
                                    className="transition-colors hover:text-foreground"
                                >
                                    All projects →
                                </Link>
                            </div>
                            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0">
                                {featuredProjects.slice(0, 3).map((project, i) => {
                                    const inner = (
                                        <>
                                            <div className="relative h-[clamp(8.5rem,22vh,13rem)] overflow-hidden rounded-lg border bg-card">
                                                <ProjectArtwork
                                                    seed={project.slug}
                                                />
                                                <span className="absolute top-2 left-2.5 font-display text-[11px] font-medium text-background/80 mix-blend-difference">
                                                    0{i + 1}
                                                </span>
                                            </div>
                                            <div className="mt-2.5 flex items-center justify-between gap-2">
                                                <h3 className="truncate text-xs font-medium sm:text-sm">
                                                    {project.title}
                                                </h3>
                                                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                            </div>
                                        </>
                                    );

                                    return project.link ? (
                                        <a
                                            key={project.id}
                                            href={project.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group block w-[47%] shrink-0 snap-start sm:w-auto"
                                        >
                                            {inner}
                                        </a>
                                    ) : (
                                        <Link
                                            key={project.id}
                                            href={projectsIndex()}
                                            className="group block w-[47%] shrink-0 snap-start sm:w-auto"
                                        >
                                            {inner}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Framed bottom bar: availability · contact · live clock */}
                    <div className="hero-fade mt-6 flex items-end justify-between gap-4 font-display text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase sm:text-xs">
                        <span>Available for work</span>
                        <a
                            href="mailto:mizuan.mohamed@gmail.com"
                            className="transition-colors hover:text-foreground"
                        >
                            Contact
                        </a>
                        <LocalClock className="tabular-nums" />
                    </div>
                </div>
            </section>

            {/* ── Statement / about ──────────────────────────────── */}
            <section className="mx-auto max-w-6xl px-6 py-28 lg:px-8 lg:py-40">
                <p
                    data-reveal
                    className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase"
                >
                    The approach
                </p>
                <p
                    data-reveal
                    className="mt-8 max-w-4xl font-display text-[clamp(1.5rem,4vw,2.75rem)] leading-[1.2] font-medium tracking-[-0.02em] text-balance"
                >
                    I care about the whole arc, from the data model to the last
                    micro-interaction. Good software feels{' '}
                    <span className="text-muted-foreground">
                        obvious in hindsight
                    </span>
                    : quick, considered, and quietly reliable.
                </p>

                <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3">
                    {[
                        { value: '7+', label: 'Years building for the web' },
                        { value: 'Team', label: 'Leading delivery at a gov SOE' },
                        { value: 'Full-stack', label: 'Backend, frontend & infra' },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            data-reveal
                            className="bg-background p-8"
                        >
                            <p className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
                                {stat.value}
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Selected work ──────────────────────────────────── */}
            {featuredProjects.length > 0 && (
                <section className="mx-auto max-w-6xl px-6 pb-28 lg:px-8 lg:pb-40">
                    <div
                        data-reveal
                        className="mb-12 flex flex-wrap items-end justify-between gap-4"
                    >
                        <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-medium tracking-[-0.02em]">
                            Selected work
                        </h2>
                        <Link
                            href={projectsIndex()}
                            className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            All projects
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {featuredProjects.map((project, i) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                large={i === 0 && featuredProjects.length > 2}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* ── Writing ────────────────────────────────────────── */}
            {latestArticles.length > 0 && (
                <section className="border-t">
                    <div className="mx-auto max-w-6xl px-6 py-28 lg:px-8 lg:py-40">
                        <div
                            data-reveal
                            className="mb-12 flex flex-wrap items-end justify-between gap-4"
                        >
                            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-medium tracking-[-0.02em]">
                                Latest writing
                            </h2>
                            <Link
                                href={articlesIndex()}
                                className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                All articles
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <ul className="-mt-2">
                            {latestArticles.map((article) => (
                                <li key={article.id} data-reveal>
                                    <Link
                                        href={articleShow(article.slug)}
                                        className="group flex flex-col gap-2 border-t py-8 transition-colors hover:bg-muted/30 sm:flex-row sm:items-baseline sm:gap-8"
                                    >
                                        {article.published_at && (
                                            <time className="shrink-0 text-sm text-muted-foreground tabular-nums sm:w-32">
                                                {new Date(
                                                    article.published_at,
                                                ).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </time>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="flex items-center gap-2 text-xl font-medium tracking-tight">
                                                {article.title}
                                                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                                            </h3>
                                            {article.excerpt && (
                                                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                                    {article.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* ── Contact CTA ────────────────────────────────────── */}
            <section className="border-t">
                <div className="mx-auto max-w-6xl px-6 py-28 text-center lg:px-8 lg:py-40">
                    <p
                        data-reveal
                        className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase"
                    >
                        Let&apos;s build something
                    </p>
                    <h2
                        data-reveal
                        className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.25rem,7vw,5rem)] leading-[0.98] font-medium tracking-[-0.03em]"
                    >
                        Have a project in mind?
                    </h2>
                    <div
                        data-reveal
                        className="mt-10 flex flex-wrap items-center justify-center gap-4"
                    >
                        <MagneticLink
                            href="mailto:mizuan.mohamed@gmail.com"
                            external
                            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
                        >
                            <Mail className="size-4" />
                            mizuan.mohamed@gmail.com
                        </MagneticLink>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}

type MagneticLinkProps = {
    href: string | { url: string } | ReturnType<typeof projectsIndex>;
    children: ReactNode;
    className?: string;
    external?: boolean;
};

/**
 * A link/button that gently leans toward the pointer on hover for a tactile,
 * "magnetic" feel. Falls back to a static link when motion is reduced.
 */
function MagneticLink({ href, children, className, external }: MagneticLinkProps) {
    const ref = useRef<HTMLAnchorElement | null>(null);

    useEffect(() => {
        const el = ref.current;

        if (
            !el ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            window.matchMedia('(hover: none)').matches
        ) {
            return;
        }

        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

        const onMove = (event: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            const relX = event.clientX - rect.left - rect.width / 2;
            const relY = event.clientY - rect.top - rect.height / 2;
            xTo(relX * 0.3);
            yTo(relY * 0.3);
        };
        const onLeave = () => {
            xTo(0);
            yTo(0);
        };

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);

        return () => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    const resolved = typeof href === 'string' ? href : href.url;

    if (external || typeof href === 'string') {
        return (
            <a
                ref={ref}
                href={resolved}
                className={className}
                {...(resolved.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
            >
                {children}
            </a>
        );
    }

    return (
        <Link ref={ref} href={resolved} className={className}>
            {children}
        </Link>
    );
}
