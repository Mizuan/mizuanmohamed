<?php

use App\Enums\ArticleStatus;
use App\Filament\Resources\Articles\Pages\CreateArticle;
use App\Filament\Resources\Articles\Pages\EditArticle;
use App\Filament\Resources\Articles\Pages\ListArticles;
use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Filament\Actions\Testing\TestAction;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Livewire\livewire;

beforeEach(function (): void {
    $this->admin = User::factory()->admin()->create();
    $this->actingAs($this->admin);
});

it('lists articles', function (): void {
    $articles = Article::factory()->count(3)->create();

    livewire(ListArticles::class)
        ->assertOk()
        ->assertCanSeeTableRecords($articles);
});

it('creates an article with category, tags, and image', function (): void {
    Storage::fake('public');

    $category = Category::factory()->create();
    $tags = Tag::factory()->count(2)->create();

    livewire(CreateArticle::class)
        ->fillForm([
            'title' => 'Engineering Notes',
            'content' => '<p>Hello world.</p>',
            'excerpt' => 'A short excerpt.',
            'category_id' => $category->id,
            'tags' => $tags->pluck('id')->toArray(),
            'featured_image' => UploadedFile::fake()->image('cover.jpg'),
            'status' => ArticleStatus::Draft,
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $article = Article::query()->where('slug', 'engineering-notes')->firstOrFail();

    expect($article->user_id)->toBe($this->admin->id);
    expect($article->category_id)->toBe($category->id);
    expect($article->tags)->toHaveCount(2);
    expect($article->featured_image)->toStartWith('articles/');
    Storage::disk('public')->assertExists($article->featured_image);
});

it('requires a title and content', function (): void {
    livewire(CreateArticle::class)
        ->fillForm(['title' => null, 'content' => null])
        ->call('create')
        ->assertHasFormErrors(['title' => 'required', 'content']);
});

it('rejects a duplicate slug', function (): void {
    Article::factory()->create(['slug' => 'taken']);

    livewire(CreateArticle::class)
        ->fillForm([
            'title' => 'Other',
            'slug' => 'taken',
            'content' => '<p>x</p>',
            'status' => ArticleStatus::Draft,
        ])
        ->call('create')
        ->assertHasFormErrors(['slug']);
});

it('stamps published_at when publishing without a date', function (): void {
    livewire(CreateArticle::class)
        ->fillForm([
            'title' => 'Published Now',
            'content' => '<p>x</p>',
            'status' => ArticleStatus::Published,
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $article = Article::query()->where('slug', 'published-now')->firstOrFail();

    expect($article->published_at)->not->toBeNull();
});

it('keeps an existing published_at when editing', function (): void {
    $original = now()->subMonth()->startOfMinute();
    $article = Article::factory()->create([
        'status' => ArticleStatus::Published,
        'published_at' => $original,
    ]);

    livewire(EditArticle::class, ['record' => $article->getRouteKey()])
        ->fillForm(['title' => 'Renamed'])
        ->call('save')
        ->assertHasNoFormErrors();

    $article->refresh();

    expect($article->title)->toBe('Renamed');
    expect($article->published_at->equalTo($original))->toBeTrue();
});

it('preserves code block languages through an edit', function (): void {
    $content = '<p>Intro.</p><pre><code class="language-php">echo 1;</code></pre>';
    $article = Article::factory()->create(['content' => $content]);

    livewire(EditArticle::class, ['record' => $article->getRouteKey()])
        ->fillForm(['title' => 'Still Highlighted'])
        ->call('save')
        ->assertHasNoFormErrors();

    expect($article->refresh()->content)->toContain('class="language-php"');
});

it('deletes an article and its image', function (): void {
    Storage::fake('public');
    $path = UploadedFile::fake()->image('x.jpg')->store('articles', 'public');
    $article = Article::factory()->create(['featured_image' => $path]);

    livewire(ListArticles::class)
        ->callAction(TestAction::make('delete')->table($article));

    assertDatabaseMissing('articles', ['id' => $article->id]);
    Storage::disk('public')->assertMissing($path);
});
