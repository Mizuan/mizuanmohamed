<?php

namespace App\Filament\Widgets;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\Category;
use App\Models\Page;
use App\Models\Project;
use App\Models\Tag;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ContentOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $articles = Article::query()
            ->selectRaw('count(*) as total')
            ->selectRaw('sum(case when status = ? then 1 else 0 end) as published', [ArticleStatus::Published->value])
            ->first();

        $publishedArticles = (int) ($articles->published ?? 0);
        $totalArticles = (int) ($articles->total ?? 0);

        return [
            Stat::make('Articles', $totalArticles)
                ->description("{$publishedArticles} published · ".($totalArticles - $publishedArticles).' drafts')
                ->color('primary'),

            Stat::make('Pages', Page::count())
                ->description(Page::where('is_published', true)->count().' published'),

            Stat::make('Projects', Project::count())
                ->description(Project::where('is_published', true)->count().' published'),

            Stat::make('Taxonomy', Category::count().' · '.Tag::count())
                ->description('Categories · tags'),
        ];
    }
}
