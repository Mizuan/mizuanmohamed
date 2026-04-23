import { Form, Head, Link } from '@inertiajs/react';
import { AdminPage } from '@/components/admin/admin-page';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import { index as tagsIndex, store } from '@/routes/admin/tags';

export default function TagCreate() {
    return (
        <>
            <Head title="New tag" />
            <AdminPage
                title="New tag"
                description="Tags are attached to articles for filtering."
            >
                <div className="mx-auto max-w-3xl">
                    <Form
                        {...store.form()}
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
                                        placeholder="e.g. Laravel"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">
                                        Slug{' '}
                                        <span className="text-xs text-muted-foreground">
                                            (optional · auto-generated from
                                            name)
                                        </span>
                                    </Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        placeholder="laravel"
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
                                        Create tag
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

TagCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Tags', href: tagsIndex() },
        { title: 'New', href: '' },
    ],
};
