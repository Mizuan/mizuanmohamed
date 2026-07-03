import { Head, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { AdminPage } from '@/components/admin/admin-page';
import { ArticleForm } from '@/components/admin/article-form';
import type { ArticleFormArticle } from '@/components/admin/article-form';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import {
    destroy,
    index as articlesIndex,
    update,
} from '@/routes/admin/articles';

type Category = { id: number; name: string };
type Tag = { id: number; name: string };
type StatusOption = { value: string; label: string };

type Props = {
    article: ArticleFormArticle;
    categories: Category[];
    tags: Tag[];
    statuses: StatusOption[];
};

export default function ArticleEdit({
    article,
    categories,
    tags,
    statuses,
}: Props) {
    return (
        <>
            <Head title={`Edit ${article.title}`} />
            <AdminPage
                title="Edit article"
                description={article.title}
                actions={
                    <ConfirmDialog
                        title="Delete article?"
                        description={`"${article.title}" will be permanently removed.`}
                        confirmLabel="Delete"
                        onConfirm={() =>
                            router.delete(destroy(article.slug).url)
                        }
                        trigger={
                            <Button variant="destructive">
                                <Trash2 />
                                Delete
                            </Button>
                        }
                    />
                }
            >
                <ArticleForm
                    form={update.form(article.slug)}
                    submitLabel="Save changes"
                    categories={categories}
                    tags={tags}
                    statuses={statuses}
                    article={article}
                />
            </AdminPage>
        </>
    );
}

ArticleEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Articles', href: articlesIndex() },
        { title: 'Edit', href: '' },
    ],
};
