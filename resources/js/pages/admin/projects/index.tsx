import { Form, Head, router } from '@inertiajs/react';
import { Check, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState  } from 'react';
import type {ChangeEvent} from 'react';
import { AdminPage } from '@/components/admin/admin-page';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { FormDialog } from '@/components/admin/form-dialog';
import { TagInput } from '@/components/admin/tag-input';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import {
    destroy,
    index as projectsIndex,
    store,
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

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Props = {
    projects: Paginated<Project>;
};

// `undefined` = dialog closed · `null` = creating · Project = editing
type Editing = Project | null | undefined;

export default function ProjectsIndex({ projects }: Props) {
    const [editing, setEditing] = useState<Editing>(undefined);

    return (
        <>
            <Head title="Projects" />
            <AdminPage
                title="Projects"
                description="Portfolio entries shown on the public site."
                actions={
                    <Button onClick={() => setEditing(null)}>
                        <Plus />
                        New project
                    </Button>
                }
            >
                {projects.data.length === 0 ? (
                    <EmptyState onNew={() => setEditing(null)} />
                ) : (
                    <>
                        <div className="rounded-lg border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Tags</TableHead>
                                        <TableHead>Link</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[120px] text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.data.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditing(project)
                                                    }
                                                    className="text-left hover:underline"
                                                >
                                                    {project.title}
                                                </button>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {(project.tags ?? []).map(
                                                        (tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="secondary"
                                                                className="text-[10px]"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {project.link ? (
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 hover:underline"
                                                    >
                                                        {project.link.replace(
                                                            /^https?:\/\//,
                                                            '',
                                                        )}
                                                        <ExternalLink className="size-3" />
                                                    </a>
                                                ) : (
                                                    '—'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        project.is_published
                                                            ? 'success'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {project.is_published && (
                                                        <Check />
                                                    )}
                                                    {project.is_published
                                                        ? 'Published'
                                                        : 'Draft'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setEditing(project)
                                                        }
                                                    >
                                                        <Pencil />
                                                        <span className="sr-only">
                                                            Edit
                                                        </span>
                                                    </Button>
                                                    <ConfirmDialog
                                                        title="Delete project?"
                                                        description={`"${project.title}" will be permanently removed.`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() =>
                                                            router.delete(
                                                                destroy(
                                                                    project.slug,
                                                                ).url,
                                                                {
                                                                    preserveScroll:
                                                                        true,
                                                                },
                                                            )
                                                        }
                                                        trigger={
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 />
                                                                <span className="sr-only">
                                                                    Delete
                                                                </span>
                                                            </Button>
                                                        }
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <Pagination paginated={projects} />
                    </>
                )}
            </AdminPage>

            <ProjectFormDialog
                project={editing}
                onClose={() => setEditing(undefined)}
            />
        </>
    );
}

function ProjectFormDialog({
    project,
    onClose,
}: {
    project: Editing;
    onClose: () => void;
}) {
    return (
        <FormDialog
            open={project !== undefined}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title={project ? 'Edit project' : 'New project'}
            description="Portfolio entries shown on the public site."
            className="sm:max-w-2xl"
        >
            {project !== undefined && (
                <ProjectForm
                    key={project?.id ?? 'new'}
                    project={project}
                    onClose={onClose}
                />
            )}
        </FormDialog>
    );
}

function ProjectForm({
    project,
    onClose,
}: {
    project: Project | null;
    onClose: () => void;
}) {
    const isEdit = !!project;
    const [isPublished, setIsPublished] = useState(
        project?.is_published ?? true,
    );
    const [preview, setPreview] = useState<string | null>(null);
    const existingImageUrl = project?.image ? `/storage/${project.image}` : null;

    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    return (
        <Form
            {...(isEdit ? update.form(project.slug) : store.form())}
            onSuccess={onClose}
            options={{ preserveScroll: true }}
            className="space-y-5"
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
                            defaultValue={project?.title ?? ''}
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">
                            Slug{' '}
                            <span className="text-xs text-muted-foreground">
                                (optional · auto-generated)
                            </span>
                        </Label>
                        <Input
                            id="slug"
                            name="slug"
                            defaultValue={project?.slug ?? ''}
                        />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            rows={3}
                            required
                            defaultValue={project?.description ?? ''}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <TagInput
                                id="tags"
                                name="tags"
                                defaultValue={project?.tags ?? []}
                                placeholder="e.g. Web Apps, APIs"
                            />
                            <InputError message={errors.tags} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="technologies">Technologies</Label>
                            <TagInput
                                id="technologies"
                                name="technologies"
                                defaultValue={project?.technologies ?? []}
                                placeholder="e.g. Laravel, React"
                            />
                            <InputError message={errors.technologies} />
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
                                defaultValue={project?.link ?? ''}
                            />
                            <InputError message={errors.link} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sort_order">
                                Sort order{' '}
                                <span className="text-xs text-muted-foreground">
                                    (lower first)
                                </span>
                            </Label>
                            <Input
                                id="sort_order"
                                name="sort_order"
                                type="number"
                                min={0}
                                defaultValue={project?.sort_order ?? 0}
                            />
                            <InputError message={errors.sort_order} />
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
                                    alt="Current"
                                    className="max-h-24 rounded-md border object-contain"
                                />
                                <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                    <input
                                        type="checkbox"
                                        name="remove_image"
                                        value="1"
                                    />
                                    Remove
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
                                className="mt-2 max-h-40 rounded-md border object-contain"
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
                        <Label
                            htmlFor="is_published"
                            className="cursor-pointer text-sm"
                        >
                            Published
                            <span className="block text-xs font-normal text-muted-foreground">
                                Uncheck to hide from the portfolio.
                            </span>
                        </Label>
                    </div>
                    <InputError message={errors.is_published} />

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            {isEdit ? 'Save changes' : 'Create project'}
                        </Button>
                    </DialogFooter>
                </>
            )}
        </Form>
    );
}

function EmptyState({ onNew }: { onNew: () => void }) {
    return (
        <div className="rounded-lg border border-dashed bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">No projects yet.</p>
            <Button onClick={onNew} className="mt-4">
                <Plus />
                Add your first project
            </Button>
        </div>
    );
}

function Pagination({ paginated }: { paginated: Paginated<Project> }) {
    if (paginated.last_page <= 1) {
        return null;
    }

    return (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
                Page {paginated.current_page} of {paginated.last_page} ·{' '}
                {paginated.total} total
            </p>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    asChild={!!paginated.prev_page_url}
                    disabled={!paginated.prev_page_url}
                >
                    {paginated.prev_page_url ? (
                        <a href={paginated.prev_page_url}>Previous</a>
                    ) : (
                        <span>Previous</span>
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    asChild={!!paginated.next_page_url}
                    disabled={!paginated.next_page_url}
                >
                    {paginated.next_page_url ? (
                        <a href={paginated.next_page_url}>Next</a>
                    ) : (
                        <span>Next</span>
                    )}
                </Button>
            </div>
        </div>
    );
}

ProjectsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Projects', href: projectsIndex() },
    ],
};
