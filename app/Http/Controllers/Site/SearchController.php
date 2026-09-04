<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Page;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    private const MIN_LENGTH = 2;

    private const PER_GROUP = 5;

    public function __invoke(Request $request): JsonResponse
    {
        $term = trim((string) $request->query('q', ''));

        if (mb_strlen($term) < self::MIN_LENGTH) {
            return response()->json(['groups' => []]);
        }

        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';

        $groups = array_values(array_filter([
            $this->group('Writing', $this->articles($like)),
            $this->group('Projects', $this->projects($like)),
            $this->group('Pages', $this->pages($like)),
        ]));

        return response()->json(['groups' => $groups]);
    }

    /**
     * @param  array<int, array<string, string|null>>  $items
     * @return array<string, mixed>|null
     */
    private function group(string $label, array $items): ?array
    {
        return $items === [] ? null : ['label' => $label, 'items' => $items];
    }

    /** @return array<int, array<string, string|null>> */
    private function articles(string $like): array
    {
        return Article::query()
            ->published()
            ->where(fn ($query) => $query
                ->where('title', 'like', $like)
                ->orWhere('excerpt', 'like', $like))
            ->latest('published_at')
            ->limit(self::PER_GROUP)
            ->get(['title', 'slug', 'excerpt'])
            ->map(fn (Article $article): array => [
                'title' => $article->title,
                'description' => $article->excerpt,
                'url' => route('site.articles.show', $article->slug, absolute: false),
            ])
            ->all();
    }

    /** @return array<int, array<string, string|null>> */
    private function projects(string $like): array
    {
        return Project::query()
            ->where('is_published', true)
            ->where(fn ($query) => $query
                ->where('title', 'like', $like)
                ->orWhere('description', 'like', $like))
            ->orderBy('sort_order')
            ->limit(self::PER_GROUP)
            ->get(['title', 'description', 'link'])
            ->map(fn (Project $project): array => [
                'title' => $project->title,
                'description' => $project->description,
                'url' => $project->link ?: route('site.projects.index', absolute: false),
            ])
            ->all();
    }

    /** @return array<int, array<string, string|null>> */
    private function pages(string $like): array
    {
        return Page::query()
            ->where('is_published', true)
            ->where('title', 'like', $like)
            ->orderBy('title')
            ->limit(self::PER_GROUP)
            ->get(['title', 'slug', 'meta_description'])
            ->map(fn (Page $page): array => [
                'title' => $page->title,
                'description' => $page->meta_description,
                'url' => route('site.pages.show', $page->slug, absolute: false),
            ])
            ->all();
    }
}
