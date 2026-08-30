import { SOCIAL_LINKS } from '@/components/site/social-links';
import { useSiteSettings } from '@/hooks/use-site-settings';

export function SiteFooter() {
    const settings = useSiteSettings();

    return (
        <footer className="border-t border-border">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
                <p>
                    &copy; {new Date().getFullYear()} {settings.footer_text}
                </p>
                <div className="flex items-center gap-5">
                    {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                        <a
                            key={label}
                            href={href}
                            aria-label={label}
                            target={
                                href.startsWith('http') ? '_blank' : undefined
                            }
                            rel={
                                href.startsWith('http')
                                    ? 'noreferrer'
                                    : undefined
                            }
                            className="transition-colors hover:text-brand"
                        >
                            <Icon className="size-4.5" />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
