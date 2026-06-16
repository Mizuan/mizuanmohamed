<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Project;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return inertia('site/home', [
            'latestArticles' => Article::query()
                ->published()
                ->latest('published_at')
                ->limit(3)
                ->get(['id', 'title', 'slug', 'excerpt', 'published_at']),
            'featuredProjects' => Project::query()
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->orderBy('title')
                ->limit(4)
                ->get(['id', 'title', 'slug', 'description', 'tags', 'technologies', 'image', 'link']),
        ]);
    }
}
