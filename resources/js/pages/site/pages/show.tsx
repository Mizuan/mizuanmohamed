import { ArticleContent } from '@/components/site/article-content';
import { SeoHead } from '@/components/site/seo-head';

type Page = {
    id: number;
    title: string;
    slug: string;
    content: string | null;
    meta_description: string | null;
    updated_at: string;
};

type Props = {
    page: Page;
};

export default function PageShow({ page }: Props) {
    return (
        <>
            <SeoHead
                title={page.title}
                description={page.meta_description ?? undefined}
            />

            <article className="pb-16">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        {page.title}
                    </h1>
                </header>

                {page.content && (
                    <ArticleContent
                        html={page.content}
                        className="text-base"
                    />
                )}
            </article>
        </>
    );
}
