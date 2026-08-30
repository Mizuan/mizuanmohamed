import { Link } from '@inertiajs/react';
import { ArticleRow } from '@/components/site/article-list';
import type { ArticleListItem } from '@/components/site/article-list';
import { HeroGraphic } from '@/components/site/hero-graphic';
import { ProjectCards } from '@/components/site/project-list';
import type { ProjectListItem } from '@/components/site/project-list';
import { SectionLabel } from '@/components/site/section-label';
import { SeoHead } from '@/components/site/seo-head';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { index as articlesIndex } from '@/routes/site/articles';
import { index as projectsIndex } from '@/routes/site/projects';

type Props = {
    latestArticles: ArticleListItem[];
    featuredProjects: ProjectListItem[];
};

export default function Home({ latestArticles, featuredProjects }: Props) {
    const settings = useSiteSettings();

    return (
        <>
            <SeoHead title={settings.brand_name} />

            <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
                <div>
                    {settings.hero_eyebrow && (
                        <SectionLabel>{settings.hero_eyebrow}</SectionLabel>
                    )}

                    <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-balance">
                        {settings.hero_heading}
                    </h1>

                    <p className="mt-5 max-w-xl text-lg leading-relaxed whitespace-pre-line text-muted-foreground">
                        {settings.hero_intro}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        {settings.hero_primary_label &&
                            settings.hero_primary_url && (
                                <Link
                                    href={settings.hero_primary_url}
                                    className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
                                >
                                    {settings.hero_primary_label}
                                </Link>
                            )}
                        {settings.hero_secondary_label &&
                            settings.hero_secondary_url && (
                                <Link
                                    href={settings.hero_secondary_url}
                                    className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-brand/40 hover:text-brand"
                                >
                                    {settings.hero_secondary_label}
                                </Link>
                            )}
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

            {(settings.contact_text || settings.contact_email) && (
                <section className="mt-16 border-t border-border pt-10 sm:mt-24">
                    <SectionLabel>Contact</SectionLabel>
                    <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                        {settings.contact_text}
                        {settings.contact_email && (
                            <>
                                {settings.contact_text ? ' ' : ''}
                                <a
                                    href={`mailto:${settings.contact_email}`}
                                    className="text-brand underline decoration-brand/35 underline-offset-[3px] transition-colors hover:decoration-brand"
                                >
                                    {settings.contact_email}
                                </a>
                                .
                            </>
                        )}
                    </p>
                </section>
            )}
        </>
    );
}
