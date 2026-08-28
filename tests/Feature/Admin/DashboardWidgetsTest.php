<?php

use App\Enums\ArticleStatus;
use App\Filament\Widgets\ContentOverview;
use App\Filament\Widgets\LatestArticles;
use App\Models\Article;
use App\Models\User;

use function Pest\Livewire\livewire;

beforeEach(function (): void {
    $this->actingAs(User::factory()->admin()->create());
});

it('counts published articles separately from drafts', function (): void {
    Article::factory()->count(2)->create(['status' => ArticleStatus::Published]);
    Article::factory()->create(['status' => ArticleStatus::Draft]);

    livewire(ContentOverview::class)
        ->assertOk()
        ->assertSee('2 published · 1 drafts');
});

it('lists the five most recently updated articles', function (): void {
    $articles = Article::factory()->count(6)->create();
    $newest = $articles->first();
    $newest->touch();

    livewire(LatestArticles::class)
        ->assertOk()
        ->assertCanSeeTableRecords(Article::latest('updated_at')->limit(5)->get());
});
