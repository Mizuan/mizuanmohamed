import { usePage } from '@inertiajs/react';
import {
    AtSign,
    Github,
    Globe,
    Instagram,
    Linkedin,
    Mail,
    Rss,
    Youtube,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

export function XIcon({ className }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
            className={className}
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

export function BlueskyIcon({ className }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
            className={className}
        >
            <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
        </svg>
    );
}

export type SocialPlatform =
    | 'github'
    | 'linkedin'
    | 'x'
    | 'mastodon'
    | 'bluesky'
    | 'youtube'
    | 'instagram'
    | 'rss'
    | 'website'
    | 'email';

export type SocialLink = {
    platform: SocialPlatform;
    label: string;
    url: string;
};

const ICONS: Record<SocialPlatform, ComponentType<SVGProps<SVGSVGElement>>> = {
    github: Github,
    linkedin: Linkedin,
    x: XIcon,
    mastodon: AtSign,
    bluesky: BlueskyIcon,
    youtube: Youtube,
    instagram: Instagram,
    rss: Rss,
    website: Globe,
    email: Mail,
};

export function socialIcon(platform: SocialPlatform) {
    return ICONS[platform] ?? Globe;
}

/** Social links managed from the admin panel, in their saved order. */
export function useSocialLinks(): SocialLink[] {
    return usePage<{ site: { social: SocialLink[] } }>().props.site.social;
}

/** The icon-only row used in the footer and mobile menu. */
export function SocialIconLinks({ className }: { className?: string }) {
    const socials = useSocialLinks();

    return (
        <div className={className}>
            {socials.map(({ platform, label, url }) => {
                const Icon = socialIcon(platform);

                return (
                    <a
                        key={label}
                        href={url}
                        aria-label={label}
                        target={url.startsWith('http') ? '_blank' : undefined}
                        rel={url.startsWith('http') ? 'noreferrer' : undefined}
                        className="text-muted-foreground transition-colors hover:text-brand"
                    >
                        <Icon className="size-4.5" />
                    </a>
                );
            })}
        </div>
    );
}
