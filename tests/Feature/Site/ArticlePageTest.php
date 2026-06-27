<?php

use App\Models\Article;

use function Pest\Laravel\get;

it('exposes reading time on the articles index', function () {
    Article::factory()->published()->create([
        'content' => str_repeat('word ', 400),
    ]);

    get('/articles')
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('site/articles/index')
                ->where('articles.data.0.reading_time', 2)
        );
});

it('exposes reading time on an article page', function () {
    $article = Article::factory()->published()->create([
        'content' => str_repeat('word ', 200),
    ]);

    get("/articles/{$article->slug}")
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('site/articles/show')
                ->where('article.reading_time', 1)
        );
});
