import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { AdminPage } from '@/components/admin/admin-page';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { index as pagesIndex, store } from '@/routes/admin/pages';

export default function PageCreate() {
    const [isPublished, setIsPublished] = useState(true);

    return (
        <>
            <Head title="New page" />
            <AdminPage
                title="New page"
                description="Dynamic pages like About, Contact, Portfolio."
            >
                <div className="mx-auto max-w-3xl">
                    <Form
                        {...store.form()}
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
                                        placeholder="About"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">
                                        Slug{' '}
                                        <span className="text-xs text-muted-foreground">
                                            (optional · auto-generated from
                                            title)
                                        </span>
                                    </Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        placeholder="about"
                                    />
                                    <InputError message={errors.slug} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Content</Label>
                                    <RichTextEditor
                                        name="content"
                                        placeholder="Write the page content…"
                                    />
                                    <InputError message={errors.content} />
                                </div>

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
                                        Create page
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

PageCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pages', href: pagesIndex() },
        { title: 'New', href: '' },
    ],
};
