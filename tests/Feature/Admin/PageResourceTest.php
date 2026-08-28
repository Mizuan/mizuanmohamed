<?php

use App\Filament\Resources\Pages\Pages\CreatePage;
use App\Filament\Resources\Pages\Pages\EditPage;
use App\Filament\Resources\Pages\Pages\ListPages;
use App\Models\Page;
use App\Models\User;
use Filament\Actions\Testing\TestAction;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Livewire\livewire;

beforeEach(function (): void {
    $this->actingAs(User::factory()->admin()->create());
});

it('lists pages', function (): void {
    $pages = Page::factory()->count(3)->create();

    livewire(ListPages::class)
        ->assertOk()
        ->assertCanSeeTableRecords($pages);
});

it('creates a page and auto-slugs from title', function (): void {
    livewire(CreatePage::class)
        ->fillForm([
            'title' => 'Colophon Notes',
            'content' => '<p>How this site is built.</p>',
            'is_published' => true,
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    assertDatabaseHas('pages', [
        'title' => 'Colophon Notes',
        'slug' => 'colophon-notes',
    ]);
});

it('requires a title', function (): void {
    livewire(CreatePage::class)
        ->fillForm(['title' => null])
        ->call('create')
        ->assertHasFormErrors(['title' => 'required']);
});

it('rejects a duplicate slug', function (): void {
    Page::factory()->create(['slug' => 'taken']);

    livewire(CreatePage::class)
        ->fillForm(['title' => 'Other', 'slug' => 'taken'])
        ->call('create')
        ->assertHasFormErrors(['slug']);
});

it('saves about page sections through the repeater', function (): void {
    $page = Page::factory()->create(['slug' => 'about', 'sections' => []]);

    livewire(EditPage::class, ['record' => $page->getRouteKey()])
        ->fillForm([
            'sections' => [
                [
                    'label' => 'Intro',
                    'title' => 'About',
                    'body' => 'Hello.',
                    'tags' => ['Laravel'],
                ],
            ],
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    $sections = $page->refresh()->sections;

    expect($sections)->toHaveCount(1);
    expect($sections[0]['title'])->toBe('About');
    expect($sections[0]['tags'])->toBe(['Laravel']);
});

it('deletes a page', function (): void {
    $page = Page::factory()->create();

    livewire(ListPages::class)
        ->callAction(TestAction::make('delete')->table($page));

    assertDatabaseMissing('pages', ['id' => $page->id]);
});
