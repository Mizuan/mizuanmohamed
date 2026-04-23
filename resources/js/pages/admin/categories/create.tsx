import { Form, Head, Link } from '@inertiajs/react';
import { AdminPage } from '@/components/admin/admin-page';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import {
    index as categoriesIndex,
    store,
} from '@/routes/admin/categories';

export default function CategoryCreate() {
    return (
        <>
            <Head title="New category" />
            <AdminPage
                title="New category"
                description="Categories help group related articles."
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
                                        placeholder="e.g. Engineering"
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
                                        placeholder="engineering"
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
                                        placeholder="What belongs in this category?"
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
                                        Create category
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

CategoryCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Categories', href: categoriesIndex() },
        { title: 'New', href: '' },
    ],
};
