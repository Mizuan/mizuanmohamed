import { Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Hero } from '@/components/site/hero';
import { ProjectList } from '@/components/site/project-list';
import { SeoHead } from '@/components/site/seo-head';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';
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
                gsap.set('[data-reveal]', { opacity: 1, y: 0 });

                return;
            }

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
            className="dark min-h-svh bg-background text-foreground antialiased"
        >
            <SeoHead
                title="Mizuan Mohamed — Full-Stack Developer"
                description="Full-stack developer in Malé, Maldives. Seven years building web apps with Laravel, React, and TypeScript. Selected work, writing, and notes from the modern web."
            />

            <SiteNav />

            {/* ── Hero: warm doorway of light ────────────────────── */}
            <Hero />

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
                    I enjoy building software that&apos;s{' '}
                    <span className="text-muted-foreground">
                        clean, intuitive, and reliable
                    </span>
                    , with attention to both the technical foundation and the
                    user experience.
                </p>

                <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3">
                    {[
                        { value: '9+', label: 'Years building for the web' },
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
                            className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-brand"
                        >
                            All projects
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div data-reveal>
                        <ProjectList projects={featuredProjects} />
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
                                className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-brand"
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
                                            <h3 className="flex items-center gap-2 text-xl font-medium tracking-tight transition-colors group-hover:text-brand">
                                                {article.title}
                                                <ArrowUpRight className="size-4 shrink-0 text-brand opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
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
                            className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-brand-foreground transition-transform hover:scale-[1.02]"
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
