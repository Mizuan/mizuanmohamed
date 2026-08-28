<?php

use App\Models\User;

it('sends inertia logins a hard redirect to the panel', function (): void {
    $user = User::factory()->admin()->create();

    // Without this, Inertia follows the redirect over XHR, receives the panel's
    // plain HTML, and renders it in its error overlay instead of navigating.
    $this->withHeader('X-Inertia', 'true')
        ->withHeader('X-Inertia-Version', '1')
        ->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ])
        ->assertStatus(409)
        ->assertHeader('X-Inertia-Location', 'https://mizuanmohamed.test/admin');
});

it('sends standard logins a normal redirect', function (): void {
    $user = User::factory()->admin()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect('/admin');
});
