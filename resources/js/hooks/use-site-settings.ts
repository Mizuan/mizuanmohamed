import { usePage } from '@inertiajs/react';

export type SiteSettings = {
    brand_name: string;
    tagline: string | null;
    contact_text: string | null;
    contact_email: string | null;
    footer_text: string;
};

type SharedSite = {
    site: {
        url: string;
        description: string;
        settings: SiteSettings;
    };
};

/** Site-wide copy managed from the admin panel. */
export function useSiteSettings(): SiteSettings {
    return usePage<SharedSite>().props.site.settings;
}
