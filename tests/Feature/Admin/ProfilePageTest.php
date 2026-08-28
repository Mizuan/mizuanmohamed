<?php

use App\Filament\Pages\Profile;
use App\Models\User;
use Filament\Actions\Testing\TestAction;

use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Livewire\livewire;

beforeEach(function (): void {
    $this->user = User::factory()->admin()->create();
    $this->actingAs($this->user);
});

it('renders with the current profile pre-filled', function (): void {
    livewire(Profile::class)
        ->assertOk()
        ->assertSchemaStateSet([
            'name' => $this->user->name,
            'email' => $this->user->email,
        ]);
});

it('updates name and email', function (): void {
    livewire(Profile::class)
        ->fillForm(['name' => 'New Name', 'email' => 'new@example.com'])
        ->call('save')
        ->assertHasNoFormErrors();

    $this->user->refresh();

    expect($this->user->name)->toBe('New Name');
    expect($this->user->email)->toBe('new@example.com');
});

it('clears email verification when the email changes', function (): void {
    livewire(Profile::class)
        ->fillForm(['name' => $this->user->name, 'email' => 'changed@example.com'])
        ->call('save')
        ->assertHasNoFormErrors();

    expect($this->user->refresh()->email_verified_at)->toBeNull();
});

it('keeps email verification when the email is unchanged', function (): void {
    $verifiedAt = $this->user->email_verified_at;

    livewire(Profile::class)
        ->fillForm(['name' => 'Renamed Only', 'email' => $this->user->email])
        ->call('save')
        ->assertHasNoFormErrors();

    expect($this->user->refresh()->email_verified_at)->not->toBeNull()
        ->and($this->user->email_verified_at->equalTo($verifiedAt))->toBeTrue();
});

it('rejects an email already taken by another user', function (): void {
    $other = User::factory()->create();

    livewire(Profile::class)
        ->fillForm(['name' => 'X', 'email' => $other->email])
        ->call('save')
        ->assertHasFormErrors(['email']);
});

it('deletes the account when the password is correct', function (): void {
    livewire(Profile::class)
        ->callAction(TestAction::make('delete'), data: ['password' => 'password']);

    assertDatabaseMissing('users', ['id' => $this->user->id]);
});

it('keeps the account when the password is wrong', function (): void {
    livewire(Profile::class)
        ->callAction(TestAction::make('delete'), data: ['password' => 'not-the-password'])
        ->assertHasActionErrors(['password']);

    expect(User::find($this->user->id))->not->toBeNull();
});
