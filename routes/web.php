<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RobotsController;
use App\Http\Controllers\Site\ArticleController as SiteArticleController;
use App\Http\Controllers\Site\HomeController;
use App\Http\Controllers\Site\PageController as SitePageController;
use App\Http\Controllers\Site\ProjectController as SiteProjectController;
use App\Http\Controllers\SitemapController;
use App\Http\Middleware\PreventIndexing;
use Illuminate\Support\Facades\Route;

$adminDomain = config('fortify.domain');

// On the admin subdomain the root goes straight to the dashboard (guests get
// bounced to the login screen by the auth middleware). Registered before the
// public home route so the domain-constrained match wins on that host.
if ($adminDomain) {
    Route::domain($adminDomain)
        ->get('/', fn () => redirect()->route('dashboard'))
        ->name('admin.home');
}

// Public site
Route::get('/', HomeController::class)->name('home');

Route::name('site.')->group(function () {
    Route::get('articles', [SiteArticleController::class, 'index'])->name('articles.index');
    Route::get('articles/{article:slug}', [SiteArticleController::class, 'show'])->name('articles.show');
    Route::get('projects', [SiteProjectController::class, 'index'])->name('projects.index');
});

Route::get('sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('robots.txt', RobotsController::class)->name('robots');

// Admin — when ADMIN_DOMAIN is configured, the dashboard, admin panel, and
// settings are only reachable on that subdomain (Fortify scopes the auth
// routes to it too, via the same config value). With no domain configured
// (tests, fresh local setups) everything stays on the main host.
Route::group(
    array_filter([
        'domain' => $adminDomain ?: null,
        'middleware' => [PreventIndexing::class],
    ]),
    function () {
        Route::middleware(['auth', 'verified', 'admin'])->group(function () {
            Route::get('dashboard', DashboardController::class)->name('dashboard');
        });

        require __DIR__.'/settings.php';
    });

// Catch-all for dynamic pages (about, contact, etc.) — must be last so explicit
// routes win. Slug constraint excludes paths containing dots so /sitemap.xml
// and similar reserved files aren't swallowed.
Route::get('/{page:slug}', [SitePageController::class, 'show'])
    ->where('page', '[a-z0-9-]+')
    ->name('site.pages.show');
