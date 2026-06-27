import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ProjectColorArtwork } from '@/components/site/project-color-artwork';
import { SeoHead } from '@/components/site/seo-head';
import { SiteNav } from '@/components/site/site-nav';

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

const pad = (n: number) => String(n).padStart(2, '0');

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

        // Smooth, eased scrolling synced to ScrollTrigger.
        const lenis = new Lenis({ lerp: 0.1 });
        lenis.on('scroll', ScrollTrigger.update);
        const onTick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);

        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray<HTMLElement>('.proj-section');

            sections.forEach((section, i) => {
                if (i === sections.length - 1) {
                    return;
                }

                const card = section.querySelector('.proj-card');
                const dim = section.querySelector('.proj-dim');
                const trigger = {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                };

                gsap.to(card, {
                    scale: 0.94,
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
                    const stack = project.technologies?.length
                        ? project.technologies.join(' / ')
                        : (project.tags ?? []).join(' / ');

                    return (
                        <section
                            key={project.id}
                            className="proj-section sticky top-0 h-svh overflow-hidden bg-background"
                        >
                            <div className="proj-card relative grid h-full origin-center grid-rows-[32vh_1fr] will-change-transform lg:grid-cols-[3fr_2fr] lg:grid-rows-none">
                                {/* Artwork */}
                                <div className="order-1 lg:order-2">
                                    <ProjectColorArtwork seed={project.slug} />
                                </div>

                                {/* Details */}
                                <div className="order-2 flex flex-col overflow-y-auto px-6 pt-6 pb-10 lg:order-1 lg:px-12 lg:pt-28 lg:pb-14">
                                    <div className="flex items-center justify-between font-display text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                                        <span className="tabular-nums">
                                            {pad(i + 1)} / {pad(total)}
                                        </span>
                                        <span className="tabular-nums">
                                            2025
                                        </span>
                                    </div>

                                    <div className="flex flex-1 flex-col justify-center py-6">
                                        <div className="max-w-2xl">
                                            {project.link ? (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="group block w-fit"
                                                >
                                                    <h2 className="font-display text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[0.98] font-semibold tracking-[-0.02em] uppercase underline-offset-[6px] group-hover:underline">
                                                        {project.title}
                                                    </h2>
                                                </a>
                                            ) : (
                                                <h2 className="font-display text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[0.98] font-semibold tracking-[-0.02em] uppercase">
                                                    {project.title}
                                                </h2>
                                            )}

                                            {project.description && (
                                                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                                                    {project.description}
                                                </p>
                                            )}

                                            {stack && (
                                                <p className="mt-6 font-display text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                                                    Stack:{' '}
                                                    <span className="text-foreground">
                                                        {stack}
                                                    </span>
                                                </p>
                                            )}

                                            {project.link && (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-7 inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 font-display text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:bg-foreground hover:text-background"
                                                >
                                                    Visit
                                                    <ArrowUpRight className="size-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Recede overlay as the next project covers this one */}
                                <div className="proj-dim pointer-events-none absolute inset-0 z-10 bg-black opacity-0" />
                            </div>
                        </section>
                    );
                })
            )}
        </div>
    );
}
