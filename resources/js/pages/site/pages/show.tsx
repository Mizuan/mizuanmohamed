import { ArticleContent } from '@/components/site/article-content';
import { PageHeader } from '@/components/site/page-header';
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

            <article className="mx-auto max-w-2xl">
                <PageHeader title={page.title} />

                {page.content && <ArticleContent html={page.content} />}
            </article>
        </>
    );
}
