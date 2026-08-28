<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Articles\ArticleResource;
use App\Models\Article;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LatestArticles extends TableWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Recent articles')
            ->description('The five most recently updated articles.')
            ->query(fn (): Builder => Article::query()->with('category')->latest('updated_at'))
            ->paginated(false)
            ->queryStringIdentifier('latestArticles')
            ->defaultPaginationPageOption(5)
            ->modifyQueryUsing(fn (Builder $query): Builder => $query->limit(5))
            ->columns([
                TextColumn::make('title')
                    ->limit(60),

                TextColumn::make('category.name')
                    ->label('Category')
                    ->badge()
                    ->color('gray')
                    ->placeholder('—'),

                TextColumn::make('status')
                    ->badge(),

                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->since(),
            ])
            ->recordActions([
                Action::make('edit')
                    ->url(fn (Article $record): string => ArticleResource::getUrl('edit', ['record' => $record]))
                    ->icon('heroicon-m-pencil-square')
                    ->iconButton(),
            ])
            ->emptyStateHeading('No articles yet')
            ->emptyStateDescription('Write your first one to see it here.');
    }
}
