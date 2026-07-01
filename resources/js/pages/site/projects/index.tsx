import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { ProjectList } from '@/components/site/project-list';
import type { ProjectListItem } from '@/components/site/project-list';
import { SeoHead } from '@/components/site/seo-head';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';

gsap.registerPlugin(ScrollTrigger);

type Props = {
    projects: ProjectListItem[];
};

export default function ProjectsIndex({ projects }: Props) {
    const root = useRef<HTMLDivElement | null>(null);
    const total = projects.length;

    useEffect(() => {
        const reduce = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        const ctx = gsap.context(() => {
            if (reduce) {
                gsap.set('[data-reveal]', { opacity: 1, y: 0 });

                return;
            }

            gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
                gsap.from(el, {
                    y: 40,
                    opacity: 0,
                    duration: 0.85,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' },
                });
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={root}
            className="dark min-h-svh bg-background text-foreground antialiased"
        >
            <SeoHead
                title="Work"
                description="A selection of things I've built — for clients, for friends, and for myself."
            />

            <SiteNav />

            <header className="mx-auto w-full max-w-6xl px-6 pt-40 pb-16 lg:px-8 lg:pt-48 lg:pb-24">
                <p
                    data-reveal
                    className="font-display text-xs font-medium tracking-[0.24em] text-brand uppercase"
                >
                    Selected Work
                </p>
                <h1
                    data-reveal
                    className="mt-5 font-display text-[clamp(3rem,13vw,10rem)] leading-[0.86] font-bold tracking-[-0.03em] uppercase"
                >
                    Work
                </h1>
                <p
                    data-reveal
                    className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground"
                >
                    Products, tools, and sites — built end to end with Laravel,
                    React, and TypeScript.
                </p>
            </header>

            <section className="mx-auto w-full max-w-6xl px-6 pb-32 lg:px-8 lg:pb-48">
                {total === 0 ? (
                    <p className="border-t border-border py-16 text-sm text-muted-foreground">
                        Nothing here yet.
                    </p>
                ) : (
                    <div data-reveal>
                        <ProjectList projects={projects} />
                        <div className="border-t border-border" />
                    </div>
                )}
            </section>

            <SiteFooter />
        </div>
    );
}
