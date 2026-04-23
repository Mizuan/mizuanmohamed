import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminPage } from '@/components/admin/admin-page';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import {
    create,
    destroy,
    edit,
    index as categoriesIndex,
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

export default function CategoriesIndex({ categories }: Props) {
    return (
        <>
            <Head title="Categories" />
            <AdminPage
                title="Categories"
                description="Organise articles by category."
                actions={
                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            New category
                        </Link>
                    </Button>
                }
            >
                {categories.data.length === 0 ? (
                    <EmptyState />
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
                                                <Link
                                                    href={edit(category.slug)}
                                                    className="hover:underline"
                                                >
                                                    {category.name}
                                                </Link>
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
                                                        asChild
                                                    >
                                                        <Link
                                                            href={edit(
                                                                category.slug,
                                                            )}
                                                        >
                                                            <Pencil />
                                                            <span className="sr-only">
                                                                Edit
                                                            </span>
                                                        </Link>
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
        </>
    );
}

function EmptyState() {
    return (
        <div className="rounded-lg border border-dashed bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">
                No categories yet.
            </p>
            <Button asChild className="mt-4">
                <Link href={create()}>
                    <Plus />
                    Create your first category
                </Link>
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
                        <Link href={paginated.prev_page_url} preserveScroll>
                            Previous
                        </Link>
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
                        <Link href={paginated.next_page_url} preserveScroll>
                            Next
                        </Link>
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
