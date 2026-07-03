import { Head, usePage } from '@inertiajs/react';

type SeoHeadProps = {
    title: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article';
    publishedAt?: string | null;
    canonical?: string;
    /** Optional schema.org structured data, rendered as JSON-LD. */
    jsonLd?: Record<string, unknown>;
};

type SiteShared = {
    name: string;
    site: {
        url: string;
        description: string;
    };
};

export function SeoHead({
    title,
    description,
    image,
    type = 'website',
    publishedAt,
    canonical,
    jsonLd,
}: SeoHeadProps) {
    const page = usePage<SiteShared>();
    const siteName = page.props.name;
    const siteUrl = page.props.site.url.replace(/\/$/, '');
    const desc = description ?? page.props.site.description;
    const url = canonical ?? `${siteUrl}${page.url}`;
    const og = image
        ? image.startsWith('http')
            ? image
            : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`
        : `${siteUrl}/favicon-512x512.png`;

    return (
        <Head title={title}>
            <meta name="description" content={desc} />
            <link rel="canonical" href={url} />

            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={desc} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={og} />
            {publishedAt && (
                <meta
                    property="article:published_time"
                    content={publishedAt}
                />
            )}

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={og} />

            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Head>
    );
}
