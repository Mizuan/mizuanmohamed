import { Form, Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdminPage } from '@/components/admin/admin-page';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { FormDialog } from '@/components/admin/form-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import { dashboard } from '@/routes';
import { destroy, index as tagsIndex, store, update } from '@/routes/admin/tags';

type Tag = {
    id: number;
    name: string;
    slug: string;
    articles_count: number;
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
    tags: Paginated<Tag>;
};

// `undefined` = dialog closed · `null` = creating · Tag = editing
type Editing = Tag | null | undefined;

export default function TagsIndex({ tags }: Props) {
    const [editing, setEditing] = useState<Editing>(undefined);

    return (
        <>
            <Head title="Tags" />
            <AdminPage
                title="Tags"
                description="Label articles with reusable tags."
                actions={
                    <Button onClick={() => setEditing(null)}>
                        <Plus />
                        New tag
                    </Button>
                }
            >
                {tags.data.length === 0 ? (
                    <EmptyState onNew={() => setEditing(null)} />
                ) : (
                    <>
                        <div className="rounded-lg border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead className="text-right">
                                            Articles
                                        </TableHead>
                                        <TableHead className="w-[120px] text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tags.data.map((tag) => (
                                        <TableRow key={tag.id}>
                                            <TableCell className="font-medium">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditing(tag)
                                                    }
                                                    className="text-left hover:underline"
                                                >
                                                    {tag.name}
                                                </button>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {tag.slug}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {tag.articles_count}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setEditing(tag)
                                                        }
                                                    >
                                                        <Pencil />
                                                        <span className="sr-only">
                                                            Edit
                                                        </span>
                                                    </Button>
                                                    <ConfirmDialog
                                                        title="Delete tag?"
                                                        description={`"${tag.name}" will be removed from all articles.`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() =>
                                                            router.delete(
                                                                destroy(tag.slug)
                                                                    .url,
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

                        <Pagination paginated={tags} />
                    </>
                )}
            </AdminPage>

            <TagFormDialog tag={editing} onClose={() => setEditing(undefined)} />
        </>
    );
}

function TagFormDialog({ tag, onClose }: { tag: Editing; onClose: () => void }) {
    const isEdit = !!tag;

    return (
        <FormDialog
            open={tag !== undefined}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title={isEdit ? 'Edit tag' : 'New tag'}
            description="Tags are attached to articles for filtering."
        >
            <Form
                key={tag?.id ?? 'new'}
                {...(isEdit ? update.form(tag.slug) : store.form())}
                resetOnSuccess
                onSuccess={onClose}
                options={{ preserveScroll: true }}
                className="space-y-5"
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
                                defaultValue={tag?.name ?? ''}
                                placeholder="e.g. Laravel"
                            />
                            <InputError message={errors.name} />
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
                                defaultValue={tag?.slug ?? ''}
                                placeholder="laravel"
                            />
                            <InputError message={errors.slug} />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                {isEdit ? 'Save changes' : 'Create tag'}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </Form>
        </FormDialog>
    );
}

function EmptyState({ onNew }: { onNew: () => void }) {
    return (
        <div className="rounded-lg border border-dashed bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">No tags yet.</p>
            <Button onClick={onNew} className="mt-4">
                <Plus />
                Create your first tag
            </Button>
        </div>
    );
}

function Pagination({ paginated }: { paginated: Paginated<Tag> }) {
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

TagsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Tags', href: tagsIndex() },
    ],
};
