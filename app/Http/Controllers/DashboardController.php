<?php

namespace App\Http\Controllers;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\Category;
use App\Models\Page;
use App\Models\Project;
use App\Models\Tag;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return inertia('dashboard', [
            'stats' => [
                'articles' => [
                    'total' => Article::count(),
                    'published' => Article::where('status', ArticleStatus::Published)->count(),
                    'drafts' => Article::where('status', ArticleStatus::Draft)->count(),
                ],
                'categories' => Category::count(),
                'tags' => Tag::count(),
                'pages' => [
                    'total' => Page::count(),
                    'published' => Page::where('is_published', true)->count(),
                ],
                'projects' => [
                    'total' => Project::count(),
                    'published' => Project::where('is_published', true)->count(),
                ],
            ],
            'recentArticles' => Article::query()
                ->with('category:id,name')
                ->latest()
                ->limit(5)
                ->get(['id', 'title', 'slug', 'status', 'published_at', 'category_id', 'updated_at']),
        ]);
    }
}
