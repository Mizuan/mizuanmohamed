import { Link } from '@inertiajs/react';
import { useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { formatArticleDate } from '@/components/site/article-list';
import type { ArticleListItem } from '@/components/site/article-list';
import type { ProjectListItem } from '@/components/site/project-list';
import { SeoHead } from '@/components/site/seo-head';
import { useSocialLinks } from '@/components/site/social-links';
import { TideMenu } from '@/components/site/tide-menu';
import { useReveal } from '@/hooks/use-reveal';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { cn } from '@/lib/utils';
import {
    show as articleShow,
    index as articlesIndex,
} from '@/routes/site/articles';
import { show as pageShow } from '@/routes/site/pages';
import { index as projectsIndex } from '@/routes/site/projects';

type Props = {
    latestArticles: ArticleListItem[];
    featuredProjects: ProjectListItem[];
    stats: {
        articles: number;
        projects: number;
        latestArticleAt: string | null;
        firstProjectYear: number | null;
    };
};

const display = 'font-display font-bold tracking-[-0.055em]';
// Last in cn(): tailwind-merge drops line-height when a later class sets font-size.
const tight = 'leading-[0.86]';
const label = 'font-display text-sm leading-tight font-semibold';
const heading =
    'text-[clamp(3rem,15vw,4.8rem)] sm:text-[clamp(2.6rem,7.4vw,6.2rem)]';

export default function Home({
    latestArticles,
    featuredProjects,
    stats,
}: Props) {
    const settings = useSiteSettings();
    const socials = useSocialLinks().filter(
        (link) => link.platform !== 'email',
    );
    const email = settings.contact_email ?? '';
    const firstName = settings.brand_name.split(' ')[0].toLowerCase();

    const introRef = useReveal<HTMLHeadingElement>();
    const projectsRef = useReveal<HTMLHeadingElement>();
    const writingRef = useReveal<HTMLHeadingElement>();
    const contactRef = useReveal<HTMLHeadingElement>();

    return (
        <div className="relative isolate">
            <SeoHead title={settings.brand_name} />

            <TideMenu
                bands={[
                    {
                        label: 'Writing',
                        href: articlesIndex().url,
                        info: [
                            `${stats.articles} ${stats.articles === 1 ? 'piece' : 'pieces'}`,
                            stats.latestArticleAt
                                ? `Latest ${formatArticleDate(stats.latestArticleAt)}`
                                : 'More soon',
                        ],
                    },
                    {
                        label: 'Projects',
                        href: projectsIndex().url,
                        info: [
                            `${stats.projects} selected`,
                            stats.firstProjectYear
                                ? `${stats.firstProjectYear} to now`
                                : 'Built in Malé',
                        ],
                    },
                    {
                        label: 'About',
                        href: pageShow('about').url,
                        info: ['Malé, Maldives', '4.17°N 73.51°E'],
                    },
                    {
                        label: 'Contact',
                        href: pageShow('contact').url,
                        info: email.includes('@')
                            ? [email.split('@')[0], `@${email.split('@')[1]}`]
                            : ['Say hello', ''],
                        ink: true,
                    },
                ]}
            />

            <div className="relative z-10">
                <Hero brandName={settings.brand_name} />

                <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8 sm:py-36">
                    <div className="grid sm:grid-cols-[minmax(150px,49%)_1fr]">
                        <div className="hidden border-r border-foreground/25 sm:block" />
                        <div className="sm:pl-6">
                            <h2
                                ref={introRef}
                                className={cn(
                                    'reveal',
                                    display,
                                    heading,
                                    tight,
                                )}
                            >
                                Laravel,
                                <br />
                                React
                                <br />
                                <span className="text-brand">&amp;</span>{' '}
                                TypeScript.
                            </h2>
                            <p className="mt-7 max-w-[40ch] font-display text-[17px] leading-snug font-semibold">
                                I build web applications end to end, from the
                                database to the last interaction, and lead a
                                small development team at a government SOE in
                                Malé.
                            </p>
                        </div>
                    </div>
                </section>

                {featuredProjects.length > 0 && (
                    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 sm:pb-36">
                        <h2
                            ref={projectsRef}
                            className={cn('reveal', display, heading, tight)}
                        >
                            Selected
                            <span className="block pl-[22%]">
                                <span className="text-brand">&amp;</span> built.
                            </span>
                        </h2>
                        <p className="mt-7 max-w-[40ch] font-display text-[17px] leading-snug font-semibold">
                            Government sites, portals and a sports club, built
                            and shipped from Malé.
                        </p>

                        <ProjectTable projects={featuredProjects} />
                    </section>
                )}

                {latestArticles.length > 0 && (
                    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 sm:pb-36">
                        <div className="grid sm:grid-cols-[minmax(150px,22%)_1fr]">
                            <div className="hidden border-r border-foreground/25 sm:block" />
                            <div className="sm:pl-6">
                                <h2
                                    ref={writingRef}
                                    className={cn(
                                        'reveal',
                                        display,
                                        heading,
                                        tight,
                                    )}
                                >
                                    Notes
                                    <span className="block pl-[22%]">
                                        &amp; writing.
                                    </span>
                                </h2>

                                <div className="mt-12 border-t border-foreground">
                                    {latestArticles.map((article) => (
                                        <Link
                                            key={article.id}
                                            href={articleShow(article.slug)}
                                            className="group grid gap-0.5 border-b border-border py-3.5 font-display font-semibold sm:grid-cols-[130px_1fr] sm:gap-5"
                                        >
                                            <span className="text-sm text-muted-foreground tabular-nums">
                                                {article.published_at
                                                    ? formatArticleDate(
                                                          article.published_at,
                                                      )
                                                    : ''}
                                            </span>
                                            <span className="text-[clamp(1.05rem,1.4vw,1.2rem)] leading-tight tracking-[-0.02em] transition-colors group-hover:text-brand">
                                                {article.title}
                                            </span>
                                        </Link>
                                    ))}
                                </div>

                                <Link
                                    href={articlesIndex()}
                                    className="mt-6 inline-block text-sm text-muted-foreground transition-colors hover:text-brand"
                                >
                                    All writing →
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                <section className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="grid items-end gap-6 sm:grid-cols-[minmax(150px,30%)_1fr]">
                        <div>
                            <p className={label}>
                                Open to
                                <br />
                                selected projects
                            </p>
                            {email && (
                                <>
                                    <p
                                        className={cn(
                                            label,
                                            'mt-7 text-muted-foreground',
                                        )}
                                    >
                                        Email
                                    </p>
                                    <EmailLine email={email} />
                                </>
                            )}
                            {socials.length > 0 && (
                                <>
                                    <p
                                        className={cn(
                                            label,
                                            'mt-7 text-muted-foreground',
                                        )}
                                    >
                                        Elsewhere
                                    </p>
                                    <nav
                                        aria-label="Elsewhere"
                                        className="mt-1 flex flex-wrap gap-x-5 gap-y-1 font-display text-[17px] font-semibold"
                                    >
                                        {socials.map(({ label: name, url }) => (
                                            <a
                                                key={url}
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="transition-colors hover:text-brand"
                                            >
                                                {name}
                                            </a>
                                        ))}
                                    </nav>
                                </>
                            )}
                        </div>
                        <h2
                            ref={contactRef}
                            className={cn(
                                'reveal sm:text-right',
                                display,
                                heading,
                                tight,
                            )}
                        >
                            Say it
                            <br />
                            in one
                            <br />
                            line.
                        </h2>
                    </div>

                    <footer className="mt-28 flex flex-wrap items-end justify-between gap-4 pb-5 sm:mt-28 sm:flex-nowrap">
                        <p className={label}>
                            &apos;{String(new Date().getFullYear()).slice(2)} ©{' '}
                            {settings.brand_name}
                        </p>
                        <span
                            aria-hidden
                            className={cn(
                                display,
                                'order-first w-full text-[clamp(4rem,15vw,13rem)] sm:order-none sm:w-auto sm:text-[clamp(4rem,9vw,8.5rem)]',
                                tight,
                            )}
                        >
                            {firstName}
                        </span>
                        <p className={label}>
                            made w/ <span className="text-brand">♥</span> &amp;
                            Laravel
                        </p>
                    </footer>
                </section>
            </div>
        </div>
    );
}

function Hero({ brandName }: { brandName: string }) {
    return (
        <section
            aria-label="Introduction"
            className="relative mx-auto grid min-h-svh max-w-7xl grid-cols-[34%_1fr] grid-rows-[1fr_auto] px-4 pt-5 sm:grid-cols-[minmax(150px,22%)_1fr] sm:px-8 sm:pt-7"
        >
            <div className="flex flex-col justify-between border-r border-foreground/25 pr-3.5 pb-3 sm:pr-6">
                <div
                    aria-hidden
                    className="grid size-[34px] place-items-center bg-brand font-display text-lg font-bold text-white"
                >
                    {brandName.charAt(0)}
                </div>
                <p className={label}>
                    Boring tech,
                    <br />
                    built well.
                </p>
            </div>

            <div className="flex flex-col justify-between pl-3.5 sm:pl-6">
                <p className={cn(label, 'pr-20')}>
                    Based in Malé
                    <br />
                    Leading a team at a gov SOE
                </p>
                <h1
                    className={cn(
                        display,
                        'pb-1.5 text-[clamp(2.2rem,11vw,3.6rem)] font-semibold sm:text-[clamp(2.5rem,7vw,6.4rem)]',
                        tight,
                    )}
                >
                    {brandName.split(' ').map((part) => (
                        <span key={part} className="block">
                            {part}
                        </span>
                    ))}
                </h1>
            </div>

            <p
                className={cn(
                    display,
                    'col-span-full mt-4 pb-7 text-[clamp(2.8rem,15vw,4.6rem)] font-semibold sm:mt-5 sm:pl-[4%] sm:text-[clamp(2.5rem,7vw,6.4rem)]',
                    tight,
                )}
            >
                Full-stack
                <br />
                developer<span className="text-brand">.</span>
            </p>
        </section>
    );
}

function ProjectTable({ projects }: { projects: ProjectListItem[] }) {
    const [activeId, setActiveId] = useState<number | null>(null);

    return (
        <>
            <div
                aria-hidden
                className={cn(
                    'pointer-events-none fixed inset-0 z-20 bg-white/35 backdrop-blur-[6px] transition-opacity duration-300',
                    activeId ? 'opacity-100' : 'opacity-0',
                )}
            />

            <div className="mt-16 sm:mt-20">
                <div className="hidden grid-cols-[120px_1fr_220px_120px] gap-5 border-b border-foreground px-1.5 py-2.5 font-display text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase sm:grid">
                    <span>Year</span>
                    <span>Project</span>
                    <span>Stack</span>
                    <span className="text-right">Role</span>
                </div>

                {projects.map((project, index) => {
                    const active = activeId === project.id;
                    const stack = (
                        project.technologies?.length
                            ? project.technologies
                            : (project.tags ?? [])
                    ).join(' · ');
                    const showYear =
                        project.year &&
                        project.year !== projects[index - 1]?.year;
                    const className = cn(
                        'grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1 border-b border-border px-1.5 py-2.5 font-display font-semibold transition-colors sm:grid-cols-[120px_1fr_220px_120px] sm:gap-x-5 sm:gap-y-0',
                        active
                            ? 'relative z-30 bg-background'
                            : 'hover:bg-muted',
                    );

                    const events = {
                        onPointerEnter: (event: ReactPointerEvent) => {
                            if (event.pointerType === 'mouse') {
                                setActiveId(project.id);
                            }
                        },
                        onPointerLeave: () => setActiveId(null),
                    };

                    const cells = (
                        <>
                            <span className="hidden tabular-nums sm:block">
                                {showYear
                                    ? `'${String(project.year).slice(2)}`
                                    : ''}
                            </span>
                            <span className="col-start-1 row-start-1 text-[17px] tracking-[-0.01em] sm:col-start-auto sm:row-start-auto">
                                {project.title}
                            </span>
                            <span className="col-start-1 text-sm text-muted-foreground sm:col-start-auto">
                                {stack}
                            </span>
                            <span className="col-start-2 row-start-1 text-right text-sm text-muted-foreground tabular-nums sm:col-start-auto sm:row-start-auto">
                                {project.role ?? ''}
                            </span>

                            {project.description && (
                                <span
                                    className={cn(
                                        'col-span-full grid transition-[grid-template-rows] duration-300 ease-out sm:col-start-2 sm:col-end-4',
                                        active
                                            ? 'grid-rows-[1fr]'
                                            : 'grid-rows-[1fr] sm:grid-rows-[0fr]',
                                    )}
                                >
                                    <span className="overflow-hidden">
                                        <span className="block max-w-[60ch] pt-1 pb-1 text-sm leading-relaxed font-medium text-muted-foreground sm:pt-3">
                                            {project.description}
                                        </span>
                                    </span>
                                </span>
                            )}
                        </>
                    );

                    return project.link ? (
                        <a
                            key={project.id}
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className={className}
                            {...events}
                        >
                            {cells}
                        </a>
                    ) : (
                        <Link
                            key={project.id}
                            href={projectsIndex()}
                            className={className}
                            {...events}
                        >
                            {cells}
                        </Link>
                    );
                })}
            </div>
        </>
    );
}

function EmailLine({ email }: { email: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            window.location.href = `mailto:${email}`;
        }
    };

    return (
        <p className="mt-1 flex flex-wrap items-center gap-2 font-display text-[17px] font-semibold">
            <a
                href={`mailto:${email}`}
                className="break-all transition-colors hover:text-brand"
            >
                {email}
            </a>
            <button
                type="button"
                onClick={copy}
                className="cursor-pointer rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
            >
                {copied ? 'Copied' : 'Copy'}
            </button>
        </p>
    );
}
