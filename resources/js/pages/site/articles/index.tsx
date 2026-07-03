import { Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { SeoHead } from '@/components/site/seo-head';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';
import { SplitText } from '@/components/site/split-text';
import { show as articleShow } from '@/routes/site/articles';

gsap.registerPlugin(ScrollTrigger);

type Article = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    reading_time: number;
    published_at: string | null;
    category: { id: number; name: string; slug: string } | null;
    tags: { id: number; name: string; slug: string }[];
};

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Props = {
    articles: Paginated<Article>;
};

export default function ArticlesIndex({ articles }: Props) {
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
            <SeoHead
                title="Writing"
                description="Notes on Laravel, React, TypeScript, and the rest of the modern web."
            />

            <SiteNav />

            <header className="mx-auto w-full max-w-6xl px-6 pt-40 pb-16 lg:px-8 lg:pt-48 lg:pb-24">
                <p
                    data-reveal
                    className="font-display text-xs font-medium tracking-[0.24em] text-brand uppercase"
                >
                    Notes &amp; Articles
                </p>
                <SplitText
                    as="h1"
                    text="Writing"
                    delay={0.15}
                    stagger={0.05}
                    duration={0.8}
                    className="mt-5 font-poster text-[clamp(3.5rem,14vw,11rem)] leading-[0.9] font-normal tracking-[-0.01em] text-brand uppercase"
                />
                <p
                    data-reveal
                    className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground"
                >
                    Things I&apos;ve written about Laravel, React, and the rest
                    of the modern web.
                </p>
            </header>

            <section className="mx-auto w-full max-w-6xl px-6 pb-32 lg:px-8 lg:pb-48">
                {articles.data.length === 0 ? (
                    <p className="border-t border-border py-16 text-sm text-muted-foreground">
                        Nothing published yet. Check back soon.
                    </p>
                ) : (
                    <ul data-reveal>
                        {articles.data.map((article) => (
                            <li key={article.id}>
                                <Link
                                    href={articleShow(article.slug)}
                                    className="group flex flex-col gap-2 border-t border-border py-8 sm:flex-row sm:items-baseline sm:gap-8 lg:py-10"
                                >
                                    {article.published_at && (
                                        <time
                                            dateTime={article.published_at}
                                            className="shrink-0 font-display text-xs font-medium tracking-[0.14em] text-muted-foreground tabular-nums uppercase sm:w-32"
                                        >
                                            {new Date(
                                                article.published_at,
                                            ).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </time>
                                    )}

                                    <div className="min-w-0 flex-1 transition-transform duration-300 ease-out group-hover:translate-x-2">
                                        <h2 className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-brand sm:text-2xl">
                                            {article.title}
                                            <ArrowUpRight className="size-4 shrink-0 text-brand opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                                        </h2>
                                        {article.excerpt && (
                                            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                                {article.excerpt}
                                            </p>
                                        )}
                                        <p className="mt-3 font-display text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                                            {[
                                                article.category?.name,
                                                `${article.reading_time} min read`,
                                            ]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                        <li aria-hidden className="border-t border-border" />
                    </ul>
                )}

                {articles.last_page > 1 && (
                    <div className="mt-10 flex items-center justify-between font-display text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                        <p className="tabular-nums">
                            Page {articles.current_page} /{' '}
                            {articles.last_page}
                        </p>
                        <div className="flex items-center gap-7">
                            {articles.prev_page_url ? (
                                <Link
                                    href={articles.prev_page_url}
                                    className="transition-colors hover:text-brand"
                                >
                                    ← Previous
                                </Link>
                            ) : (
                                <span className="opacity-40">← Previous</span>
                            )}
                            {articles.next_page_url ? (
                                <Link
                                    href={articles.next_page_url}
                                    className="transition-colors hover:text-brand"
                                >
                                    Next →
                                </Link>
                            ) : (
                                <span className="opacity-40">Next →</span>
                            )}
                        </div>
                    </div>
                )}
            </section>

            <SiteFooter />
        </div>
    );
}
