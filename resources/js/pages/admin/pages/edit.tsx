import { Form, Head, Link, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdminPage } from '@/components/admin/admin-page';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import {
    SectionsRepeater
    
} from '@/components/admin/sections-repeater';
import type {Section} from '@/components/admin/sections-repeater';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import {
    destroy,
    index as pagesIndex,
    update,
} from '@/routes/admin/pages';

type Page = {
    id: number;
    title: string;
    slug: string;
    content: string | null;
    sections: Section[] | null;
    meta_description: string | null;
    is_published: boolean;
};

type Props = {
    page: Page;
};

export default function PageEdit({ page }: Props) {
    const [isPublished, setIsPublished] = useState(page.is_published);

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
                        onConfirm={() =>
                            router.delete(destroy(page.slug).url)
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
                        {...update.form(page.slug)}
                        className="space-y-6 rounded-lg border bg-card p-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        required
                                        autoFocus
                                        defaultValue={page.title}
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        defaultValue={page.slug}
                                    />
                                    <InputError message={errors.slug} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Content</Label>
                                    <RichTextEditor
                                        name="content"
                                        defaultValue={page.content ?? ''}
                                        placeholder="Write the page content…"
                                    />
                                    <InputError message={errors.content} />
                                </div>

                                {page.slug === 'about' && (
                                    <div className="space-y-2">
                                        <Label>About sections</Label>
                                        <p className="text-xs text-muted-foreground">
                                            The intro, experience, approach and
                                            toolkit panels shown on the public
                                            About page.
                                        </p>
                                        <SectionsRepeater
                                            name="sections"
                                            defaultValue={page.sections ?? []}
                                        />
                                        <InputError
                                            message={errors.sections}
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="meta_description">
                                        Meta description{' '}
                                        <span className="text-xs text-muted-foreground">
                                            (SEO · max 255)
                                        </span>
                                    </Label>
                                    <Textarea
                                        id="meta_description"
                                        name="meta_description"
                                        rows={2}
                                        maxLength={255}
                                        defaultValue={
                                            page.meta_description ?? ''
                                        }
                                    />
                                    <InputError
                                        message={errors.meta_description}
                                    />
                                </div>

                                <div className="flex items-center gap-3 rounded-md border p-3">
                                    <Checkbox
                                        id="is_published"
                                        checked={isPublished}
                                        onCheckedChange={(value) =>
                                            setIsPublished(value === true)
                                        }
                                    />
                                    <input
                                        type="hidden"
                                        name="is_published"
                                        value={isPublished ? '1' : '0'}
                                    />
                                    <div className="flex-1">
                                        <Label
                                            htmlFor="is_published"
                                            className="cursor-pointer"
                                        >
                                            Published
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Uncheck to keep this page hidden
                                            from the public site.
                                        </p>
                                    </div>
                                </div>
                                <InputError message={errors.is_published} />

                                <div className="flex items-center justify-end gap-2 border-t pt-4">
                                    <Button variant="ghost" asChild>
                                        <Link href={pagesIndex()}>Cancel</Link>
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

PageEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pages', href: pagesIndex() },
        { title: 'Edit', href: '' },
    ],
};
