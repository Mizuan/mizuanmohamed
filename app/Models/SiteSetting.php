<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Single-row settings for the public site. Read through `current()`, which is
 * cached because it is resolved on every Inertia request.
 */
#[Fillable([
    'brand_name',
    'meta_description',
    'hero_eyebrow',
    'hero_heading',
    'hero_intro',
    'hero_primary_label',
    'hero_primary_url',
    'hero_secondary_label',
    'hero_secondary_url',
    'contact_text',
    'contact_email',
    'footer_text',
])]
class SiteSetting extends Model
{
    public const CACHE_KEY = 'site-settings';

    /**
     * Values used when nothing has been saved yet, so a fresh database still
     * renders the site.
     *
     * @return array<string, string>
     */
    public static function defaults(): array
    {
        return [
            'brand_name' => 'Mizuan Mohamed',
            'meta_description' => 'Software developer based in Malé, Maldives. Notes, articles, and projects.',
            'hero_eyebrow' => 'Full-stack developer — Malé, Maldives',
            'hero_heading' => 'Mizuan Mohamed',
            'hero_intro' => 'I build web applications end to end with Laravel, React, and TypeScript, and lead a small development team at a government SOE. This is where I keep my writing and the things I\'ve built.',
            'hero_primary_label' => 'Read the writing',
            'hero_primary_url' => '/articles',
            'hero_secondary_label' => 'See the projects',
            'hero_secondary_url' => '/projects',
            'contact_text' => 'Have a project in mind, or just want to say hello? Reach me at',
            'contact_email' => 'mizuan.mohamed@gmail.com',
            'footer_text' => 'Mizuan Mohamed — Malé, Maldives',
        ];
    }

    /** Caches attributes, not the model: serializing stores mangle Eloquent instances. */
    public static function current(): self
    {
        $attributes = Cache::rememberForever(
            self::CACHE_KEY,
            fn (): array => static::query()->first()?->attributesToArray()
                ?? static::defaults(),
        );

        return (new static)->forceFill($attributes);
    }

    public static function flushCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    protected static function booted(): void
    {
        static::saved(fn () => static::flushCache());
        static::deleted(fn () => static::flushCache());
    }
}
