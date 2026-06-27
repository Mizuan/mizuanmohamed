import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LocalClock } from '@/components/site/local-clock';
import { SeoHead } from '@/components/site/seo-head';
import { SiteNav } from '@/components/site/site-nav';
import { LinkedinIcon } from '@/components/site/social-icons';
import { SplitHeadline } from '@/components/site/split-headline';

type Section = {
    label: string;
    title: string;
    body: string;
    tags: string[];
};

// Used when the about page has no sections configured in the admin yet.
const DEFAULT_SECTIONS: Section[] = [
    {
        label: 'Intro',
        title: 'About',
        body: "I'm Mizuan, a full-stack developer based in Malé, Maldives. For over seven years I've built fast, considered web applications end to end, from the data model to the last micro-interaction.\n\nI care about the whole arc of a product, and about software that feels quick, considered, and quietly reliable.",
        tags: [],
    },
    {
        label: 'Experience',
        title: 'Experience',
        body: 'I currently lead a small development team at a government SOE, shipping products with Laravel, React, and TypeScript.\n\nMy work spans the full lifecycle: data modelling and architecture, backend APIs, polished frontends, and the infrastructure that holds it all together.',
        tags: [],
    },
    {
        label: 'Approach',
        title: 'Approach',
        body: 'Good software feels obvious in hindsight. I sweat the details, the motion, the empty states, the edge cases, because those are the things people actually feel.\n\nI like building from the raw structure outward: a solid core, then a considered layer of craft on top.',
        tags: [],
    },
    {
        label: 'Toolkit',
        title: 'Toolkit',
        body: '',
        tags: [
            'Laravel',
            'PHP',
            'React',
            'TypeScript',
            'Inertia.js',
            'Tailwind CSS',
            'PostgreSQL',
            'MySQL',
            'Redis',
            'Node.js',
            'AWS',
            'Git',
        ],
    },
];

export default function About({
    metaDescription,
    sections: configured,
}: {
    metaDescription?: string | null;
    sections?: Section[] | null;
}) {
    const sections =
        configured && configured.length > 0 ? configured : DEFAULT_SECTIONS;
    const total = sections.length;
    const [active, setActive] = useState(0);

    const go = (dir: number) =>
        setActive((current) => (current + dir + total) % total);

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
    }, []);

    const section = sections[active];

    return (
        <div className="dark flex h-svh flex-col overflow-hidden bg-background text-foreground antialiased">
            <SeoHead
                title="About"
                description={metaDescription ?? undefined}
            />

            <SiteNav />

            <main className="relative grid flex-1 overflow-hidden lg:grid-cols-5">
                {/* Portrait panel */}
                <div className="relative hidden overflow-hidden border-r bg-muted lg:col-span-2 lg:block">
                    <img
                        src="/mizuan-image.png"
                        alt="Mizuan Mohamed"
                        className="size-full object-cover grayscale contrast-110"
                    />
                    <div
                        aria-hidden
                        className="absolute inset-0 bg-linear-to-t from-background/40 via-transparent to-background/10"
                    />
                    <span className="absolute bottom-6 left-6 font-display text-[11px] font-medium tracking-[0.18em] text-foreground/80 uppercase mix-blend-difference">
                        Mizuan Mohamed — Malé, MV
                    </span>
                </div>

                {/* Content */}
                <div className="relative isolate flex flex-col px-6 pt-24 pb-28 lg:col-span-3 lg:px-14 lg:pt-28">
                    {/* Mobile full-bleed portrait — dark, immersive overlay */}
                    <div
                        aria-hidden
                        className="absolute inset-0 -z-10 lg:hidden"
                    >
                        <img
                            src="/mizuan-image.png"
                            alt=""
                            className="size-full object-cover grayscale"
                        />
                        <div className="absolute inset-0 bg-background/55" />
                        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
                    </div>

                    <div className="flex items-center justify-between font-display text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                        <span className="tabular-nums">
                            0{active + 1} / 0{total}
                        </span>
                        <span>{section.label}</span>
                    </div>

                    <div
                        key={active}
                        className="mt-auto animate-in fade-in slide-in-from-bottom-3 duration-500"
                    >
                        <SplitHeadline
                            key={active}
                            text={section.title}
                            className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-semibold tracking-[-0.03em] uppercase"
                        />

                        {section.body && (
                            <div className="mt-6 max-w-md space-y-4 text-base leading-relaxed text-muted-foreground">
                                {section.body
                                    .split(/\n\n+/)
                                    .filter(Boolean)
                                    .map((paragraph, i) => (
                                        <p key={i}>{paragraph}</p>
                                    ))}
                            </div>
                        )}

                        {section.tags.length > 0 && (
                            <div className="mt-6 flex max-w-lg flex-wrap gap-2">
                                {section.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border px-3 py-1.5 font-display text-xs font-medium tracking-wide"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Section pager + quick contact */}
            <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center gap-2 px-4">
                <div className="pointer-events-auto flex items-center gap-3 rounded-full border bg-background/80 px-3 py-2 backdrop-blur">
                    <button
                        type="button"
                        onClick={() => go(-1)}
                        aria-label="Previous section"
                        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                    </button>
                    <span className="min-w-24 text-center font-display text-xs font-medium tracking-[0.14em] text-foreground uppercase sm:min-w-28">
                        {section.label}
                    </span>
                    <button
                        type="button"
                        onClick={() => go(1)}
                        aria-label="Next section"
                        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowRight className="size-4" />
                    </button>
                </div>

                <a
                    href="mailto:mizuan.mohamed@gmail.com"
                    aria-label="Email"
                    className="pointer-events-auto rounded-full border bg-background/80 p-3 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
                >
                    <Mail className="size-4" />
                </a>
                <a
                    href="https://www.linkedin.com/in/mizuanmohamed/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="pointer-events-auto rounded-full border bg-background/80 p-3 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
                >
                    <LinkedinIcon className="size-4" />
                </a>
            </div>

            {/* Live clock, bottom-right for chrome continuity */}
            <LocalClock className="pointer-events-none fixed right-6 bottom-8 z-40 hidden font-display text-[11px] font-medium tracking-[0.14em] text-muted-foreground tabular-nums uppercase lg:block" />
        </div>
    );
}
