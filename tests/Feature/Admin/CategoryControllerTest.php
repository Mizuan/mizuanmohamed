<?php

use App\Models\Category;
use App\Models\User;

beforeEach(function (): void {
    $this->admin = User::factory()->admin()->create();
});

it('creates a category and auto-slugs from name', function (): void {
    $this->actingAs($this->admin)
        ->post(route('admin.categories.store'), [
            'name' => 'Engineering Notes',
            'description' => 'Things I learn while building.',
        ])
        ->assertRedirect(route('admin.categories.index'));

    $this->assertDatabaseHas('categories', [
        'name' => 'Engineering Notes',
        'slug' => 'engineering-notes',
    ]);
});

it('validates required name on store', function (): void {
    $this->actingAs($this->admin)
        ->post(route('admin.categories.store'), [])
        ->assertSessionHasErrors('name');
});

it('rejects duplicate slugs', function (): void {
    Category::factory()->create(['slug' => 'taken']);

    $this->actingAs($this->admin)
        ->post(route('admin.categories.store'), [
            'name' => 'Other',
            'slug' => 'taken',
        ])
        ->assertSessionHasErrors('slug');
});

it('updates a category', function (): void {
    $category = Category::factory()->create();

    $this->actingAs($this->admin)
        ->put(route('admin.categories.update', $category), [
            'name' => 'Renamed',
            'slug' => $category->slug,
            'description' => 'updated',
        ])
        ->assertRedirect(route('admin.categories.index'));

    expect($category->refresh()->name)->toBe('Renamed');
});

it('deletes a category', function (): void {
    $category = Category::factory()->create();

    $this->actingAs($this->admin)
        ->delete(route('admin.categories.destroy', $category))
        ->assertRedirect(route('admin.categories.index'));

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});
