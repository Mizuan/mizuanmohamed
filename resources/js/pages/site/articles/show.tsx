import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ArticleContent } from '@/components/site/article-content';
import { formatArticleDate } from '@/components/site/article-list';
import { SeoHead } from '@/components/site/seo-head';
import { index as articlesIndex } from '@/routes/site/articles';

type Article = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    reading_time: number;
    featured_image: string | null;
    published_at: string | null;
    category: { id: number; name: string; slug: string } | null;
    tags: { id: number; name: string; slug: string }[];
    author: { id: number; name: string } | null;
};

type Props = {
    article: Article;
};

export default function ArticleShow({ article }: Props) {
    const featuredImageUrl = article.featured_image
        ? `/storage/${article.featured_image}`
        : null;

    const meta = [article.category?.name, `${article.reading_time} min read`]
        .filter(Boolean)
        .join(' · ');

    return (
        <>
            <SeoHead
                title={article.title}
                description={article.excerpt ?? undefined}
                image={featuredImageUrl ?? undefined}
                type="article"
                publishedAt={article.published_at}
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    headline: article.title,
                    ...(article.excerpt && { description: article.excerpt }),
                    ...(article.published_at && {
                        datePublished: article.published_at,
                    }),
                    ...(featuredImageUrl && { image: featuredImageUrl }),
                    author: {
                        '@type': 'Person',
                        name: article.author?.name ?? 'Mizuan Mohamed',
                    },
                }}
            />

            <article className="mx-auto max-w-2xl">
                <Link
                    href={articlesIndex()}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand"
                >
                    <ArrowLeft className="size-3.5" />
                    All writing
                </Link>

                <header className="mt-6 border-b border-border pb-8">
                    <h1 className="font-display text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-[2.5rem]">
                        {article.title}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                        {article.published_at && (
                            <time dateTime={article.published_at}>
                                {formatArticleDate(article.published_at)}
                            </time>
                        )}
                        {article.published_at && meta && <span>·</span>}
                        {meta && <span>{meta}</span>}
                    </div>
                </header>

                {featuredImageUrl && (
                    <img
                        src={featuredImageUrl}
                        alt=""
                        className="mt-8 w-full rounded-md border border-border object-cover"
                    />
                )}

                <ArticleContent html={article.content} className="mt-8" />

                {article.tags.length > 0 && (
                    <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border pt-6">
                        {article.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                <footer className="mt-10 border-t border-border pt-6">
                    <Link
                        href={articlesIndex()}
                        className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                        Back to all writing
                    </Link>
                </footer>
            </article>
        </>
    );
}
