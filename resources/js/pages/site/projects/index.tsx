import { PageHeader } from '@/components/site/page-header';
import { ProjectCard } from '@/components/site/project-card';
import { SeoHead } from '@/components/site/seo-head';

type Project = {
    id: number;
    title: string;
    slug: string;
    description: string;
    tags: string[] | null;
    technologies: string[] | null;
    image: string | null;
    link: string | null;
};

type Props = {
    projects: Project[];
};

export default function ProjectsIndex({ projects }: Props) {
    return (
        <>
            <SeoHead
                title="Projects"
                description="A selection of things I've built — for clients, for friends, and for myself."
            />

            {/* Break out of the layout's narrow reading column so the grid
                can breathe across three columns on desktop. */}
            <section className="relative left-1/2 w-screen -translate-x-1/2 pb-16">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    <PageHeader
                        eyebrow="Selected work"
                        title="Projects"
                        description="A selection of things I've built — for clients, for friends, and for myself."
                    />

                    {projects.length === 0 ? (
                        <p className="rounded-md border border-dashed p-12 text-center text-sm text-muted-foreground">
                            Nothing here yet.
                        </p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
