import { Head, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { AdminPage } from '@/components/admin/admin-page';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { PageForm } from '@/components/admin/page-form';
import type { PageFormPage } from '@/components/admin/page-form';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { destroy, index as pagesIndex, update } from '@/routes/admin/pages';

type Props = {
    page: PageFormPage;
};

export default function PageEdit({ page }: Props) {
    return (
        <>
            <Head title={`Edit ${page.title}`} />
            <AdminPage
                title="Edit page"
                description={page.title}
                actions={
                    <ConfirmDialog
                        title="Delete page?"
                        description={`"${page.title}" will be permanently removed.`}
                        confirmLabel="Delete"
                        onConfirm={() => router.delete(destroy(page.slug).url)}
                        trigger={
                            <Button variant="destructive">
                                <Trash2 />
                                Delete
                            </Button>
                        }
                    />
                }
            >
                <PageForm
                    form={update.form(page.slug)}
                    submitLabel="Save changes"
                    page={page}
                />
            </AdminPage>
        </>
    );
}

PageEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pages', href: pagesIndex() },
        { title: 'Edit', href: '' },
    ],
};
