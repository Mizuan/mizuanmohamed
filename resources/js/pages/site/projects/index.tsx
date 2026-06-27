import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ProjectArtwork } from '@/components/site/project-artwork';
import { SeoHead } from '@/components/site/seo-head';
import { SiteNav } from '@/components/site/site-nav';
import { screenshotUrl } from '@/lib/preview';
import { storageUrl } from '@/lib/storage';

gsap.registerPlugin(ScrollTrigger);

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

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Full-bleed project screenshot with a black vignette so text reads on top.
 * Priority: uploaded image → live screenshot → generative artwork.
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
    const src = image
        ? storageUrl(image)
        : !failed && link
          ? screenshotUrl(link, 1600)
          : null;

    return (
        <div className="absolute inset-0">
            {src ? (
                <img
                    src={src}
                    alt=""
                    loading="lazy"
                    onError={() => setFailed(true)}
                    className="size-full object-cover object-top"
                />
            ) : (
                <ProjectArtwork seed={slug} />
            )}
            <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/55"
            />
        </div>
    );
}

export default function ProjectsIndex({ projects }: Props) {
    const root = useRef<HTMLDivElement | null>(null);
    const total = projects.length;

    useEffect(() => {
        const reduce = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        if (reduce) {
            return;
        }

        // Smooth (eased) scrolling, synced to ScrollTrigger so the stack
        // animations stay glued to the scroll position.
        const lenis = new Lenis({ lerp: 0.1 });
        lenis.on('scroll', ScrollTrigger.update);
        const onTick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);

        const ctx = gsap.context(() => {
            const sections =
                gsap.utils.toArray<HTMLElement>('.proj-section');

            sections.forEach((section, i) => {
                // The last section is never covered, so it doesn't recede.
                if (i === sections.length - 1) {
                    return;
                }

                const card = section.querySelector('.proj-card');
                const dim = section.querySelector('.proj-dim');

                // As the next section scrolls up over this one, scale it down
                // and darken it so it appears to settle behind.
                const trigger = {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                };

                gsap.to(card, {
                    scale: 0.92,
                    ease: 'none',
                    scrollTrigger: trigger,
                });
                gsap.to(dim, {
                    opacity: 0.6,
                    ease: 'none',
                    scrollTrigger: trigger,
                });
            });
        }, root);

        return () => {
            ctx.revert();
            gsap.ticker.remove(onTick);
            gsap.ticker.lagSmoothing(500, 33);
            lenis.destroy();
        };
    }, []);

    return (
        <div
            ref={root}
            className="dark relative bg-background text-foreground antialiased"
        >
            <SeoHead
                title="Projects"
                description="A selection of things I've built — for clients, for friends, and for myself."
            />

            <SiteNav />

            {total === 0 ? (
                <div className="flex h-svh items-center justify-center px-6">
                    <p className="text-sm text-muted-foreground">
                        Nothing here yet.
                    </p>
                </div>
            ) : (
                projects.map((project, i) => {
                    const chips = project.technologies?.length
                        ? project.technologies
                        : (project.tags ?? []);

                    return (
                        <section
                            key={project.id}
                            className="proj-section sticky top-0 h-svh overflow-hidden bg-black"
                        >
                            <div className="proj-card relative size-full origin-center will-change-transform">
                                <Backdrop
                                    slug={project.slug}
                                    image={project.image}
                                    link={
                                        NO_SCREENSHOT.has(project.slug)
                                            ? null
                                            : project.link
                                    }
                                />

                                {/* Index number */}
                                <span className="pointer-events-none absolute top-24 left-5 font-display text-[clamp(3rem,9vw,7rem)] leading-none font-semibold tabular-nums select-none lg:left-10">
                                    {pad(i + 1)}
                                </span>

                                {/* Position */}
                                <span className="absolute top-24 right-5 font-display text-sm font-medium text-muted-foreground tabular-nums lg:right-10">
                                    {pad(i + 1)} / {pad(total)}
                                </span>

                                {/* Title + meta */}
                                <div className="absolute inset-x-0 bottom-16 px-6 lg:px-10">
                                    <div className="max-w-3xl">
                                        <h2 className="font-display text-[clamp(1.375rem,3.2vw,2.5rem)] leading-none font-semibold tracking-[-0.02em] uppercase">
                                            {project.title}
                                        </h2>
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
                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-5 inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-4 py-2 font-display text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase backdrop-blur transition-colors hover:text-foreground"
                                            >
                                                Visit
                                                <ArrowUpRight className="size-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Darkens as the next project covers this one */}
                                <div className="proj-dim pointer-events-none absolute inset-0 bg-black opacity-0" />
                            </div>
                        </section>
                    );
                })
            )}
        </div>
    );
}
