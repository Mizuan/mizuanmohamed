<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Contracts\Support\Htmlable;
use UnitEnum;

class SiteSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAdjustmentsHorizontal;

    protected static UnitEnum|string|null $navigationGroup = 'Site';

    protected static ?int $navigationSort = 1;

    protected static ?string $title = 'Site settings';

    protected string $view = 'filament.pages.site-settings';

    /** @var array<string, mixed> */
    public array $data = [];

    public function mount(): void
    {
        $this->form->fill(SiteSetting::current()->attributesToArray());
    }

    public function getTitle(): string|Htmlable
    {
        return 'Site settings';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                Section::make('Masthead')
                    ->description('The banner at the top of every public page.')
                    ->schema([
                        TextInput::make('brand_name')
                            ->label('Name')
                            ->required()
                            ->maxLength(255)
                            ->helperText('The large wordmark, and the title in search results.'),

                        TextInput::make('tagline')
                            ->maxLength(255)
                            ->helperText('The small line above the name.'),
                    ]),

                Section::make('Search engines')
                    ->schema([
                        Textarea::make('meta_description')
                            ->label('Description')
                            ->required()
                            ->rows(2)
                            ->maxLength(255)
                            ->helperText('Used when a page has no description of its own.'),
                    ]),

                Section::make('Contact')
                    ->description('The closing block on the home page.')
                    ->schema([
                        Textarea::make('contact_text')
                            ->label('Message')
                            ->rows(2)
                            ->helperText('The email address is appended to this sentence.'),

                        TextInput::make('contact_email')
                            ->label('Email address')
                            ->email()
                            ->maxLength(255),
                    ]),

                Section::make('Footer')
                    ->schema([
                        TextInput::make('footer_text')
                            ->label('Footer line')
                            ->required()
                            ->maxLength(255)
                            ->helperText('The current year and a © symbol are added automatically.'),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        $settings = SiteSetting::query()->first();

        $settings
            ? $settings->update($data)
            : SiteSetting::create($data);

        Notification::make()->success()->title('Site settings saved.')->send();
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
}
