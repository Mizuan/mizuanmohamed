import { PageHeader } from '@/components/site/page-header';
import { SectionLabel } from '@/components/site/section-label';
import { SeoHead } from '@/components/site/seo-head';

type Section = {
    label: string;
    title: string;
    body: string;
    tags?: string[] | null;
};

/** Used when the about page has no sections configured in the admin yet. */
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

function Paragraphs({ body }: { body: string }) {
    return (
        <div className="space-y-4 leading-relaxed text-muted-foreground">
            {body
                .split(/\n\n+/)
                .filter(Boolean)
                .map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
        </div>
    );
}

function Tags({ tags }: { tags: string[] }) {
    return (
        <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}

export default function About({
    metaDescription,
    sections: configured,
}: {
    metaDescription?: string | null;
    sections?: Section[] | null;
}) {
    const sections =
        configured && configured.length > 0 ? configured : DEFAULT_SECTIONS;
    const [intro, ...rest] = sections;

    return (
        <>
            <SeoHead title="About" description={metaDescription ?? undefined} />

            <div className="mx-auto max-w-2xl">
                <PageHeader title="About" />

                {intro && (
                    <section>
                        {intro.body && <Paragraphs body={intro.body} />}
                        {(intro.tags ?? []).length > 0 && (
                            <Tags tags={intro.tags ?? []} />
                        )}
                    </section>
                )}

                {rest.map((section, i) => (
                    <section
                        key={i}
                        className="mt-12 border-t border-border pt-8"
                    >
                        <SectionLabel>{section.label}</SectionLabel>
                        <h2 className="mt-3 mb-4 font-display text-xl font-semibold tracking-[-0.01em]">
                            {section.title}
                        </h2>

                        {section.body && <Paragraphs body={section.body} />}
                        {(section.tags ?? []).length > 0 && (
                            <Tags tags={section.tags ?? []} />
                        )}
                    </section>
                ))}
            </div>
        </>
    );
}
