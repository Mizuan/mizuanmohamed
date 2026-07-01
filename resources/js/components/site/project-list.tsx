import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
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

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * A film-credits-style roll of projects: an index number, the title in large
 * display type, the stack, and a trailing arrow — no imagery. Each row links
 * out to the live project when one exists, otherwise to the projects index.
 */
export function ProjectList({
    projects,
    startIndex = 0,
}: {
    projects: ProjectListItem[];
    startIndex?: number;
}) {
    return (
        <ul>
            {projects.map((project, i) => {
                const stack = project.technologies?.length
                    ? project.technologies
                    : (project.tags ?? []);
                const external = Boolean(project.link);
                const rowClass =
                    'group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 border-t border-border py-7 transition-colors sm:grid-cols-[3.5rem_1fr_auto] lg:py-9';

                const inner = (
                    <>
                        <span className="font-display text-xs font-medium text-muted-foreground tabular-nums transition-colors group-hover:text-brand">
                            {pad(startIndex + i + 1)}
                        </span>

                        <div className="min-w-0">
                            <h3 className="font-display text-[clamp(1.75rem,5.5vw,4rem)] leading-[0.95] font-semibold tracking-[-0.02em] text-foreground uppercase transition-colors group-hover:text-brand">
                                {project.title}
                            </h3>
                            {stack.length > 0 && (
                                <p className="mt-3 font-display text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                                    {stack.join(' / ')}
                                </p>
                            )}
                        </div>

                        <ArrowUpRight className="col-start-2 size-6 shrink-0 self-center text-muted-foreground transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-brand sm:col-start-3" />
                    </>
                );

                return (
                    <li key={project.id}>
                        {external ? (
                            <a
                                href={project.link!}
                                target="_blank"
                                rel="noreferrer"
                                className={rowClass}
                            >
                                {inner}
                            </a>
                        ) : (
                            <Link href={projectsIndex()} className={rowClass}>
                                {inner}
                            </Link>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
