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
            'tagline' => 'A New Tagline',
            'footer_text' => 'Somewhere else',
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    expect(SiteSetting::query()->count())->toBe(1);
    expect(SiteSetting::current()->tagline)->toBe('A New Tagline');
});

it('updates the existing row rather than creating another', function (): void {
    SiteSetting::create(SiteSetting::defaults());

    livewire(SiteSettings::class)
        ->fillForm([...SiteSetting::defaults(), 'tagline' => 'Changed'])
        ->call('save')
        ->assertHasNoFormErrors();

    expect(SiteSetting::query()->count())->toBe(1);
    expect(SiteSetting::current()->tagline)->toBe('Changed');
});

it('requires a brand name', function (): void {
    livewire(SiteSettings::class)
        ->fillForm(['brand_name' => null])
        ->call('save')
        ->assertHasFormErrors(['brand_name' => 'required']);
});

it('survives a cache store that serializes', function (): void {
    // The suite's array store never serializes; dev and production do.
    config()->set('cache.default', 'database');
    SiteSetting::flushCache();

    SiteSetting::create([...SiteSetting::defaults(), 'tagline' => 'Serialized']);

    // Warm the cache, then read it back through a fresh unserialize.
    SiteSetting::current();

    expect(SiteSetting::current())->toBeInstanceOf(SiteSetting::class);
    expect(SiteSetting::current()->tagline)->toBe('Serialized');

    SiteSetting::flushCache();
});

it('busts the cache so the public site shows new copy', function (): void {
    // Warm the cache with the defaults first.
    expect(SiteSetting::current()->tagline)
        ->toBe(SiteSetting::defaults()['tagline']);

    livewire(SiteSettings::class)
        ->fillForm([...SiteSetting::defaults(), 'tagline' => 'Fresh Copy'])
        ->call('save');

    expect(SiteSetting::current()->tagline)->toBe('Fresh Copy');

    auth()->logout();

    get('/')
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page->where('site.settings.tagline', 'Fresh Copy'),
        );
});
