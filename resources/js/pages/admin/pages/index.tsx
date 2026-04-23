import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminPage } from '@/components/admin/admin-page';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Badge } from '@/components/ui/badge';
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
    index as pagesIndex,
} from '@/routes/admin/pages';

type Page = {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    updated_at: string;
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
    pages: Paginated<Page>;
};

export default function PagesIndex({ pages }: Props) {
    return (
        <>
            <Head title="Pages" />
            <AdminPage
                title="Pages"
                description="Standalone pages like About, Contact, Portfolio."
                actions={
                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            New page
                        </Link>
                    </Button>
                }
            >
                {pages.data.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <div className="rounded-lg border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Updated
                                        </TableHead>
                                        <TableHead className="w-[120px] text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pages.data.map((page) => (
                                        <TableRow key={page.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={edit(page.slug)}
                                                    className="hover:underline"
                                                >
                                                    {page.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {page.slug}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        page.is_published
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {page.is_published
                                                        ? 'Published'
                                                        : 'Draft'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-muted-foreground">
                                                {new Date(
                                                    page.updated_at,
                                                ).toLocaleDateString()}
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
                                                                page.slug,
                                                            )}
                                                        >
                                                            <Pencil />
                                                            <span className="sr-only">
                                                                Edit
                                                            </span>
                                                        </Link>
                                                    </Button>
                                                    <ConfirmDialog
                                                        title="Delete page?"
                                                        description={`"${page.title}" will be permanently removed.`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() =>
                                                            router.delete(
                                                                destroy(
                                                                    page.slug,
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

                        <Pagination paginated={pages} />
                    </>
                )}
            </AdminPage>
        </>
    );
}

function EmptyState() {
    return (
        <div className="rounded-lg border border-dashed bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">No pages yet.</p>
            <Button asChild className="mt-4">
                <Link href={create()}>
                    <Plus />
                    Create your first page
                </Link>
            </Button>
        </div>
    );
}

function Pagination({ paginated }: { paginated: Paginated<Page> }) {
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

PagesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pages', href: pagesIndex() },
    ],
};
