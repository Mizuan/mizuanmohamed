<?php

namespace App\Filament\Pages;

use App\Concerns\PasswordValidationRules;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Actions\ConfirmTwoFactorAuthentication;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use Laravel\Fortify\Actions\EnableTwoFactorAuthentication;
use Laravel\Fortify\Actions\GenerateNewRecoveryCodes;
use Laravel\Fortify\Features;
use UnitEnum;

class Security extends Page
{
    use PasswordValidationRules;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShieldCheck;

    protected static UnitEnum|string|null $navigationGroup = 'Account';

    protected static ?int $navigationSort = 2;

    protected string $view = 'filament.pages.security';

    /** @var array<string, mixed> */
    public array $data = [];

    public bool $showRecoveryCodes = false;

    public function mount(): void
    {
        $this->form->fill();
    }

    public function getTitle(): string|Htmlable
    {
        return 'Security';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                Section::make('Password')
                    ->description('Use a long, random password to keep your account secure.')
                    ->schema([
                        TextInput::make('current_password')
                            ->password()
                            ->revealable()
                            ->required()
                            ->currentPassword(),

                        TextInput::make('password')
                            ->label('New password')
                            ->password()
                            ->revealable()
                            ->required()
                            ->rule($this->passwordRules())
                            ->confirmed(),

                        TextInput::make('password_confirmation')
                            ->label('Confirm new password')
                            ->password()
                            ->revealable()
                            ->required(),
                    ]),
            ]);
    }

    public function updatePassword(): void
    {
        $data = $this->form->getState();

        Auth::user()->update(['password' => $data['password']]);

        $this->form->fill();

        Notification::make()->success()->title('Password updated.')->send();
    }

    /**
     * @return array<Action>
     */
    public function getFormActions(): array
    {
        return [
            Action::make('updatePassword')
                ->label('Update password')
                ->submit('updatePassword'),
        ];
    }

    public function twoFactorEnabled(): bool
    {
        return Auth::user()->hasEnabledTwoFactorAuthentication();
    }

    public function twoFactorPending(): bool
    {
        $user = Auth::user();

        return filled($user->two_factor_secret) && ! $user->two_factor_confirmed_at;
    }

    public function canManageTwoFactor(): bool
    {
        return Features::canManageTwoFactorAuthentication();
    }

    public function canManagePasskeys(): bool
    {
        return Features::enabled(Features::passkeys());
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getPasskeys(): array
    {
        return Auth::user()->passkeys()
            ->latest()
            ->get()
            ->map(fn ($passkey): array => [
                'id' => (string) $passkey->id,
                'name' => $passkey->name,
                'last_used_at' => $passkey->last_used_at?->diffForHumans(),
                'created_at' => $passkey->created_at?->toFormattedDayDateString(),
            ])
            ->all();
    }

    /** @return array<int, string> */
    public function getRecoveryCodes(): array
    {
        $codes = Auth::user()->two_factor_recovery_codes;

        return $codes ? json_decode(decrypt($codes), true) : [];
    }

    public function getQrCodeSvg(): ?string
    {
        $user = Auth::user();

        return filled($user->two_factor_secret) ? $user->twoFactorQrCodeSvg() : null;
    }

    public function enableTwoFactorAction(): Action
    {
        return Action::make('enableTwoFactor')
            ->label('Enable two-factor')
            ->action(function (EnableTwoFactorAuthentication $enable): void {
                $enable(Auth::user());

                Notification::make()
                    ->success()
                    ->title('Scan the QR code, then confirm with a code.')
                    ->send();
            });
    }

    public function confirmTwoFactorAction(): Action
    {
        return Action::make('confirmTwoFactor')
            ->label('Confirm')
            ->schema([
                TextInput::make('code')
                    ->label('Authentication code')
                    ->required()
                    ->autocomplete(false),
            ])
            ->action(function (array $data, ConfirmTwoFactorAuthentication $confirm): void {
                $confirm(Auth::user(), $data['code']);

                $this->showRecoveryCodes = true;

                Notification::make()->success()->title('Two-factor enabled.')->send();
            });
    }

    public function disableTwoFactorAction(): Action
    {
        return Action::make('disableTwoFactor')
            ->label('Disable two-factor')
            ->color('danger')
            ->requiresConfirmation()
            ->action(function (DisableTwoFactorAuthentication $disable): void {
                $disable(Auth::user());

                $this->showRecoveryCodes = false;

                Notification::make()->success()->title('Two-factor disabled.')->send();
            });
    }

    public function regenerateRecoveryCodesAction(): Action
    {
        return Action::make('regenerateRecoveryCodes')
            ->label('Regenerate recovery codes')
            ->color('gray')
            ->requiresConfirmation()
            ->action(function (GenerateNewRecoveryCodes $generate): void {
                $generate(Auth::user());

                $this->showRecoveryCodes = true;

                Notification::make()->success()->title('Recovery codes regenerated.')->send();
            });
    }

    public function showRecoveryCodesAction(): Action
    {
        return Action::make('showRecoveryCodes')
            ->label($this->showRecoveryCodes ? 'Hide recovery codes' : 'Show recovery codes')
            ->color('gray')
            ->action(fn () => $this->showRecoveryCodes = ! $this->showRecoveryCodes);
    }

    public function deletePasskeyAction(): Action
    {
        return Action::make('deletePasskey')
            ->label('Remove')
            ->color('danger')
            ->link()
            ->requiresConfirmation()
            ->action(function (array $arguments): void {
                Auth::user()->passkeys()->whereKey($arguments['passkey'])->delete();

                Notification::make()->success()->title('Passkey removed.')->send();
            });
    }
}
