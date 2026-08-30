import { usePage } from '@inertiajs/react';

export type SiteSettings = {
    brand_name: string;
    hero_eyebrow: string | null;
    hero_heading: string;
    hero_intro: string;
    hero_primary_label: string | null;
    hero_primary_url: string | null;
    hero_secondary_label: string | null;
    hero_secondary_url: string | null;
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
