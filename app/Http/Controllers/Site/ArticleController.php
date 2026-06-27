<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(): Response
    {
        return inertia('site/articles/index', [
            'articles' => Article::query()
                ->published()
                ->with(['category:id,name,slug', 'tags:id,name,slug'])
                ->latest('published_at')
                ->paginate(12)
                ->through(fn (Article $article) => [
                    'id' => $article->id,
                    'title' => $article->title,
                    'slug' => $article->slug,
                    'excerpt' => $article->excerpt,
                    'reading_time' => $article->reading_time,
                    'published_at' => $article->published_at,
                    'category' => $article->category,
                    'tags' => $article->tags,
                ]),
        ]);
    }

    public function show(Article $article): Response
    {
        abort_unless($article->status->value === 'published', 404);

        $article->load(['category:id,name,slug', 'tags:id,name,slug', 'author:id,name']);

        return inertia('site/articles/show', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerpt,
                'content' => $article->content,
                'reading_time' => $article->reading_time,
                'featured_image' => $article->featured_image,
                'published_at' => $article->published_at,
                'category' => $article->category,
                'tags' => $article->tags,
                'author' => $article->author,
            ],
        ]);
    }
}
