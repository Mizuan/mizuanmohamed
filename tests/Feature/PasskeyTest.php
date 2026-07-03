<?php

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

it('exposes passkey management on the security settings page', function (): void {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('security.edit'))
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('settings/security')
                ->where('canManagePasskeys', true)
                ->has('passkeys'),
        );
});
