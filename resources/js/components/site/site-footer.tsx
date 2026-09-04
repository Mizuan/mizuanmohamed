import { SocialIconLinks } from '@/components/site/social-links';
import { useSiteSettings } from '@/hooks/use-site-settings';

export function SiteFooter() {
    const settings = useSiteSettings();

    return (
        <footer className="border-t border-border">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
                <p>
                    &copy; {new Date().getFullYear()} {settings.footer_text}
                </p>

                <SocialIconLinks className="flex items-center gap-5" />
            </div>
        </footer>
    );
}
