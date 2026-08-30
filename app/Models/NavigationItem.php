<?php

namespace App\Models;

use Database\Factories\NavigationItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

#[Fillable(['label', 'url', 'sort_order', 'is_visible', 'is_cta'])]
class NavigationItem extends Model
{
    /** @use HasFactory<NavigationItemFactory> */
    use HasFactory;

    public const CACHE_KEY = 'site-navigation';

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'is_cta' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return array<int, array{label: string, url: string, is_cta: bool}>
     */
    public static function visible(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, fn (): array => static::query()
            ->where('is_visible', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (self $item): array => [
                'label' => $item->label,
                'url' => $item->url,
                'is_cta' => $item->is_cta,
            ])
            ->all());
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
