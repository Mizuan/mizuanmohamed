<?php

namespace App\Filament\Resources\SocialLinks;

use App\Enums\SocialPlatform;
use App\Filament\Resources\SocialLinks\Pages\ManageSocialLinks;
use App\Models\SocialLink;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class SocialLinkResource extends Resource
{
    protected static ?string $model = SocialLink::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedLink;

    protected static UnitEnum|string|null $navigationGroup = 'Site';

    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'label';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('platform')
                    ->options(SocialPlatform::class)
                    ->required()
                    ->live()
                    ->afterStateUpdated(function ($state, callable $get, callable $set): void {
                        if (blank($get('label')) && $state instanceof SocialPlatform) {
                            $set('label', $state->label());
                        }
                    })
                    ->helperText('Decides which icon is shown.'),

                TextInput::make('label')
                    ->required()
                    ->maxLength(255)
                    ->helperText('Used as the accessible name for the icon.'),

                TextInput::make('url')
                    ->required()
                    ->maxLength(255)
                    ->helperText('Include the scheme, e.g. https://… or mailto:you@example.com'),

                Toggle::make('is_visible')
                    ->label('Visible')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('platform')
                    ->badge(),

                TextColumn::make('label')
                    ->searchable(),

                TextColumn::make('url')
                    ->color('gray')
                    ->limit(40),

                IconColumn::make('is_visible')
                    ->label('Visible')
                    ->boolean(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageSocialLinks::route('/'),
        ];
    }
}
