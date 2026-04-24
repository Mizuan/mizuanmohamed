<?php

use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Site\ArticleController as SiteArticleController;
use App\Http\Controllers\Site\HomeController;
use App\Http\Controllers\Site\PageController as SitePageController;
use App\Http\Controllers\Site\ProjectController as SiteProjectController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

// Public site
Route::get('/', HomeController::class)->name('home');

Route::name('site.')->group(function () {
    Route::get('articles', [SiteArticleController::class, 'index'])->name('articles.index');
    Route::get('articles/{article:slug}', [SiteArticleController::class, 'show'])->name('articles.show');
    Route::get('projects', [SiteProjectController::class, 'index'])->name('projects.index');
});

Route::get('sitemap.xml', SitemapController::class)->name('sitemap');

// Admin
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('categories', CategoryController::class)->except('show');
        Route::resource('tags', TagController::class)->except('show');
        Route::resource('articles', ArticleController::class)->except('show');
        Route::resource('pages', PageController::class)->except('show');
        Route::resource('projects', ProjectController::class)->except('show');
    });

require __DIR__.'/settings.php';

// Catch-all for dynamic pages (about, contact, etc.) — must be last so explicit
// routes win. Slug constraint excludes paths containing dots so /sitemap.xml
// and similar reserved files aren't swallowed.
Route::get('/{page:slug}', [SitePageController::class, 'show'])
    ->where('page', '[a-z0-9-]+')
    ->name('site.pages.show');
