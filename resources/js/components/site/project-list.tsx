import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { CropMarks } from '@/components/site/crop-marks';
import { index as projectsIndex } from '@/routes/site/projects';

export type ProjectListItem = {
    id: number;
    title: string;
    slug: string;
    description?: string | null;
    tags: string[] | null;
    technologies: string[] | null;
    link: string | null;
};

function stackOf(project: ProjectListItem): string[] {
    return project.technologies?.length
        ? project.technologies
        : (project.tags ?? []);
}

function ProjectLink({
    project,
    className,
    children,
}: {
    project: ProjectListItem;
    className: string;
    children: ReactNode;
}) {
    if (project.link) {
        return (
            <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className={className}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={projectsIndex()} className={className}>
            {children}
        </Link>
    );
}

/** Home page showcase: centred cards that scroll horizontally on mobile. */
export function ProjectCards({ projects }: { projects: ProjectListItem[] }) {
    return (
        <ul className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {projects.map((project) => (
                <li
                    key={project.id}
                    className="w-[78%] max-w-xs shrink-0 snap-start md:w-auto md:max-w-none"
                >
                    <ProjectLink
                        project={project}
                        className="group relative flex h-full flex-col items-center rounded-md border border-border bg-background p-7 text-center transition-colors hover:bg-accent"
                    >
                        <CropMarks className="-inset-1.5 text-border opacity-0 transition-opacity group-hover:opacity-100" />

                        <span className="relative inline-flex size-14 items-center justify-center rounded-full bg-muted font-display text-xl font-semibold text-brand">
                            {project.title.charAt(0).toUpperCase()}
                        </span>

                        <h3 className="mt-5 font-display font-semibold tracking-[-0.01em] text-balance transition-colors group-hover:text-brand">
                            {project.title}
                        </h3>

                        {project.description && (
                            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                {project.description}
                            </p>
                        )}

                        {stackOf(project).length > 0 && (
                            <p className="mt-4 text-xs text-muted-foreground">
                                {stackOf(project).slice(0, 3).join(' · ')}
                            </p>
                        )}
                    </ProjectLink>
                </li>
            ))}
        </ul>
    );
}

/** Projects page inventory: one scannable row per project. */
export function ProjectRows({ projects }: { projects: ProjectListItem[] }) {
    return (
        <ul className="border-t border-border">
            {projects.map((project) => (
                <li key={project.id}>
                    <ProjectLink
                        project={project}
                        className="group flex flex-col gap-2 border-b border-border py-6 sm:flex-row sm:items-baseline sm:gap-8"
                    >
                        <h3 className="flex items-center gap-1.5 font-display font-semibold tracking-[-0.01em] text-balance transition-colors group-hover:text-brand sm:w-80 sm:shrink-0">
                            {project.title}
                            {project.link && (
                                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
                            )}
                        </h3>

                        <div className="min-w-0 flex-1">
                            {project.description && (
                                <p className="max-w-2xl leading-relaxed text-muted-foreground">
                                    {project.description}
                                </p>
                            )}
                            {stackOf(project).length > 0 && (
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {stackOf(project).join(' · ')}
                                </p>
                            )}
                        </div>
                    </ProjectLink>
                </li>
            ))}
        </ul>
    );
}
