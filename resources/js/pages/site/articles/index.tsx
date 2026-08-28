import { Link } from '@inertiajs/react';
import { useMemo } from 'react';
import { ArticleRow } from '@/components/site/article-list';
import type { ArticleListItem } from '@/components/site/article-list';
import { PageHeader } from '@/components/site/page-header';
import { SectionLabel } from '@/components/site/section-label';
import { SeoHead } from '@/components/site/seo-head';

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Props = {
    articles: Paginated<ArticleListItem>;
};

export default function ArticlesIndex({ articles }: Props) {
    const groups = useMemo(() => {
        const byYear = new Map<string, ArticleListItem[]>();

        for (const article of articles.data) {
            const year = article.published_at
                ? String(new Date(article.published_at).getFullYear())
                : 'Unpublished';

            byYear.set(year, [...(byYear.get(year) ?? []), article]);
        }

        return [...byYear.entries()];
    }, [articles.data]);

    return (
        <>
            <SeoHead
                title="Writing"
                description="Notes on Laravel, React, TypeScript, and the rest of the modern web."
            />

            <PageHeader
                title="Writing"
                description="Notes on Laravel, React, and the rest of the modern web."
            />

            {articles.data.length === 0 ? (
                <p className="border-t border-border py-10 text-muted-foreground">
                    Nothing published yet. Check back soon.
                </p>
            ) : (
                groups.map(([year, items]) => (
                    <section key={year} className="mt-10 first:mt-0">
                        <SectionLabel className="tabular-nums">
                            {year}
                        </SectionLabel>

                        <div className="mt-3 border-t border-border">
                            {items.map((article) => (
                                <ArticleRow
                                    key={article.id}
                                    article={article}
                                    showMeta
                                />
                            ))}
                        </div>
                    </section>
                ))
            )}

            {articles.last_page > 1 && (
                <div className="mt-10 flex items-center justify-between text-sm text-muted-foreground">
                    <p className="tabular-nums">
                        Page {articles.current_page} of {articles.last_page}
                    </p>
                    <div className="flex items-center gap-6">
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
        </>
    );
}
