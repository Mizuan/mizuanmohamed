<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        return inertia('site/projects/index', [
            'projects' => Project::query()
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->orderBy('title')
                ->get(['id', 'title', 'slug', 'description', 'tags', 'technologies', 'image', 'link']),
        ]);
    }
}
