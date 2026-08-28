<?php

use App\Filament\Pages\Security;
use App\Models\User;

it('serves passkey login options to guests', function (): void {
    $this->getJson(route('passkey.login-options'))
        ->assertOk()
        ->assertJsonStructure(['options' => ['challenge']]);
});

it('requires authentication to fetch passkey registration options', function (): void {
    $this->get(route('passkey.registration-options'))
        ->assertRedirect(route('login'));
});

it('exposes passkey management on the security page', function (): void {
    $admin = User::factory()->admin()->create();
    $admin->passkeys()->create([
        'name' => 'Laptop',
        'credential_id' => 'cred-1',
        'credential' => ['foo' => 'bar'],
    ]);

    $this->actingAs($admin);

    $page = Pest\Livewire\livewire(Security::class)->assertOk();

    expect($page->instance()->canManagePasskeys())->toBeTrue();
    expect($page->instance()->getPasskeys())->toHaveCount(1);
    expect($page->instance()->getPasskeys()[0]['name'])->toBe('Laptop');
});
