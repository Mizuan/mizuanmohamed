import { Form, Head, Link, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { AdminPage } from '@/components/admin/admin-page';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import {
    destroy,
    index as categoriesIndex,
    update,
} from '@/routes/admin/categories';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
};

type Props = {
    category: Category;
};

export default function CategoryEdit({ category }: Props) {
    return (
        <>
            <Head title={`Edit ${category.name}`} />
            <AdminPage
                title="Edit category"
                description={category.name}
                actions={
                    <ConfirmDialog
                        title="Delete category?"
                        description={`"${category.name}" will be removed. Articles in this category will become uncategorised.`}
                        confirmLabel="Delete"
                        onConfirm={() =>
                            router.delete(destroy(category.slug).url)
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
                <div className="mx-auto max-w-3xl">
                    <Form
                        {...update.form(category.slug)}
                        className="space-y-6 rounded-lg border bg-card p-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        autoFocus
                                        defaultValue={category.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        defaultValue={category.slug}
                                    />
                                    <InputError message={errors.slug} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        defaultValue={
                                            category.description ?? ''
                                        }
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t pt-4">
                                    <Button variant="ghost" asChild>
                                        <Link href={categoriesIndex()}>
                                            Cancel
                                        </Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        Save changes
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </AdminPage>
        </>
    );
}

CategoryEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Categories', href: categoriesIndex() },
        { title: 'Edit', href: '' },
    ],
};
