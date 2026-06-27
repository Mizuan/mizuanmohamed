<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Inertia\Response;

class PageController extends Controller
{
    public function show(Page $page): Response
    {
        abort_unless($page->is_published, 404);

        if ($page->slug === 'about') {
            return inertia('site/about', [
                'metaDescription' => $page->meta_description,
            ]);
        }

        return inertia('site/pages/show', [
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'content' => $page->content,
                'meta_description' => $page->meta_description,
                'updated_at' => $page->updated_at,
            ],
        ]);
    }
}
