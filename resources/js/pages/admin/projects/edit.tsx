import { Form, Head, Link, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState  } from 'react';
import type {ChangeEvent} from 'react';
import { AdminPage } from '@/components/admin/admin-page';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { TagInput } from '@/components/admin/tag-input';
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
    index as projectsIndex,
    update,
} from '@/routes/admin/projects';

type Project = {
    id: number;
    title: string;
    slug: string;
    description: string;
    tags: string[] | null;
    technologies: string[] | null;
    image: string | null;
    link: string | null;
    is_published: boolean;
    sort_order: number;
};

type Props = {
    project: Project;
};

export default function ProjectEdit({ project }: Props) {
    const [isPublished, setIsPublished] = useState(project.is_published);
    const [preview, setPreview] = useState<string | null>(null);

    const existingImageUrl = project.image ? `/storage/${project.image}` : null;

    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    return (
        <>
            <Head title={`Edit ${project.title}`} />
            <AdminPage
                title="Edit project"
                description={project.title}
                actions={
                    <ConfirmDialog
                        title="Delete project?"
                        description={`"${project.title}" will be permanently removed.`}
                        confirmLabel="Delete"
                        onConfirm={() =>
                            router.delete(destroy(project.slug).url)
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
                        {...update.form(project.slug)}
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
                                        defaultValue={project.title}
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        defaultValue={project.slug}
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
                                        rows={4}
                                        required
                                        defaultValue={project.description}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="tags">Tags</Label>
                                        <TagInput
                                            id="tags"
                                            name="tags"
                                            defaultValue={project.tags ?? []}
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
                                            defaultValue={
                                                project.technologies ?? []
                                            }
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
                                            defaultValue={project.link ?? ''}
                                        />
                                        <InputError message={errors.link} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sort_order">
                                            Sort order
                                        </Label>
                                        <Input
                                            id="sort_order"
                                            name="sort_order"
                                            type="number"
                                            min={0}
                                            defaultValue={project.sort_order}
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
                                            (optional · max 5 MB)
                                        </span>
                                    </Label>
                                    {existingImageUrl && !preview && (
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={existingImageUrl}
                                                alt="Current image"
                                                className="max-h-32 rounded-md border object-contain"
                                            />
                                            <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                                <input
                                                    type="checkbox"
                                                    name="remove_image"
                                                    value="1"
                                                />
                                                Remove current image
                                            </label>
                                        </div>
                                    )}
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

ProjectEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Projects', href: projectsIndex() },
        { title: 'Edit', href: '' },
    ],
};
