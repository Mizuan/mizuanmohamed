<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreArticleRequest;
use App\Http\Requests\Admin\UpdateArticleRequest;
use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Support\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class ArticleController extends Controller
{
    public function __construct(private readonly ImageOptimizer $imageOptimizer) {}

    public function index(): Response
    {
        $articles = Article::query()
            ->with(['category:id,name,slug', 'author:id,name'])
            ->latest()
            ->paginate(15);

        return inertia('admin/articles/index', [
            'articles' => $articles,
        ]);
    }

    public function create(): Response
    {
        return inertia('admin/articles/create', [
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name']),
            'statuses' => ArticleStatus::options(),
        ]);
    }

    public function store(StoreArticleRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['tag_ids', 'featured_image']);
        $data['user_id'] = $request->user()->id;

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $this->imageOptimizer->store(
                $request->file('featured_image'),
                'articles',
            );
        }

        if ($data['status'] === ArticleStatus::Published->value && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $article = Article::create($data);
        $article->tags()->sync($request->validated('tag_ids') ?? []);

        return to_route('admin.articles.index')
            ->with('success', 'Article created.');
    }

    public function edit(Article $article): Response
    {
        $article->load('tags:id');

        return inertia('admin/articles/edit', [
            'article' => $article,
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name']),
            'statuses' => ArticleStatus::options(),
        ]);
    }

    public function update(UpdateArticleRequest $request, Article $article): RedirectResponse
    {
        $data = $request->safe()->except(['tag_ids', 'featured_image', 'remove_featured_image']);

        if ($request->boolean('remove_featured_image') && $article->featured_image) {
            Storage::disk('public')->delete($article->featured_image);
            $data['featured_image'] = null;
        }

        if ($request->hasFile('featured_image')) {
            if ($article->featured_image) {
                Storage::disk('public')->delete($article->featured_image);
            }
            $data['featured_image'] = $this->imageOptimizer->store(
                $request->file('featured_image'),
                'articles',
            );
        }

        if ($data['status'] === ArticleStatus::Published->value
            && empty($data['published_at'])
            && ! $article->published_at
        ) {
            $data['published_at'] = now();
        }

        $article->update($data);
        $article->tags()->sync($request->validated('tag_ids') ?? []);

        return to_route('admin.articles.index')
            ->with('success', 'Article updated.');
    }

    public function destroy(Article $article): RedirectResponse
    {
        if ($article->featured_image) {
            Storage::disk('public')->delete($article->featured_image);
        }

        $article->delete();

        return to_route('admin.articles.index')
            ->with('success', 'Article deleted.');
    }
}
