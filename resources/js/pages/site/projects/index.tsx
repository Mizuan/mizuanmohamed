import { PageHeader } from '@/components/site/page-header';
import { ProjectRows } from '@/components/site/project-list';
import type { ProjectListItem } from '@/components/site/project-list';
import { SeoHead } from '@/components/site/seo-head';

type Props = {
    projects: ProjectListItem[];
};

export default function ProjectsIndex({ projects }: Props) {
    return (
        <>
            <SeoHead
                title="Projects"
                description="A selection of things I've built — for clients, for friends, and for myself."
            />

            <PageHeader
                title="Projects"
                description="Products, tools, and sites — built end to end with Laravel, React, and TypeScript."
            />

            {projects.length === 0 ? (
                <p className="border-t border-border py-10 text-muted-foreground">
                    Nothing here yet.
                </p>
            ) : (
                <ProjectRows projects={projects} />
            )}
        </>
    );
}
