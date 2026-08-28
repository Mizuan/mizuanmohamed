import { Link } from '@inertiajs/react';
import { ArticleRow } from '@/components/site/article-list';
import type { ArticleListItem } from '@/components/site/article-list';
import { HeroGraphic } from '@/components/site/hero-graphic';
import { ProjectCards } from '@/components/site/project-list';
import type { ProjectListItem } from '@/components/site/project-list';
import { SectionLabel } from '@/components/site/section-label';
import { SeoHead } from '@/components/site/seo-head';
import { index as articlesIndex } from '@/routes/site/articles';
import { index as projectsIndex } from '@/routes/site/projects';

type Props = {
    latestArticles: ArticleListItem[];
    featuredProjects: ProjectListItem[];
};

export default function Home({ latestArticles, featuredProjects }: Props) {
    return (
        <>
            <SeoHead
                title="Mizuan Mohamed — Full-Stack Developer"
                description="Full-stack developer in Malé, Maldives. Seven years building web apps with Laravel, React, and TypeScript. Selected work, writing, and notes from the modern web."
            />

            <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
                <div>
                    <SectionLabel>
                        Full-stack developer — Malé, Maldives
                    </SectionLabel>

                    <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-balance">
                        Mizuan Mohamed
                    </h1>

                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                        I build web applications end to end with Laravel, React,
                        and TypeScript, and lead a small development team at a
                        government SOE. This is where I keep my writing and the
                        things I&apos;ve built.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                            href={articlesIndex()}
                            className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
                        >
                            Read the writing
                        </Link>
                        <Link
                            href={projectsIndex()}
                            className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-brand/40 hover:text-brand"
                        >
                            See the projects
                        </Link>
                    </div>
                </div>

                <HeroGraphic className="h-36 w-full sm:h-44 lg:h-80 lg:w-96" />
            </section>

            {latestArticles.length > 0 && (
                <section className="mt-16 sm:mt-24">
                    <div className="flex items-baseline justify-between gap-4">
                        <SectionLabel>Latest writing</SectionLabel>
                        <Link
                            href={articlesIndex()}
                            className="text-sm text-muted-foreground transition-colors hover:text-brand"
                        >
                            All articles
                        </Link>
                    </div>

                    <div className="mt-5 border-t border-border">
                        {latestArticles.map((article) => (
                            <ArticleRow key={article.id} article={article} />
                        ))}
                    </div>
                </section>
            )}

            {featuredProjects.length > 0 && (
                <section className="mt-16 sm:mt-24">
                    <div className="flex items-baseline justify-between gap-4">
                        <SectionLabel>Selected projects</SectionLabel>
                        <Link
                            href={projectsIndex()}
                            className="text-sm text-muted-foreground transition-colors hover:text-brand"
                        >
                            All projects
                        </Link>
                    </div>

                    <div className="mt-5">
                        <ProjectCards projects={featuredProjects} />
                    </div>
                </section>
            )}

            <section className="mt-16 border-t border-border pt-10 sm:mt-24">
                <SectionLabel>Contact</SectionLabel>
                <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                    Have a project in mind, or just want to say hello? Reach me
                    at{' '}
                    <a
                        href="mailto:mizuan.mohamed@gmail.com"
                        className="text-brand underline decoration-brand/35 underline-offset-[3px] transition-colors hover:decoration-brand"
                    >
                        mizuan.mohamed@gmail.com
                    </a>
                    .
                </p>
            </section>
        </>
    );
}
