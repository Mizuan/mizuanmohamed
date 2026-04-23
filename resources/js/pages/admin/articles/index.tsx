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
    index as articlesIndex,
} from '@/routes/admin/articles';

type Article = {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    published_at: string | null;
    updated_at: string;
    category: { id: number; name: string; slug: string } | null;
    author: { id: number; name: string } | null;
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
    articles: Paginated<Article>;
};

export default function ArticlesIndex({ articles }: Props) {
    return (
        <>
            <Head title="Articles" />
            <AdminPage
                title="Articles"
                description="Write and publish long-form content."
                actions={
                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            New article
                        </Link>
                    </Button>
                }
            >
                {articles.data.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <div className="rounded-lg border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
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
                                    {articles.data.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={edit(article.slug)}
                                                    className="hover:underline"
                                                >
                                                    {article.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {article.category?.name ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        article.status ===
                                                        'published'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {article.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-muted-foreground">
                                                {new Date(
                                                    article.updated_at,
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
                                                                article.slug,
                                                            )}
                                                        >
                                                            <Pencil />
                                                            <span className="sr-only">
                                                                Edit
                                                            </span>
                                                        </Link>
                                                    </Button>
                                                    <ConfirmDialog
                                                        title="Delete article?"
                                                        description={`"${article.title}" will be permanently removed.`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() =>
                                                            router.delete(
                                                                destroy(
                                                                    article.slug,
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

                        <Pagination paginated={articles} />
                    </>
                )}
            </AdminPage>
        </>
    );
}

function EmptyState() {
    return (
        <div className="rounded-lg border border-dashed bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">No articles yet.</p>
            <Button asChild className="mt-4">
                <Link href={create()}>
                    <Plus />
                    Write your first article
                </Link>
            </Button>
        </div>
    );
}

function Pagination({ paginated }: { paginated: Paginated<Article> }) {
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

ArticlesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Articles', href: articlesIndex() },
    ],
};
