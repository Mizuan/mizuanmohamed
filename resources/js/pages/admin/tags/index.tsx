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
    index as tagsIndex,
} from '@/routes/admin/tags';

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

export default function TagsIndex({ tags }: Props) {
    return (
        <>
            <Head title="Tags" />
            <AdminPage
                title="Tags"
                description="Label articles with reusable tags."
                actions={
                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            New tag
                        </Link>
                    </Button>
                }
            >
                {tags.data.length === 0 ? (
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
                                    {tags.data.map((tag) => (
                                        <TableRow key={tag.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={edit(tag.slug)}
                                                    className="hover:underline"
                                                >
                                                    {tag.name}
                                                </Link>
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
                                                        asChild
                                                    >
                                                        <Link
                                                            href={edit(tag.slug)}
                                                        >
                                                            <Pencil />
                                                            <span className="sr-only">
                                                                Edit
                                                            </span>
                                                        </Link>
                                                    </Button>
                                                    <ConfirmDialog
                                                        title="Delete tag?"
                                                        description={`"${tag.name}" will be removed from all articles.`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() =>
                                                            router.delete(
                                                                destroy(
                                                                    tag.slug,
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

                        <Pagination paginated={tags} />
                    </>
                )}
            </AdminPage>
        </>
    );
}

function EmptyState() {
    return (
        <div className="rounded-lg border border-dashed bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">No tags yet.</p>
            <Button asChild className="mt-4">
                <Link href={create()}>
                    <Plus />
                    Create your first tag
                </Link>
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

TagsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Tags', href: tagsIndex() },
    ],
};
