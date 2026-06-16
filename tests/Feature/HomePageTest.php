<?php

use App\Models\Article;
use App\Models\Project;

use function Pest\Laravel\get;

it('renders the home page with latest articles and featured projects', function () {
    $article = Article::factory()->published()->create();
    Article::factory()->draft()->create();
    $project = Project::factory()->create(['is_published' => true]);
    Project::factory()->unpublished()->create();

    get('/')
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('site/home')
                ->has('latestArticles', 1)
                ->where('latestArticles.0.title', $article->title)
                ->has('featuredProjects', 1)
                ->where('featuredProjects.0.title', $project->title)
        );
});

it('limits latest articles to three and featured projects to four', function () {
    Article::factory()->published()->count(5)->create();
    Project::factory()->count(6)->create(['is_published' => true]);

    get('/')
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->has('latestArticles', 3)
                ->has('featuredProjects', 4)
        );
});
