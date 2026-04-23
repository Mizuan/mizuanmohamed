<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTagRequest;
use App\Http\Requests\Admin\UpdateTagRequest;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class TagController extends Controller
{
    public function index(): Response
    {
        $tags = Tag::query()
            ->withCount('articles')
            ->orderBy('name')
            ->paginate(30);

        return inertia('admin/tags/index', [
            'tags' => $tags,
        ]);
    }

    public function create(): Response
    {
        return inertia('admin/tags/create');
    }

    public function store(StoreTagRequest $request): RedirectResponse
    {
        Tag::create($request->validated());

        return to_route('admin.tags.index')
            ->with('success', 'Tag created.');
    }

    public function edit(Tag $tag): Response
    {
        return inertia('admin/tags/edit', [
            'tag' => $tag,
        ]);
    }

    public function update(UpdateTagRequest $request, Tag $tag): RedirectResponse
    {
        $tag->update($request->validated());

        return to_route('admin.tags.index')
            ->with('success', 'Tag updated.');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();

        return to_route('admin.tags.index')
            ->with('success', 'Tag deleted.');
    }
}
