<?php

use App\Filament\Resources\Tags\Pages\ManageTags;
use App\Models\Tag;
use App\Models\User;
use Filament\Actions\Testing\TestAction;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Livewire\livewire;

beforeEach(function (): void {
    $this->actingAs(User::factory()->admin()->create());
});

it('lists tags', function (): void {
    $tags = Tag::factory()->count(3)->create();

    livewire(ManageTags::class)
        ->assertOk()
        ->assertCanSeeTableRecords($tags);
});

it('creates a tag and auto-slugs from name', function (): void {
    livewire(ManageTags::class)
        ->callAction('create', data: ['name' => 'Laravel Tips'])
        ->assertHasNoActionErrors();

    assertDatabaseHas('tags', [
        'name' => 'Laravel Tips',
        'slug' => 'laravel-tips',
    ]);
});

it('requires a name', function (): void {
    livewire(ManageTags::class)
        ->callAction('create', data: ['name' => null])
        ->assertHasActionErrors(['name' => 'required']);
});

it('rejects duplicate slugs', function (): void {
    Tag::factory()->create(['slug' => 'taken']);

    livewire(ManageTags::class)
        ->callAction('create', data: ['name' => 'Other', 'slug' => 'taken'])
        ->assertHasActionErrors(['slug']);
});

it('updates a tag', function (): void {
    $tag = Tag::factory()->create();

    livewire(ManageTags::class)
        ->callAction(TestAction::make('edit')->table($tag), data: [
            'name' => 'Renamed',
            'slug' => $tag->slug,
        ])
        ->assertHasNoActionErrors();

    expect($tag->refresh()->name)->toBe('Renamed');
});

it('deletes a tag', function (): void {
    $tag = Tag::factory()->create();

    livewire(ManageTags::class)
        ->callAction(TestAction::make('delete')->table($tag));

    assertDatabaseMissing('tags', ['id' => $tag->id]);
});
