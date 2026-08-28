<?php

use App\Filament\Pages\Security;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PragmaRX\Google2FA\Google2FA;

use function Pest\Livewire\livewire;

beforeEach(function (): void {
    $this->user = User::factory()->admin()->create();
    $this->actingAs($this->user);
});

it('renders', function (): void {
    livewire(Security::class)->assertOk();
});

it('updates the password', function (): void {
    livewire(Security::class)
        ->fillForm([
            'current_password' => 'password',
            'password' => 'new-password-9271',
            'password_confirmation' => 'new-password-9271',
        ])
        ->call('updatePassword')
        ->assertHasNoFormErrors();

    expect(Hash::check('new-password-9271', $this->user->refresh()->password))->toBeTrue();
});

it('rejects a wrong current password', function (): void {
    livewire(Security::class)
        ->fillForm([
            'current_password' => 'not-the-password',
            'password' => 'new-password-9271',
            'password_confirmation' => 'new-password-9271',
        ])
        ->call('updatePassword')
        ->assertHasFormErrors(['current_password']);

    expect(Hash::check('password', $this->user->refresh()->password))->toBeTrue();
});

it('rejects a mismatched confirmation', function (): void {
    livewire(Security::class)
        ->fillForm([
            'current_password' => 'password',
            'password' => 'new-password-9271',
            'password_confirmation' => 'something-else',
        ])
        ->call('updatePassword')
        ->assertHasFormErrors(['password']);
});

it('enables, confirms and disables two-factor', function (): void {
    $page = livewire(Security::class)->callAction('enableTwoFactor');

    $this->user->refresh();
    expect($this->user->two_factor_secret)->not->toBeNull();
    expect($this->user->two_factor_confirmed_at)->toBeNull();

    $code = app(Google2FA::class)
        ->getCurrentOtp(decrypt($this->user->two_factor_secret));

    $page->callAction('confirmTwoFactor', data: ['code' => $code])
        ->assertHasNoActionErrors();

    expect($this->user->refresh()->two_factor_confirmed_at)->not->toBeNull();

    $page->callAction('disableTwoFactor');

    expect($this->user->refresh()->two_factor_secret)->toBeNull();
});

it('deletes a passkey', function (): void {
    $passkey = $this->user->passkeys()->create([
        'name' => 'Test key',
        'credential_id' => 'abc',
        'credential' => ['foo' => 'bar'],
    ]);

    livewire(Security::class)
        ->callAction('deletePasskey', arguments: ['passkey' => (string) $passkey->id]);

    expect($this->user->passkeys()->count())->toBe(0);
});
