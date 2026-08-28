<?php

namespace App\Filament\Resources\Articles\Schemas;

use App\Enums\ArticleStatus;
use App\Support\ImageOptimizer;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class ArticleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Section::make()
                    ->columnSpan(2)
                    ->schema([
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

                        Textarea::make('excerpt')
                            ->maxLength(500)
                            ->rows(3),

                        RichEditor::make('content')
                            ->required()
                            ->toolbarButtons([
                                'bold', 'italic', 'link', 'strike',
                                'h2', 'h3',
                                'bulletList', 'orderedList',
                                'blockquote', 'codeBlock',
                                'undo', 'redo',
                            ]),
                    ]),

                Section::make()
                    ->columnSpan(1)
                    ->schema([
                        Select::make('status')
                            ->options(ArticleStatus::class)
                            ->default(ArticleStatus::Draft)
                            ->required()
                            ->live(),

                        DateTimePicker::make('published_at')
                            ->label('Published at')
                            ->seconds(false)
                            ->helperText('Set automatically when publishing if left blank.'),

                        Select::make('category_id')
                            ->label('Category')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload(),

                        Select::make('tags')
                            ->relationship('tags', 'name')
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->createOptionForm([
                                TextInput::make('name')
                                    ->required()
                                    ->maxLength(255),
                            ]),

                        FileUpload::make('featured_image')
                            ->image()
                            ->maxSize(5120)
                            ->disk('public')
                            ->directory('articles')
                            ->saveUploadedFileUsing(
                                fn (TemporaryUploadedFile $file): string => app(ImageOptimizer::class)
                                    ->store($file, 'articles'),
                            )
                            ->deleteUploadedFileUsing(
                                fn (?string $file) => filled($file)
                                    ? Storage::disk('public')->delete($file)
                                    : null,
                            ),
                    ]),
            ]);
    }
}
