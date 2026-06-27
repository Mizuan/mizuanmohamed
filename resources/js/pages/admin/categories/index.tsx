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
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import {
    destroy,
    index as categoriesIndex,
    store,
    update,
} from '@/routes/admin/categories';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    articles_count: number;
    created_at: string;
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
    categories: Paginated<Category>;
};

// `undefined` = dialog closed · `null` = creating · Category = editing
type Editing = Category | null | undefined;

export default function CategoriesIndex({ categories }: Props) {
    const [editing, setEditing] = useState<Editing>(undefined);

    return (
        <>
            <Head title="Categories" />
            <AdminPage
                title="Categories"
                description="Organise articles by category."
                actions={
                    <Button onClick={() => setEditing(null)}>
                        <Plus />
                        New category
                    </Button>
                }
            >
                {categories.data.length === 0 ? (
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
                                    {categories.data.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditing(category)
                                                    }
                                                    className="text-left hover:underline"
                                                >
                                                    {category.name}
                                                </button>
                                                {category.description && (
                                                    <p className="mt-0.5 max-w-md truncate text-xs text-muted-foreground">
                                                        {category.description}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {category.slug}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {category.articles_count}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setEditing(category)
                                                        }
                                                    >
                                                        <Pencil />
                                                        <span className="sr-only">
                                                            Edit
                                                        </span>
                                                    </Button>
                                                    <ConfirmDialog
                                                        title="Delete category?"
                                                        description={`"${category.name}" will be removed. Articles in this category will become uncategorised.`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() =>
                                                            router.delete(
                                                                destroy(
                                                                    category.slug,
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

                        <Pagination paginated={categories} />
                    </>
                )}
            </AdminPage>

            <CategoryFormDialog
                category={editing}
                onClose={() => setEditing(undefined)}
            />
        </>
    );
}

function CategoryFormDialog({
    category,
    onClose,
}: {
    category: Editing;
    onClose: () => void;
}) {
    const isEdit = !!category;

    return (
        <FormDialog
            open={category !== undefined}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title={isEdit ? 'Edit category' : 'New category'}
            description="Categories help group related articles."
        >
            <Form
                key={category?.id ?? 'new'}
                {...(isEdit ? update.form(category.slug) : store.form())}
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
                                defaultValue={category?.name ?? ''}
                                placeholder="e.g. Engineering"
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
                                defaultValue={category?.slug ?? ''}
                                placeholder="engineering"
                            />
                            <InputError message={errors.slug} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={3}
                                defaultValue={category?.description ?? ''}
                                placeholder="What belongs in this category?"
                            />
                            <InputError message={errors.description} />
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
                                {isEdit ? 'Save changes' : 'Create category'}
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
            <p className="text-sm text-muted-foreground">No categories yet.</p>
            <Button onClick={onNew} className="mt-4">
                <Plus />
                Create your first category
            </Button>
        </div>
    );
}

function Pagination({ paginated }: { paginated: Paginated<Category> }) {
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

CategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Categories', href: categoriesIndex() },
    ],
};
