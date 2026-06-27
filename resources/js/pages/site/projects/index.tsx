import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProjectArtwork } from '@/components/site/project-artwork';
import { SeoHead } from '@/components/site/seo-head';
import { SiteNav } from '@/components/site/site-nav';
import { SplitHeadline } from '@/components/site/split-headline';
import { screenshotUrl } from '@/lib/preview';

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

// Projects whose live sites can't be screenshotted (auth-gated / gov portals);
// these fall back to the generative artwork instead.
const NO_SCREENSHOT = new Set([
    'judicial-service-commission-website',
    'recruitment-portal-of-judicial-service-commission',
]);

/**
 * Full-bleed, grayscale project screenshot with a dark scrim so text reads
 * cleanly on top. Falls back to the generative artwork. Re-mounted per project
 * (via key) so the screenshot fades in and the error state resets.
 */
function Backdrop({
    slug,
    image,
    link,
}: {
    slug: string;
    image: string | null;
    link: string | null;
}) {
    const [failed, setFailed] = useState(false);
    // Priority: uploaded image (manual override) → live screenshot → artwork.
    const src = image ?? (!failed && link ? screenshotUrl(link, 1600) : null);

    return (
        <div className="absolute inset-0 animate-in fade-in duration-700">
            {src ? (
                <img
                    src={src}
                    alt=""
                    onError={() => setFailed(true)}
                    className="size-full object-cover object-top grayscale"
                />
            ) : (
                <ProjectArtwork seed={slug} />
            )}
            <div aria-hidden className="absolute inset-0 bg-background/45" />
            <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-background via-background/55 to-background/15"
            />
        </div>
    );
}

export default function ProjectsIndex({ projects }: Props) {
    const [active, setActive] = useState(0);
    const total = projects.length;

    const go = (dir: number) => {
        if (total === 0) {
            return;
        }

        setActive((current) => (current + dir + total) % total);
    };

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight') {
                go(1);
            }

            if (event.key === 'ArrowLeft') {
                go(-1);
            }
        };

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total]);

    const project = projects[active];
    const progress = total > 1 ? Math.round((active / (total - 1)) * 100) : 100;
    const chips = project?.technologies?.length
        ? project.technologies
        : (project?.tags ?? []);

    return (
        <div className="dark relative flex h-svh flex-col overflow-hidden bg-background text-foreground antialiased">
            <SeoHead
                title="Projects"
                description="A selection of things I've built — for clients, for friends, and for myself."
            />

            <SiteNav />

            {total === 0 ? (
                <main className="flex flex-1 items-center justify-center px-6">
                    <p className="text-sm text-muted-foreground">
                        Nothing here yet.
                    </p>
                </main>
            ) : (
                <main className="relative flex-1 overflow-hidden">
                    <Backdrop
                        key={project.slug}
                        slug={project.slug}
                        image={project.image}
                        link={
                            NO_SCREENSHOT.has(project.slug)
                                ? null
                                : project.link
                        }
                    />

                    {/* Index number */}
                    <span className="pointer-events-none absolute top-24 left-5 z-10 font-display text-[clamp(3rem,9vw,7rem)] leading-none font-semibold tabular-nums select-none lg:left-10">
                        {String(active + 1).padStart(2, '0')}
                    </span>

                    {/* Year + progress */}
                    <span className="absolute top-24 right-5 z-10 font-display text-sm font-medium text-muted-foreground tabular-nums lg:right-10">
                        2025
                    </span>
                    <span className="absolute top-1/2 right-5 z-10 -translate-y-1/2 font-display text-sm font-medium text-muted-foreground tabular-nums lg:right-10">
                        {progress}%
                    </span>

                    {/* Title + meta, lower-left */}
                    <div className="absolute inset-x-0 bottom-24 z-10 px-6 lg:px-10">
                        <div className="max-w-3xl">
                            <SplitHeadline
                                key={project.slug}
                                text={project.title}
                                className="font-display text-[clamp(1.375rem,3.2vw,2.5rem)] leading-none font-semibold tracking-[-0.02em] uppercase"
                            />
                            {chips.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {chips.slice(0, 4).map((chip) => (
                                        <span
                                            key={chip}
                                            className="rounded-full border px-3 py-1 font-display text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase"
                                        >
                                            {chip}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {project.description && (
                                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    {project.description}
                                </p>
                            )}
                        </div>
                    </div>
                </main>
            )}

            {/* Bottom pager + visit */}
            {total > 0 && (
                <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center gap-2 px-4">
                    <div className="pointer-events-auto flex items-center gap-2 rounded-full border bg-background/80 py-2 pr-3 pl-3 backdrop-blur">
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label="Previous project"
                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                        </button>
                        <span className="max-w-56 truncate text-center font-display text-xs font-medium tracking-[0.12em] text-foreground uppercase">
                            {String(active + 1).padStart(2, '0')} /{' '}
                            {String(total).padStart(2, '0')} — {project?.title}
                        </span>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label="Next project"
                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowRight className="size-4" />
                        </button>
                    </div>

                    {project?.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-4 py-2 font-display text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase backdrop-blur transition-colors hover:text-foreground"
                        >
                            Visit
                            <ArrowUpRight className="size-3.5" />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
