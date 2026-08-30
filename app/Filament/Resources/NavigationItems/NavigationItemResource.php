<?php

namespace App\Filament\Resources\NavigationItems;

use App\Filament\Resources\NavigationItems\Pages\ManageNavigationItems;
use App\Models\NavigationItem;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class NavigationItemResource extends Resource
{
    protected static ?string $model = NavigationItem::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBars3;

    protected static UnitEnum|string|null $navigationGroup = 'Site';

    protected static ?int $navigationSort = 3;

    protected static ?string $recordTitleAttribute = 'label';

    protected static ?string $navigationLabel = 'Navigation';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('label')
                    ->required()
                    ->maxLength(255),

                TextInput::make('url')
                    ->required()
                    ->maxLength(255)
                    ->helperText('A path such as /articles, or a full external URL.'),

                Toggle::make('is_cta')
                    ->label('Highlight as a button')
                    ->helperText('Shown as a filled pill at the end of the navigation.'),

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
                TextColumn::make('label')
                    ->searchable(),

                TextColumn::make('url')
                    ->color('gray'),

                IconColumn::make('is_cta')
                    ->label('Button')
                    ->boolean(),

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
            'index' => ManageNavigationItems::route('/'),
        ];
    }
}
