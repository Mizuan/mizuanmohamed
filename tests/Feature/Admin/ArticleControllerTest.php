<?php

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    $this->admin = User::factory()->admin()->create();
});

it('creates an article with tags, image, and auto-slug', function (): void {
    Storage::fake('public');
    $category = Category::factory()->create();
    $tags = Tag::factory()->count(2)->create();

    $response = $this->actingAs($this->admin)
        ->post(route('admin.articles.store'), [
            'title' => 'My First Post',
            'excerpt' => 'intro',
            'content' => '<p>body</p>',
            'category_id' => $category->id,
            'tag_ids' => $tags->pluck('id')->all(),
            'featured_image' => UploadedFile::fake()->image('cover.jpg'),
            'status' => ArticleStatus::Published->value,
        ]);

    $response->assertRedirect(route('admin.articles.index'));

    $article = Article::query()->where('slug', 'my-first-post')->firstOrFail();
    expect($article->user_id)->toBe($this->admin->id);
    expect($article->status)->toBe(ArticleStatus::Published);
    expect($article->published_at)->not->toBeNull();
    expect($article->tags)->toHaveCount(2);
    Storage::disk('public')->assertExists($article->featured_image);
});

it('defaults status to draft when missing and fails validation', function (): void {
    $this->actingAs($this->admin)
        ->post(route('admin.articles.store'), [
            'title' => 'No status',
            'content' => '<p>body</p>',
        ])
        ->assertSessionHasErrors('status');
});

it('requires title and content', function (): void {
    $this->actingAs($this->admin)
        ->post(route('admin.articles.store'), [
            'status' => ArticleStatus::Draft->value,
        ])
        ->assertSessionHasErrors(['title', 'content']);
});

it('updates an article and syncs tags', function (): void {
    $article = Article::factory()->create(['user_id' => $this->admin->id]);
    $newTags = Tag::factory()->count(3)->create();

    $this->actingAs($this->admin)
        ->put(route('admin.articles.update', $article), [
            'title' => 'Renamed',
            'slug' => $article->slug,
            'content' => '<p>new</p>',
            'status' => ArticleStatus::Draft->value,
            'tag_ids' => $newTags->pluck('id')->all(),
        ])
        ->assertRedirect(route('admin.articles.index'));

    expect($article->refresh()->title)->toBe('Renamed');
    expect($article->tags)->toHaveCount(3);
});

it('removes featured image when requested', function (): void {
    Storage::fake('public');
    $path = UploadedFile::fake()->image('x.jpg')->store('articles', 'public');
    $article = Article::factory()->create([
        'user_id' => $this->admin->id,
        'featured_image' => $path,
    ]);

    $this->actingAs($this->admin)
        ->put(route('admin.articles.update', $article), [
            'title' => $article->title,
            'slug' => $article->slug,
            'content' => $article->content,
            'status' => $article->status->value,
            'remove_featured_image' => true,
        ])
        ->assertRedirect(route('admin.articles.index'));

    expect($article->refresh()->featured_image)->toBeNull();
    Storage::disk('public')->assertMissing($path);
});

it('deletes an article and removes its featured image', function (): void {
    Storage::fake('public');
    $path = UploadedFile::fake()->image('x.jpg')->store('articles', 'public');
    $article = Article::factory()->create([
        'user_id' => $this->admin->id,
        'featured_image' => $path,
    ]);

    $this->actingAs($this->admin)
        ->delete(route('admin.articles.destroy', $article))
        ->assertRedirect(route('admin.articles.index'));

    $this->assertDatabaseMissing('articles', ['id' => $article->id]);
    Storage::disk('public')->assertMissing($path);
});

it('scopes published articles to those with past published_at', function (): void {
    Article::factory()->published()->create(['user_id' => $this->admin->id]);
    Article::factory()->draft()->create(['user_id' => $this->admin->id]);
    Article::factory()->create([
        'user_id' => $this->admin->id,
        'status' => ArticleStatus::Published,
        'published_at' => now()->addDay(),
    ]);

    expect(Article::published()->count())->toBe(1);
});
