import { Head, Link } from '@inertiajs/react';
import {
    Check,
    FileText,
    FolderKanban,
    Layers,
    Newspaper,
    Tag as TagIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AdminPage } from '@/components/admin/admin-page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    create as createArticle,
    edit as editArticle,
    index as articlesIndex,
} from '@/routes/admin/articles';
import { index as pagesIndex } from '@/routes/admin/pages';
import { index as projectsIndex } from '@/routes/admin/projects';

type Stats = {
    articles: { total: number; published: number; drafts: number };
    categories: number;
    tags: number;
    pages: { total: number; published: number };
    projects: { total: number; published: number };
};

type RecentArticle = {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    published_at: string | null;
    updated_at: string;
    category: { id: number; name: string } | null;
};

type Props = {
    stats: Stats;
    recentArticles: RecentArticle[];
};

export default function Dashboard({ stats, recentArticles }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <AdminPage
                title="Dashboard"
                description="Overview of your content"
                actions={
                    <Button asChild>
                        <Link href={createArticle()}>New article</Link>
                    </Button>
                }
            >
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
                    <StatCard
                        title="Articles"
                        icon={Newspaper}
                        href={articlesIndex().url}
                        primary={stats.articles.total}
                        sub={`${stats.articles.published} published · ${stats.articles.drafts} drafts`}
                    />
                    <StatCard
                        title="Pages"
                        icon={FileText}
                        href={pagesIndex().url}
                        primary={stats.pages.total}
                        sub={`${stats.pages.published} published`}
                    />
                    <StatCard
                        title="Projects"
                        icon={FolderKanban}
                        href={projectsIndex().url}
                        primary={stats.projects.total}
                        sub={`${stats.projects.published} published`}
                    />
                    <StatCard
                        title="Categories"
                        icon={Layers}
                        href="/admin/categories"
                        external
                        primary={stats.categories}
                    />
                    <StatCard
                        title="Tags"
                        icon={TagIcon}
                        href="/admin/tags"
                        external
                        primary={stats.tags}
                    />
                </div>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Recent articles</CardTitle>
                        <CardDescription>
                            The five most recently touched articles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentArticles.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No articles yet.{' '}
                                <Link
                                    href={createArticle()}
                                    className="font-medium text-foreground underline-offset-4 hover:underline"
                                >
                                    Write your first one
                                </Link>
                                .
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Updated
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentArticles.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={editArticle(
                                                        article.slug,
                                                    )}
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
                                                            ? 'success'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {article.status ===
                                                        'published' && (
                                                        <Check />
                                                    )}
                                                    {article.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-muted-foreground">
                                                {new Date(
                                                    article.updated_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </AdminPage>
        </>
    );
}

function StatCard({
    title,
    primary,
    sub,
    href,
    external,
    icon: Icon,
}: {
    title: string;
    primary: number;
    sub?: string;
    href: string;
    external?: boolean;
    icon: LucideIcon;
}) {
    const className =
        'group block w-56 shrink-0 snap-start rounded-lg border bg-card p-4 transition-colors hover:bg-accent sm:w-auto sm:shrink';

    const body = (
        <>
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                    {title}
                </p>
                <Icon className="size-5 text-muted-foreground" />
            </div>
            <p className="mt-1.5 text-2xl font-semibold">{primary}</p>
            {sub && (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {sub}
                </p>
            )}
        </>
    );

    if (external) {
        return (
            <a href={href} className={className}>
                {body}
            </a>
        );
    }

    return (
        <Link href={href} className={className}>
            {body}
        </Link>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
