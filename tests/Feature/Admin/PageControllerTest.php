<?php

use App\Models\Page;
use App\Models\User;

beforeEach(function (): void {
    $this->admin = User::factory()->admin()->create();
});

it('creates a page with auto-slug', function (): void {
    $this->actingAs($this->admin)
        ->post(route('admin.pages.store'), [
            'title' => 'About Me',
            'content' => '<p>Hi</p>',
            'is_published' => true,
        ])
        ->assertRedirect(route('admin.pages.index'));

    $this->assertDatabaseHas('pages', ['title' => 'About Me', 'slug' => 'about-me']);
});

it('requires a title and is_published', function (): void {
    $this->actingAs($this->admin)
        ->post(route('admin.pages.store'), [])
        ->assertSessionHasErrors(['title', 'is_published']);
});

it('updates a page', function (): void {
    $page = Page::factory()->create();

    $this->actingAs($this->admin)
        ->put(route('admin.pages.update', $page), [
            'title' => 'Renamed Page',
            'slug' => $page->slug,
            'content' => '<p>x</p>',
            'is_published' => false,
        ])
        ->assertRedirect(route('admin.pages.index'));

    $page->refresh();
    expect($page->title)->toBe('Renamed Page');
    expect($page->is_published)->toBeFalse();
});

it('persists about sections on update', function (): void {
    $page = Page::factory()->create(['slug' => 'about']);

    $this->actingAs($this->admin)
        ->put(route('admin.pages.update', $page), [
            'title' => 'About',
            'slug' => 'about',
            'content' => '<p>x</p>',
            'is_published' => true,
            'sections' => [
                [
                    'label' => 'Intro',
                    'title' => 'About',
                    'body' => "First.\n\nSecond.",
                    'tags' => ['Laravel', 'React'],
                ],
            ],
        ])
        ->assertRedirect(route('admin.pages.index'));

    $page->refresh();
    expect($page->sections)->toHaveCount(1);
    expect($page->sections[0]['title'])->toBe('About');
    expect($page->sections[0]['tags'])->toBe(['Laravel', 'React']);
});

it('requires a title for each about section', function (): void {
    $page = Page::factory()->create(['slug' => 'about']);

    $this->actingAs($this->admin)
        ->put(route('admin.pages.update', $page), [
            'title' => 'About',
            'slug' => 'about',
            'is_published' => true,
            'sections' => [['label' => 'Intro', 'body' => 'x', 'tags' => []]],
        ])
        ->assertSessionHasErrors('sections.0.title');
});

it('deletes a page', function (): void {
    $page = Page::factory()->create();

    $this->actingAs($this->admin)
        ->delete(route('admin.pages.destroy', $page))
        ->assertRedirect(route('admin.pages.index'));

    $this->assertDatabaseMissing('pages', ['id' => $page->id]);
});
