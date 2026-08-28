<?php

namespace App\Filament\Resources\Pages;

use App\Filament\Resources\Pages\Pages\CreatePage;
use App\Filament\Resources\Pages\Pages\EditPage;
use App\Filament\Resources\Pages\Pages\ListPages;
use App\Models\Page;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use UnitEnum;

class PageResource extends Resource
{
    protected static ?string $model = Page::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static UnitEnum|string|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 5;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (?string $state, callable $get, callable $set): void {
                        if (blank($get('slug'))) {
                            $set('slug', Str::slug((string) $state));
                        }
                    }),

                TextInput::make('slug')
                    ->maxLength(255)
                    ->rule('alpha_dash')
                    ->unique(ignoreRecord: true)
                    ->helperText('Leave blank to generate from the title.'),

                Textarea::make('meta_description')
                    ->maxLength(255)
                    ->rows(2)
                    ->columnSpanFull(),

                RichEditor::make('content')
                    ->columnSpanFull()
                    ->toolbarButtons([
                        'bold', 'italic', 'link', 'strike',
                        'h2', 'h3',
                        'bulletList', 'orderedList',
                        'blockquote', 'codeBlock',
                        'undo', 'redo',
                    ]),

                // The about page renders these instead of `content`.
                Repeater::make('sections')
                    ->columnSpanFull()
                    ->collapsible()
                    ->defaultItems(0)
                    ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                    ->schema([
                        TextInput::make('label')
                            ->maxLength(100),

                        TextInput::make('title')
                            ->required()
                            ->maxLength(200),

                        Textarea::make('body')
                            ->maxLength(5000)
                            ->rows(5)
                            ->columnSpanFull(),

                        TagsInput::make('tags')
                            ->nestedRecursiveRules(['string', 'max:50'])
                            ->columnSpanFull(),
                    ]),

                Toggle::make('is_published')
                    ->label('Published')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('title')
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('slug')
                    ->color('gray')
                    ->searchable(),

                IconColumn::make('is_published')
                    ->label('Published')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_published')
                    ->label('Published'),
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
            'index' => ListPages::route('/'),
            'create' => CreatePage::route('/create'),
            'edit' => EditPage::route('/{record}/edit'),
        ];
    }
}
