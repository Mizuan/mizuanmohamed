import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { SeoHead } from '@/components/site/seo-head';
import { index as articlesIndex, show as articleShow } from '@/routes/site/articles';
import { show as pageShow } from '@/routes/site/pages';

type LatestArticle = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    published_at: string | null;
};

type Props = {
    latestArticles: LatestArticle[];
};

export default function Home({ latestArticles }: Props) {
    return (
        <>
            <SeoHead
                title="Mizuan Mohamed — Software Developer"
                description="Software developer based in Malé, Maldives. Articles, notes, and projects on Laravel, React, and the rest of the modern web."
            />

            <section className="pb-12">
                <p className="text-sm text-muted-foreground">
                    Hey, I'm a.
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Full Stack Software developer.
                </h1>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                    Seven years building web apps with Laravel, React, and
                    TypeScript. I lead a small team at a government SOE and
                    write here about what I learn along the way.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                    <Link
                        href={articlesIndex()}
                        className="inline-flex items-center gap-1 rounded-md bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-90"
                    >
                        Read articles
                        <ArrowRight className="size-4" />
                    </Link>
                    <Link
                        href={pageShow('about')}
                        className="inline-flex items-center rounded-md border px-4 py-2 font-medium transition-colors hover:bg-muted"
                    >
                        About me
                    </Link>
                </div>
            </section>

            {latestArticles.length > 0 && (
                <section className="pb-16">
                    <div className="mb-4 flex items-baseline justify-between">
                        <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                            Latest articles
                        </h2>
                        <Link
                            href={articlesIndex()}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            All articles →
                        </Link>
                    </div>
                    <ul className="divide-y border-y">
                        {latestArticles.map((article) => (
                            <li key={article.id}>
                                <Link
                                    href={articleShow(article.slug)}
                                    className="block py-4 transition-colors hover:bg-muted/40"
                                >
                                    <h3 className="font-medium tracking-tight">
                                        {article.title}
                                    </h3>
                                    {article.excerpt && (
                                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                            {article.excerpt}
                                        </p>
                                    )}
                                    {article.published_at && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {new Date(
                                                article.published_at,
                                            ).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    );
}
