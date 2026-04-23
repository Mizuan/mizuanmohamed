import { Form, Head, Link } from '@inertiajs/react';
import { useState, type ChangeEvent } from 'react';
import { AdminPage } from '@/components/admin/admin-page';
import { TagInput } from '@/components/admin/tag-input';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { index as projectsIndex, store } from '@/routes/admin/projects';

export default function ProjectCreate() {
    const [isPublished, setIsPublished] = useState(true);
    const [preview, setPreview] = useState<string | null>(null);

    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    return (
        <>
            <Head title="New project" />
            <AdminPage title="New project" description="Add a portfolio entry.">
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
                                    <Input id="slug" name="slug" />
                                    <InputError message={errors.slug} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        required
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="tags">Tags</Label>
                                        <TagInput
                                            id="tags"
                                            name="tags"
                                            placeholder="e.g. Web Apps, APIs"
                                        />
                                        <InputError message={errors.tags} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="technologies">
                                            Technologies
                                        </Label>
                                        <TagInput
                                            id="technologies"
                                            name="technologies"
                                            placeholder="e.g. Laravel, React"
                                        />
                                        <InputError
                                            message={errors.technologies}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="link">Link</Label>
                                        <Input
                                            id="link"
                                            name="link"
                                            type="url"
                                            placeholder="https://"
                                        />
                                        <InputError message={errors.link} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sort_order">
                                            Sort order{' '}
                                            <span className="text-xs text-muted-foreground">
                                                (lower shows first)
                                            </span>
                                        </Label>
                                        <Input
                                            id="sort_order"
                                            name="sort_order"
                                            type="number"
                                            min={0}
                                            defaultValue={0}
                                        />
                                        <InputError
                                            message={errors.sort_order}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">
                                        Image{' '}
                                        <span className="text-xs text-muted-foreground">
                                            (optional · max 4 MB)
                                        </span>
                                    </Label>
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImage}
                                    />
                                    {preview && (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="mt-2 max-h-48 rounded-md border object-contain"
                                        />
                                    )}
                                    <InputError message={errors.image} />
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
                                            Uncheck to hide from the public
                                            portfolio.
                                        </p>
                                    </div>
                                </div>
                                <InputError message={errors.is_published} />

                                <div className="flex items-center justify-end gap-2 border-t pt-4">
                                    <Button variant="ghost" asChild>
                                        <Link href={projectsIndex()}>
                                            Cancel
                                        </Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        Create project
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

ProjectCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Projects', href: projectsIndex() },
        { title: 'New', href: '' },
    ],
};
