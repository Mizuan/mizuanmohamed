<?php

use App\Models\Tag;
use App\Models\User;

beforeEach(function (): void {
    $this->admin = User::factory()->admin()->create();
});

it('creates a tag and auto-slugs from name', function (): void {
    $this->actingAs($this->admin)
        ->post(route('admin.tags.store'), ['name' => 'Laravel'])
        ->assertRedirect(route('admin.tags.index'));

    $this->assertDatabaseHas('tags', ['name' => 'Laravel', 'slug' => 'laravel']);
});

it('validates required name on store', function (): void {
    $this->actingAs($this->admin)
        ->post(route('admin.tags.store'), [])
        ->assertSessionHasErrors('name');
});

it('updates a tag', function (): void {
    $tag = Tag::factory()->create();

    $this->actingAs($this->admin)
        ->put(route('admin.tags.update', $tag), [
            'name' => 'Updated',
            'slug' => $tag->slug,
        ])
        ->assertRedirect(route('admin.tags.index'));

    expect($tag->refresh()->name)->toBe('Updated');
});

it('deletes a tag', function (): void {
    $tag = Tag::factory()->create();

    $this->actingAs($this->admin)
        ->delete(route('admin.tags.destroy', $tag))
        ->assertRedirect(route('admin.tags.index'));

    $this->assertDatabaseMissing('tags', ['id' => $tag->id]);
});
