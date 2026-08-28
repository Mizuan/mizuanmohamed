import { Link } from '@inertiajs/react';
import { show as articleShow } from '@/routes/site/articles';

export type ArticleListItem = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    published_at: string | null;
    reading_time?: number;
    category?: { id: number; name: string; slug: string } | null;
};

export function formatArticleDate(date: string): string {
    return new Date(date).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function ArticleRow({
    article,
    showMeta = false,
}: {
    article: ArticleListItem;
    showMeta?: boolean;
}) {
    const meta = [article.category?.name]
        .concat(article.reading_time ? `${article.reading_time} min read` : [])
        .filter(Boolean)
        .join(' · ');

    return (
        <Link
            href={articleShow(article.slug)}
            className="group flex flex-col gap-1 border-b border-border py-5 sm:flex-row sm:items-baseline sm:gap-6"
        >
            {article.published_at && (
                <time
                    dateTime={article.published_at}
                    className="shrink-0 text-sm text-muted-foreground tabular-nums sm:w-28"
                >
                    {formatArticleDate(article.published_at)}
                </time>
            )}

            <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-medium tracking-[-0.01em] text-balance transition-colors group-hover:text-brand">
                    {article.title}
                </h3>
                {article.excerpt && (
                    <p className="mt-1.5 line-clamp-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                        {article.excerpt}
                    </p>
                )}
                {showMeta && meta && (
                    <p className="mt-2 text-xs text-muted-foreground">{meta}</p>
                )}
            </div>
        </Link>
    );
}
