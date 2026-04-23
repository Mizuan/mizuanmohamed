<?php

use App\Models\User;

it('blocks guests from the admin area', function (): void {
    $this->get('/admin/categories')->assertRedirect('/login');
    $this->get('/admin/articles')->assertRedirect('/login');
    $this->get('/admin/tags')->assertRedirect('/login');
    $this->get('/admin/pages')->assertRedirect('/login');
});

it('forbids non-admin users from the admin area', function (): void {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user)->get('/admin/categories')->assertForbidden();
    $this->actingAs($user)->get('/admin/articles')->assertForbidden();
    $this->actingAs($user)->get('/admin/tags')->assertForbidden();
    $this->actingAs($user)->get('/admin/pages')->assertForbidden();
});

it('allows admins into the admin area', function (): void {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get('/admin/categories')->assertOk();
    $this->actingAs($admin)->get('/admin/articles')->assertOk();
    $this->actingAs($admin)->get('/admin/tags')->assertOk();
    $this->actingAs($admin)->get('/admin/pages')->assertOk();
});
