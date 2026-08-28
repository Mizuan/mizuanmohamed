<?php

namespace App\Filament\Pages;

use App\Concerns\ProfileValidationRules;
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
use UnitEnum;

class Profile extends Page
{
    use ProfileValidationRules;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserCircle;

    protected static UnitEnum|string|null $navigationGroup = 'Account';

    protected static ?int $navigationSort = 1;

    protected string $view = 'filament.pages.profile';

    /** @var array<string, mixed> */
    public array $data = [];

    public function mount(): void
    {
        $this->form->fill(Auth::user()->only('name', 'email'));
    }

    public function getTitle(): string|Htmlable
    {
        return 'Profile';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                Section::make()
                    ->description('Update your name and email address.')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('email')
                            ->email()
                            ->required()
                            ->maxLength(255)
                            ->unique('users', 'email', ignorable: Auth::user()),
                    ]),
            ]);
    }

    public function save(): void
    {
        $user = Auth::user();
        $data = $this->form->getState();

        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        Notification::make()->success()->title('Profile updated.')->send();
    }

    /**
     * @return array<Action>
     */
    public function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save changes')
                ->submit('save'),
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('delete')
                ->label('Delete account')
                ->color('danger')
                ->outlined()
                ->requiresConfirmation()
                ->modalHeading('Delete account')
                ->modalDescription('This permanently deletes your account and all of its data.')
                ->schema([
                    TextInput::make('password')
                        ->password()
                        ->required()
                        ->currentPassword(),
                ])
                ->action(function (): void {
                    $user = Auth::user();

                    Auth::logout();
                    $user->delete();

                    session()->invalidate();
                    session()->regenerateToken();

                    $this->redirect('/');
                }),
        ];
    }
}
