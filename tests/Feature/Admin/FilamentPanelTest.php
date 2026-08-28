<?php

use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

it('redirects guests from the panel to the fortify login', function () {
    get('/admin')->assertRedirect(route('login'));
});

it('forbids non-admin users from the panel', function () {
    actingAs(User::factory()->create())
        ->get('/admin')
        ->assertForbidden();
});

it('serves the panel dashboard to admins', function () {
    actingAs(User::factory()->admin()->create())
        ->get('/admin')
        ->assertOk();
});
