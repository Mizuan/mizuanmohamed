import { ExternalLink } from 'lucide-react';
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

            <section className="pb-16">
                <header className="mb-10">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Projects
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        A selection of things I've built — for clients, for
                        friends, and for myself.
                    </p>
                </header>

                {projects.length === 0 ? (
                    <p className="rounded-md border border-dashed p-12 text-center text-sm text-muted-foreground">
                        Nothing here yet.
                    </p>
                ) : (
                    <ul className="space-y-8">
                        {projects.map((project) => (
                            <li
                                key={project.id}
                                className="border-b pb-8 last:border-0"
                            >
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <h2 className="text-lg font-semibold tracking-tight">
                                        {project.link ? (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 hover:underline"
                                            >
                                                {project.title}
                                                <ExternalLink className="size-3.5 text-muted-foreground" />
                                            </a>
                                        ) : (
                                            project.title
                                        )}
                                    </h2>
                                    {project.link && (
                                        <span className="text-xs text-muted-foreground">
                                            {project.link.replace(
                                                /^https?:\/\//,
                                                '',
                                            )}
                                        </span>
                                    )}
                                </div>

                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {project.description}
                                </p>

                                {(project.technologies?.length ?? 0) > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {project.technologies?.map((tech) => (
                                            <span
                                                key={tech}
                                                className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </>
    );
}
