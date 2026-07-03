<?php

use App\Models\User;

it('sends baseline hardening headers on public responses', function (): void {
    $this->get('/')
        ->assertOk()
        ->assertHeader('X-Frame-Options', 'DENY')
        ->assertHeader('X-Content-Type-Options', 'nosniff')
        ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
});

it('does not allow is_admin to be mass assigned', function (): void {
    $user = User::factory()->create();

    $user->fill(['is_admin' => true])->save();

    expect($user->fresh()->is_admin)->toBeFalse();
});

it('still lets the seeder create an admin explicitly', function (): void {
    config(['app.admin_password' => 'seed-password-123!']);

    $this->seed(Database\Seeders\AdminSeeder::class);

    $admin = User::where('email', 'admin@mizuan.dev')->first();
    expect($admin)->not->toBeNull();
    expect($admin->is_admin)->toBeTrue();
});
