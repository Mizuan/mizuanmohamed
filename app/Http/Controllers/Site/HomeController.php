<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Article;
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
        ]);
    }
}
