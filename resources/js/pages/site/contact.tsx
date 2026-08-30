import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/site/page-header';
import { SectionLabel } from '@/components/site/section-label';
import { SeoHead } from '@/components/site/seo-head';
import { socialIcon, useSocialLinks } from '@/components/site/social-links';
import { useSiteSettings } from '@/hooks/use-site-settings';

export default function Contact({
    metaDescription,
}: {
    metaDescription?: string | null;
}) {
    const settings = useSiteSettings();
    const socials = useSocialLinks();
    const email = settings.contact_email ?? '';
    const [copied, setCopied] = useState(false);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            window.location.href = `mailto:${email}`;
        }
    };

    return (
        <>
            <SeoHead
                title="Contact"
                description={metaDescription ?? undefined}
            />

            <div className="mx-auto max-w-2xl">
                <PageHeader
                    title="Contact"
                    description="Available for work. The fastest way to reach me is email — I read everything and reply to most."
                />

                <section>
                    <SectionLabel>Email</SectionLabel>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <a
                            href={`mailto:${email}`}
                            className="font-display text-lg font-medium break-all transition-colors hover:text-brand sm:text-xl"
                        >
                            {email}
                        </a>
                        <button
                            type="button"
                            onClick={copyEmail}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
                        >
                            {copied ? (
                                <Check className="size-3.5" />
                            ) : (
                                <Copy className="size-3" />
                            )}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </section>

                <section className="mt-10 border-t border-border pt-8">
                    <SectionLabel>Elsewhere</SectionLabel>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {socials
                            .filter((link) => link.platform !== 'email')
                            .map(({ platform, label, url }) => {
                                const Icon = socialIcon(platform);

                                return (
                                    <a
                                        key={label}
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 transition-colors hover:border-brand/40"
                                    >
                                        <Icon className="size-4.5 text-muted-foreground transition-colors group-hover:text-brand" />
                                        <span className="text-sm font-medium transition-colors group-hover:text-brand">
                                            {label}
                                        </span>
                                    </a>
                                );
                            })}
                    </div>
                </section>
            </div>
        </>
    );
}
