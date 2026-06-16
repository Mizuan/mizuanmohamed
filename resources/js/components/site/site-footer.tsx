import { Mail } from 'lucide-react';
import {
    GithubIcon,
    LinkedinIcon,
    XIcon,
} from '@/components/site/social-icons';

export const socials = [
    { label: 'GitHub', href: 'https://github.com/Mizuan', Icon: GithubIcon },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/mizuanmohamed/',
        Icon: LinkedinIcon,
    },
    { label: 'X', href: 'https://x.com/mizuanmohamed', Icon: XIcon },
    { label: 'Email', href: 'mailto:mizuan.mohamed@gmail.com', Icon: Mail },
];

export function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
                <p>&copy; {new Date().getFullYear()} Mizuan Mohamed.</p>
                <div className="flex items-center gap-5">
                    {socials.map(({ label, href, Icon }) => (
                        <a
                            key={label}
                            href={href}
                            target={href.startsWith('http') ? '_blank' : undefined}
                            rel={
                                href.startsWith('http') ? 'noreferrer' : undefined
                            }
                            aria-label={label}
                            className="transition-colors hover:text-foreground"
                        >
                            <Icon className="size-5" />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
