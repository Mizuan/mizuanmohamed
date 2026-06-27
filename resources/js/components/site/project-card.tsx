import { ArrowUpRight } from 'lucide-react';
import { ProjectArtwork } from '@/components/site/project-artwork';
import { cn } from '@/lib/utils';

export type ProjectCardProject = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    tags: string[] | null;
    technologies: string[] | null;
    image: string | null;
    link: string | null;
};

/**
 * A project card with a 16:10 media area — the project image when present, or
 * a deterministic abstract artwork otherwise — over a title, blurb, and tech
 * pills. Shared between the home page and the projects index.
 */
export function ProjectCard({
    project,
    large,
}: {
    project: ProjectCardProject;
    large?: boolean;
}) {
    const content = (
        <>
            <div className="relative aspect-16/10 overflow-hidden bg-muted">
                <ProjectArtwork seed={project.slug || project.title} />
            </div>
            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-medium tracking-tight">
                        {project.title}
                    </h3>
                    <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                {project.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {project.description}
                    </p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech) => (
                            <span
                                key={tech}
                                className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </>
    );

    const className = cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-foreground/30',
        large && 'sm:col-span-2',
    );

    return (
        <div data-reveal className="h-full">
            {project.link ? (
                <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                >
                    {content}
                </a>
            ) : (
                <div className={className}>{content}</div>
            )}
        </div>
    );
}
