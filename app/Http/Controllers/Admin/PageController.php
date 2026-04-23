<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\FlashesToasts;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePageRequest;
use App\Http\Requests\Admin\UpdatePageRequest;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class PageController extends Controller
{
    use FlashesToasts;

    public function index(): Response
    {
        $pages = Page::query()
            ->orderBy('title')
            ->paginate(20);

        return inertia('admin/pages/index', [
            'pages' => $pages,
        ]);
    }

    public function create(): Response
    {
        return inertia('admin/pages/create');
    }

    public function store(StorePageRequest $request): RedirectResponse
    {
        Page::create($request->validated());
        $this->toast('success', 'Page created.');

        return to_route('admin.pages.index');
    }

    public function edit(Page $page): Response
    {
        return inertia('admin/pages/edit', [
            'page' => $page,
        ]);
    }

    public function update(UpdatePageRequest $request, Page $page): RedirectResponse
    {
        $page->update($request->validated());
        $this->toast('success', 'Page updated.');

        return to_route('admin.pages.index');
    }

    public function destroy(Page $page): RedirectResponse
    {
        $page->delete();
        $this->toast('success', 'Page deleted.');

        return to_route('admin.pages.index');
    }
}
