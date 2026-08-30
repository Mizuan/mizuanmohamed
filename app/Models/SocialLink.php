<?php

namespace App\Models;

use App\Enums\SocialPlatform;
use Database\Factories\SocialLinkFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

#[Fillable(['platform', 'label', 'url', 'sort_order', 'is_visible'])]
class SocialLink extends Model
{
    /** @use HasFactory<SocialLinkFactory> */
    use HasFactory;

    public const CACHE_KEY = 'site-social-links';

    protected function casts(): array
    {
        return [
            'platform' => SocialPlatform::class,
            'is_visible' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return array<int, array{platform: string, label: string, url: string}>
     */
    public static function visible(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, fn (): array => static::query()
            ->where('is_visible', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (self $link): array => [
                'platform' => $link->platform->value,
                'label' => $link->label,
                'url' => $link->url,
            ])
            ->all());
    }

    public static function flushCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /** @param Builder<self> $query */
    public function scopeVisible(Builder $query): void
    {
        $query->where('is_visible', true);
    }

    protected static function booted(): void
    {
        static::saved(fn () => static::flushCache());
        static::deleted(fn () => static::flushCache());
    }
}
