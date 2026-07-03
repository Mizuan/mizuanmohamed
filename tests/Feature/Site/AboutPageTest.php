<?php

use App\Models\Page;

use function Pest\Laravel\get;

it('renders the immersive about page for the about slug', function () {
    Page::factory()->create(['slug' => 'about', 'is_published' => true]);

    get('/about')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('site/about'));
});

it('passes about sections through even when saved without tags', function () {
    Page::factory()->create([
        'slug' => 'about',
        'is_published' => true,
        'sections' => [
            ['label' => 'Intro', 'title' => 'About', 'body' => 'Hello.'],
        ],
    ]);

    get('/about')
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('site/about')
                ->where('sections.0.title', 'About'),
        );
});

it('renders generic pages with the standard page component', function () {
    Page::factory()->create(['slug' => 'colophon', 'is_published' => true]);

    get('/colophon')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('site/pages/show'));
});
