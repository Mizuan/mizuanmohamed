import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ArticleContent } from '@/components/site/article-content';
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

            <article className="pb-16">
                <Link
                    href={articlesIndex()}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-3.5" />
                    All articles
                </Link>

                <header className="mt-6">
                    <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] font-medium tracking-[-0.02em] text-balance">
                        {article.title}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        {article.published_at && (
                            <time dateTime={article.published_at}>
                                {new Date(
                                    article.published_at,
                                ).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                        )}
                        {article.author && (
                            <>
                                <span>·</span>
                                <span>by {article.author.name}</span>
                            </>
                        )}
                        {article.category && (
                            <>
                                <span>·</span>
                                <span>{article.category.name}</span>
                            </>
                        )}
                        <span>·</span>
                        <span>{article.reading_time} min read</span>
                    </div>
                </header>

                {featuredImageUrl && (
                    <img
                        src={featuredImageUrl}
                        alt=""
                        className="mt-8 w-full rounded-lg border object-cover"
                    />
                )}

                <ArticleContent
                    html={article.content}
                    className="mt-8 text-base"
                />

                {article.tags.length > 0 && (
                    <div className="mt-12 border-t pt-6">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            Tagged
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {article.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <footer className="mt-12 border-t pt-8">
                    <Link
                        href={articlesIndex()}
                        className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                        Back to all writing
                    </Link>
                </footer>
            </article>
        </>
    );
}
