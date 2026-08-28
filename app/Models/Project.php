<?php

namespace App\Models;

use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

#[Fillable([
    'title',
    'slug',
    'description',
    'tags',
    'technologies',
    'image',
    'link',
    'is_published',
    'sort_order',
])]
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'technologies' => 'array',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Project $project): void {
            if (empty($project->slug)) {
                $project->slug = Str::slug((string) $project->title);
            }
        });

        static::deleted(function (Project $project): void {
            if ($project->image) {
                Storage::disk('public')->delete($project->image);
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
