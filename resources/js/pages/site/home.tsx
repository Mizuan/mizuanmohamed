import { Link } from '@inertiajs/react';
import { ArticleRow } from '@/components/site/article-list';
import type { ArticleListItem } from '@/components/site/article-list';
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

            {latestArticles.length > 0 && (
                <section>
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
