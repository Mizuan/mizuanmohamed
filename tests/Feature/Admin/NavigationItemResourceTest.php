<?php

use App\Filament\Resources\NavigationItems\Pages\ManageNavigationItems;
use App\Models\NavigationItem;
use App\Models\User;
use Filament\Actions\Testing\TestAction;

use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\get;
use function Pest\Livewire\livewire;

beforeEach(function (): void {
    NavigationItem::flushCache();
    $this->actingAs(User::factory()->admin()->create());
});

it('lists navigation items', function (): void {
    $items = NavigationItem::factory()->count(3)->create();

    livewire(ManageNavigationItems::class)
        ->assertOk()
        ->assertCanSeeTableRecords($items);
});

it('creates a navigation item', function (): void {
    livewire(ManageNavigationItems::class)
        ->callAction('create', data: [
            'label' => 'Writing',
            'url' => '/articles',
            'is_visible' => true,
        ])
        ->assertHasNoActionErrors();

    expect(NavigationItem::visible())->toHaveCount(1);
    expect(NavigationItem::visible()[0]['label'])->toBe('Writing');
});

it('requires a label and url', function (): void {
    livewire(ManageNavigationItems::class)
        ->callAction('create', data: ['label' => null, 'url' => null])
        ->assertHasActionErrors(['label', 'url']);
});

it('deletes a navigation item', function (): void {
    $item = NavigationItem::factory()->create();

    livewire(ManageNavigationItems::class)
        ->callAction(TestAction::make('delete')->table($item));

    assertDatabaseMissing('navigation_items', ['id' => $item->id]);
});

it('reorders navigation items', function (): void {
    $first = NavigationItem::factory()->create(['sort_order' => 1]);
    $second = NavigationItem::factory()->create(['sort_order' => 2]);

    livewire(ManageNavigationItems::class)
        ->call('reorderTable', [$second->getKey(), $first->getKey()]);

    expect(NavigationItem::visible()[0]['label'])->toBe($second->label);
});

it('hides items that are not visible', function (): void {
    NavigationItem::factory()->create(['label' => 'Shown']);
    NavigationItem::factory()->create(['label' => 'Hidden', 'is_visible' => false]);

    expect(NavigationItem::visible())->toHaveCount(1);
    expect(NavigationItem::visible()[0]['label'])->toBe('Shown');
});

it('marks an item as a call to action', function (): void {
    NavigationItem::factory()->create(['label' => 'Contact', 'is_cta' => true]);

    expect(NavigationItem::visible()[0]['is_cta'])->toBeTrue();
});

it('shares navigation with the public site and busts the cache on save', function (): void {
    $item = NavigationItem::factory()->create(['label' => 'Writing']);

    auth()->logout();

    get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('site.nav.0.label', 'Writing'));

    $item->update(['label' => 'Notes']);

    get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('site.nav.0.label', 'Notes'));
});
