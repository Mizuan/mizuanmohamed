import { Form, Head, Link, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { AdminPage } from '@/components/admin/admin-page';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import {
    destroy,
    index as tagsIndex,
    update,
} from '@/routes/admin/tags';

type Tag = {
    id: number;
    name: string;
    slug: string;
};

type Props = {
    tag: Tag;
};

export default function TagEdit({ tag }: Props) {
    return (
        <>
            <Head title={`Edit ${tag.name}`} />
            <AdminPage
                title="Edit tag"
                description={tag.name}
                actions={
                    <ConfirmDialog
                        title="Delete tag?"
                        description={`"${tag.name}" will be removed from all articles.`}
                        confirmLabel="Delete"
                        onConfirm={() =>
                            router.delete(destroy(tag.slug).url)
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
                        {...update.form(tag.slug)}
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
                                        defaultValue={tag.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        defaultValue={tag.slug}
                                    />
                                    <InputError message={errors.slug} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t pt-4">
                                    <Button variant="ghost" asChild>
                                        <Link href={tagsIndex()}>Cancel</Link>
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

TagEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Tags', href: tagsIndex() },
        { title: 'Edit', href: '' },
    ],
};
