import { Link } from '@inertiajs/react';
import { SeoHead } from '@/components/site/seo-head';
import { Button } from '@/components/ui/button';
import { show as articleShow } from '@/routes/site/articles';

type Article = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
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
    return (
        <>
            <SeoHead
                title="Articles"
                description="Notes on Laravel, React, TypeScript, and the rest of the modern web."
            />

            <section className="pb-16">
                <header className="mb-10">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Articles
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Things I've written about Laravel, React, and the
                        rest of the web.
                    </p>
                </header>

                {articles.data.length === 0 ? (
                    <p className="rounded-md border border-dashed p-12 text-center text-sm text-muted-foreground">
                        Nothing published yet. Check back soon.
                    </p>
                ) : (
                    <ul className="divide-y border-y">
                        {articles.data.map((article) => (
                            <li key={article.id}>
                                <Link
                                    href={articleShow(article.slug)}
                                    className="block py-6 transition-colors hover:bg-muted/40"
                                >
                                    <h2 className="text-lg font-semibold tracking-tight">
                                        {article.title}
                                    </h2>
                                    {article.excerpt && (
                                        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                                            {article.excerpt}
                                        </p>
                                    )}
                                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                        {article.published_at && (
                                            <time
                                                dateTime={article.published_at}
                                            >
                                                {new Date(
                                                    article.published_at,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    },
                                                )}
                                            </time>
                                        )}
                                        {article.category && (
                                            <>
                                                <span>·</span>
                                                <span>
                                                    {article.category.name}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {articles.last_page > 1 && (
                    <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
                        <p>
                            Page {articles.current_page} of {articles.last_page}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild={!!articles.prev_page_url}
                                disabled={!articles.prev_page_url}
                            >
                                {articles.prev_page_url ? (
                                    <Link href={articles.prev_page_url}>
                                        Previous
                                    </Link>
                                ) : (
                                    <span>Previous</span>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild={!!articles.next_page_url}
                                disabled={!articles.next_page_url}
                            >
                                {articles.next_page_url ? (
                                    <Link href={articles.next_page_url}>
                                        Next
                                    </Link>
                                ) : (
                                    <span>Next</span>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
