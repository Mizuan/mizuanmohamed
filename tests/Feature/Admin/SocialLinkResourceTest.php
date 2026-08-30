<?php

use App\Enums\SocialPlatform;
use App\Filament\Resources\SocialLinks\Pages\ManageSocialLinks;
use App\Models\SocialLink;
use App\Models\User;
use Filament\Actions\Testing\TestAction;

use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\get;
use function Pest\Livewire\livewire;

beforeEach(function (): void {
    SocialLink::flushCache();
    $this->actingAs(User::factory()->admin()->create());
});

it('lists social links', function (): void {
    $links = SocialLink::factory()->count(3)->create();

    livewire(ManageSocialLinks::class)
        ->assertOk()
        ->assertCanSeeTableRecords($links);
});

it('creates a social link', function (): void {
    livewire(ManageSocialLinks::class)
        ->callAction('create', data: [
            'platform' => SocialPlatform::GitHub->value,
            'label' => 'GitHub',
            'url' => 'https://github.com/example',
            'is_visible' => true,
        ])
        ->assertHasNoActionErrors();

    expect(SocialLink::visible())->toHaveCount(1);
});

it('requires a platform, label and url', function (): void {
    livewire(ManageSocialLinks::class)
        ->callAction('create', data: ['platform' => null, 'label' => null, 'url' => null])
        ->assertHasActionErrors(['platform', 'label', 'url']);
});

it('deletes a social link', function (): void {
    $link = SocialLink::factory()->create();

    livewire(ManageSocialLinks::class)
        ->callAction(TestAction::make('delete')->table($link));

    assertDatabaseMissing('social_links', ['id' => $link->id]);
});

it('reorders social links', function (): void {
    $first = SocialLink::factory()->create(['sort_order' => 1]);
    $second = SocialLink::factory()->create(['sort_order' => 2]);

    livewire(ManageSocialLinks::class)
        ->call('reorderTable', [$second->getKey(), $first->getKey()]);

    expect(SocialLink::visible()[0]['label'])->toBe($second->label);
});

it('hides links that are not visible', function (): void {
    SocialLink::factory()->create(['label' => 'Shown']);
    SocialLink::factory()->create(['label' => 'Hidden', 'is_visible' => false]);

    expect(SocialLink::visible())->toHaveCount(1);
    expect(SocialLink::visible()[0]['label'])->toBe('Shown');
});

it('shares links with the public site and busts the cache on save', function (): void {
    SocialLink::factory()->create(['label' => 'GitHub']);

    auth()->logout();

    get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('site.social.0.label', 'GitHub'));

    SocialLink::query()->first()->update(['label' => 'Renamed']);

    get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('site.social.0.label', 'Renamed'));
});
