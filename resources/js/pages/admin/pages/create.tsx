import { Head } from '@inertiajs/react';
import { AdminPage } from '@/components/admin/admin-page';
import { PageForm } from '@/components/admin/page-form';
import { dashboard } from '@/routes';
import { index as pagesIndex, store } from '@/routes/admin/pages';

export default function PageCreate() {
    return (
        <>
            <Head title="New page" />
            <AdminPage
                title="New page"
                description="Dynamic pages like About, Contact, Portfolio."
            >
                <PageForm form={store.form()} submitLabel="Create page" />
            </AdminPage>
        </>
    );
}

PageCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pages', href: pagesIndex() },
        { title: 'New', href: '' },
    ],
};
