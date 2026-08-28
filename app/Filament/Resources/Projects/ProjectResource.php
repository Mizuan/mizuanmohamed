<?php

namespace App\Filament\Resources\Projects;

use App\Filament\Resources\Projects\Pages\ManageProjects;
use App\Models\Project;
use App\Support\ImageOptimizer;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use UnitEnum;

class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedFolder;

    protected static UnitEnum|string|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 2;

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

                Textarea::make('description')
                    ->required()
                    ->rows(3)
                    ->columnSpanFull(),

                TagsInput::make('tags')
                    ->nestedRecursiveRules(['string', 'max:50']),

                TagsInput::make('technologies')
                    ->nestedRecursiveRules(['string', 'max:50']),

                TextInput::make('link')
                    ->url()
                    ->maxLength(255)
                    ->columnSpanFull(),

                FileUpload::make('image')
                    ->image()
                    ->maxSize(5120)
                    ->disk('public')
                    ->directory('projects')
                    ->saveUploadedFileUsing(
                        fn (TemporaryUploadedFile $file): string => app(ImageOptimizer::class)
                            ->store($file, 'projects'),
                    )
                    ->deleteUploadedFileUsing(
                        fn (?string $file) => filled($file)
                            ? Storage::disk('public')->delete($file)
                            : null,
                    )
                    ->columnSpanFull(),

                Toggle::make('is_published')
                    ->label('Published')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                ImageColumn::make('image')
                    ->disk('public')
                    ->label(''),

                TextColumn::make('title')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('technologies')
                    ->badge()
                    ->limitList(3),

                IconColumn::make('is_published')
                    ->label('Published')
                    ->boolean()
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
            'index' => ManageProjects::route('/'),
        ];
    }
}
