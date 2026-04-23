<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\FlashesToasts;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTagRequest;
use App\Http\Requests\Admin\UpdateTagRequest;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class TagController extends Controller
{
    use FlashesToasts;

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
        $this->toast('success', 'Tag created.');

        return to_route('admin.tags.index');
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
        $this->toast('success', 'Tag updated.');

        return to_route('admin.tags.index');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();
        $this->toast('success', 'Tag deleted.');

        return to_route('admin.tags.index');
    }
}
