import { Github, Linkedin, Mail } from 'lucide-react';
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

export type SocialLink = {
    label: string;
    href: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const SOCIAL_LINKS: SocialLink[] = [
    { label: 'GitHub', href: 'https://github.com/Mizuan', icon: Github },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/mizuanmohamed/',
        icon: Linkedin,
    },
    { label: 'X', href: 'https://x.com/mizuanmohamed', icon: XIcon },
    { label: 'Email', href: 'mailto:mizuan.mohamed@gmail.com', icon: Mail },
];
