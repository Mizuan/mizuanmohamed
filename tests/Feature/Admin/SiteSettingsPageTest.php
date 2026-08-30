<?php

use App\Filament\Pages\SiteSettings;
use App\Models\SiteSetting;
use App\Models\User;

use function Pest\Laravel\get;
use function Pest\Livewire\livewire;

beforeEach(function (): void {
    SiteSetting::flushCache();
    $this->actingAs(User::factory()->admin()->create());
});

it('pre-fills the form with defaults when nothing is saved', function (): void {
    livewire(SiteSettings::class)
        ->assertOk()
        ->assertSchemaStateSet([
            'brand_name' => SiteSetting::defaults()['brand_name'],
        ]);
});

it('saves settings and creates the singleton row', function (): void {
    livewire(SiteSettings::class)
        ->fillForm([
            ...SiteSetting::defaults(),
            'hero_heading' => 'A New Heading',
            'footer_text' => 'Somewhere else',
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    expect(SiteSetting::query()->count())->toBe(1);
    expect(SiteSetting::current()->hero_heading)->toBe('A New Heading');
});

it('updates the existing row rather than creating another', function (): void {
    SiteSetting::create(SiteSetting::defaults());

    livewire(SiteSettings::class)
        ->fillForm([...SiteSetting::defaults(), 'hero_heading' => 'Changed'])
        ->call('save')
        ->assertHasNoFormErrors();

    expect(SiteSetting::query()->count())->toBe(1);
    expect(SiteSetting::current()->hero_heading)->toBe('Changed');
});

it('requires a heading', function (): void {
    livewire(SiteSettings::class)
        ->fillForm(['hero_heading' => null])
        ->call('save')
        ->assertHasFormErrors(['hero_heading' => 'required']);
});

it('survives a cache store that serializes', function (): void {
    // The suite's array store never serializes; dev and production do.
    config()->set('cache.default', 'database');
    SiteSetting::flushCache();

    SiteSetting::create([...SiteSetting::defaults(), 'hero_heading' => 'Serialized']);

    // Warm the cache, then read it back through a fresh unserialize.
    SiteSetting::current();

    expect(SiteSetting::current())->toBeInstanceOf(SiteSetting::class);
    expect(SiteSetting::current()->hero_heading)->toBe('Serialized');

    SiteSetting::flushCache();
});

it('busts the cache so the public site shows new copy', function (): void {
    // Warm the cache with the defaults first.
    expect(SiteSetting::current()->hero_heading)
        ->toBe(SiteSetting::defaults()['hero_heading']);

    livewire(SiteSettings::class)
        ->fillForm([...SiteSetting::defaults(), 'hero_heading' => 'Fresh Copy'])
        ->call('save');

    expect(SiteSetting::current()->hero_heading)->toBe('Fresh Copy');

    auth()->logout();

    get('/')
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page->where('site.settings.hero_heading', 'Fresh Copy'),
        );
});
