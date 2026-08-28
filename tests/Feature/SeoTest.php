<?php

use App\Models\User;

it('serves robots.txt with a sitemap reference on the public host', function (): void {
    $this->get('/robots.txt')
        ->assertOk()
        ->assertHeader('Content-Type', 'text/plain; charset=UTF-8')
        ->assertSee('Sitemap:')
        ->assertDontSee('Disallow: /');
});

it('disallows all crawling on the admin host', function (): void {
    config(['fortify.domain' => 'admin.example.test']);

    $this->get('http://admin.example.test/robots.txt')
        ->assertOk()
        ->assertSee('Disallow: /')
        ->assertDontSee('Sitemap:');
});

it('serves the sitemap', function (): void {
    $this->get('/sitemap.xml')
        ->assertOk()
        ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
        ->assertSee('urlset');
});

it('sends a noindex header on the login page', function (): void {
    $this->get(route('login'))
        ->assertOk()
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow');
});

it('sends a noindex header on the admin surface', function (): void {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin')
        ->assertOk()
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow');
});

it('renders server-side SEO fallbacks for crawlers without JavaScript', function (): void {
    $this->get('/')
        ->assertOk()
        ->assertSee('og:site_name', false)
        ->assertSee('name="description"', false)
        ->assertSee('application/ld+json', false);
});
