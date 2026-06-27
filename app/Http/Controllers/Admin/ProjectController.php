<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\FlashesToasts;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use App\Models\Project;
use App\Support\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class ProjectController extends Controller
{
    use FlashesToasts;

    public function __construct(private readonly ImageOptimizer $imageOptimizer) {}

    public function index(): Response
    {
        $projects = Project::query()
            ->orderBy('sort_order')
            ->orderBy('title')
            ->paginate(20);

        return inertia('admin/projects/index', [
            'projects' => $projects,
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['image']);

        if ($request->hasFile('image')) {
            $data['image'] = $this->imageOptimizer->store($request->file('image'), 'projects');
        }

        Project::create($data);
        $this->toast('success', 'Project created.');

        return to_route('admin.projects.index');
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $data = $request->safe()->except(['image', 'remove_image']);

        if ($request->boolean('remove_image') && $project->image) {
            Storage::disk('public')->delete($project->image);
            $data['image'] = null;
        }

        if ($request->hasFile('image')) {
            if ($project->image) {
                Storage::disk('public')->delete($project->image);
            }
            $data['image'] = $this->imageOptimizer->store($request->file('image'), 'projects');
        }

        $project->update($data);
        $this->toast('success', 'Project updated.');

        return to_route('admin.projects.index');
    }

    public function destroy(Project $project): RedirectResponse
    {
        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }

        $project->delete();
        $this->toast('success', 'Project deleted.');

        return to_route('admin.projects.index');
    }
}
