<?php

use App\Filament\Resources\Categories\Pages\ManageCategories;
use App\Models\Category;
use App\Models\User;
use Filament\Actions\Testing\TestAction;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Livewire\livewire;

beforeEach(function (): void {
    $this->actingAs(User::factory()->admin()->create());
});

it('lists categories', function (): void {
    $categories = Category::factory()->count(3)->create();

    livewire(ManageCategories::class)
        ->assertOk()
        ->assertCanSeeTableRecords($categories);
});

it('creates a category and auto-slugs from name', function (): void {
    livewire(ManageCategories::class)
        ->callAction('create', data: [
            'name' => 'Engineering Notes',
            'description' => 'Things I learn while building.',
        ])
        ->assertHasNoActionErrors();

    assertDatabaseHas('categories', [
        'name' => 'Engineering Notes',
        'slug' => 'engineering-notes',
    ]);
});

it('requires a name', function (): void {
    livewire(ManageCategories::class)
        ->callAction('create', data: ['name' => null])
        ->assertHasActionErrors(['name' => 'required']);
});

it('rejects duplicate slugs', function (): void {
    Category::factory()->create(['slug' => 'taken']);

    livewire(ManageCategories::class)
        ->callAction('create', data: [
            'name' => 'Other',
            'slug' => 'taken',
        ])
        ->assertHasActionErrors(['slug']);
});

it('updates a category', function (): void {
    $category = Category::factory()->create();

    livewire(ManageCategories::class)
        ->callAction(TestAction::make('edit')->table($category), data: [
            'name' => 'Renamed',
            'slug' => $category->slug,
            'description' => 'updated',
        ])
        ->assertHasNoActionErrors();

    expect($category->refresh()->name)->toBe('Renamed');
});

it('deletes a category', function (): void {
    $category = Category::factory()->create();

    livewire(ManageCategories::class)
        ->callAction(TestAction::make('delete')->table($category));

    assertDatabaseMissing('categories', ['id' => $category->id]);
});
