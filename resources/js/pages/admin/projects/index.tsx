import { Head, Link, router } from '@inertiajs/react';
import { Check, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
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
    index as projectsIndex,
} from '@/routes/admin/projects';

type Project = {
    id: number;
    title: string;
    slug: string;
    tags: string[] | null;
    technologies: string[] | null;
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

export default function ProjectsIndex({ projects }: Props) {
    return (
        <>
            <Head title="Projects" />
            <AdminPage
                title="Projects"
                description="Portfolio entries shown on the public site."
                actions={
                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            New project
                        </Link>
                    </Button>
                }
            >
                {projects.data.length === 0 ? (
                    <EmptyState />
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
                                                <Link
                                                    href={edit(project.slug)}
                                                    className="hover:underline"
                                                >
                                                    {project.title}
                                                </Link>
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
                                                        asChild
                                                    >
                                                        <Link
                                                            href={edit(
                                                                project.slug,
                                                            )}
                                                        >
                                                            <Pencil />
                                                            <span className="sr-only">
                                                                Edit
                                                            </span>
                                                        </Link>
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
        </>
    );
}

function EmptyState() {
    return (
        <div className="rounded-lg border border-dashed bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">No projects yet.</p>
            <Button asChild className="mt-4">
                <Link href={create()}>
                    <Plus />
                    Add your first project
                </Link>
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

ProjectsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Projects', href: projectsIndex() },
    ],
};
