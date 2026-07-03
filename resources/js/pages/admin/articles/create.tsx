import { Head } from '@inertiajs/react';
import { AdminPage } from '@/components/admin/admin-page';
import { ArticleForm } from '@/components/admin/article-form';
import { dashboard } from '@/routes';
import { index as articlesIndex, store } from '@/routes/admin/articles';

type Category = { id: number; name: string };
type Tag = { id: number; name: string };
type StatusOption = { value: string; label: string };

type Props = {
    categories: Category[];
    tags: Tag[];
    statuses: StatusOption[];
};

export default function ArticleCreate({ categories, tags, statuses }: Props) {
    return (
        <>
            <Head title="New article" />
            <AdminPage
                title="New article"
                description="Long-form content with rich text, tags, and a featured image."
            >
                <ArticleForm
                    form={store.form()}
                    submitLabel="Create article"
                    categories={categories}
                    tags={tags}
                    statuses={statuses}
                />
            </AdminPage>
        </>
    );
}

ArticleCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Articles', href: articlesIndex() },
        { title: 'New', href: '' },
    ],
};
