<?php

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\Page;
use App\Models\Project;

use function Pest\Laravel\getJson;

it('returns nothing for a term that is too short', function (): void {
    Article::factory()->published()->create(['title' => 'Laravel notes']);

    getJson('/search?q=L')
        ->assertOk()
        ->assertExactJson(['groups' => []]);
});

it('finds published articles by title', function (): void {
    Article::factory()->published()->create(['title' => 'Boring tech wins']);

    getJson('/search?q=boring')
        ->assertOk()
        ->assertJsonPath('groups.0.label', 'Writing')
        ->assertJsonPath('groups.0.items.0.title', 'Boring tech wins');
});

it('finds published articles by excerpt', function (): void {
    Article::factory()->published()->create([
        'title' => 'Something else',
        'excerpt' => 'A note about queues and workers.',
    ]);

    getJson('/search?q=queues')
        ->assertOk()
        ->assertJsonPath('groups.0.items.0.title', 'Something else');
});

it('hides draft articles', function (): void {
    Article::factory()->create([
        'title' => 'Unfinished draft',
        'status' => ArticleStatus::Draft,
        'published_at' => null,
    ]);

    getJson('/search?q=unfinished')
        ->assertOk()
        ->assertExactJson(['groups' => []]);
});

it('finds published projects and hides unpublished ones', function (): void {
    Project::factory()->create(['title' => 'Tidal charts', 'is_published' => true]);
    Project::factory()->create(['title' => 'Tidal secret', 'is_published' => false]);

    $response = getJson('/search?q=tidal')->assertOk();

    expect($response->json('groups.0.label'))->toBe('Projects');
    expect($response->json('groups.0.items'))->toHaveCount(1);
    expect($response->json('groups.0.items.0.title'))->toBe('Tidal charts');
});

it('finds published pages', function (): void {
    Page::factory()->create(['title' => 'Colophon', 'is_published' => true]);

    getJson('/search?q=colophon')
        ->assertOk()
        ->assertJsonPath('groups.0.label', 'Pages');
});

it('groups results from several types together', function (): void {
    Article::factory()->published()->create(['title' => 'Signal article']);
    Project::factory()->create(['title' => 'Signal project', 'is_published' => true]);

    $labels = collect(getJson('/search?q=signal')->assertOk()->json('groups'))
        ->pluck('label')
        ->all();

    expect($labels)->toBe(['Writing', 'Projects']);
});

it('treats wildcards as literal characters', function (): void {
    Article::factory()->published()->create(['title' => 'Plain title']);

    getJson('/search?q=%25')
        ->assertOk()
        ->assertExactJson(['groups' => []]);
});
