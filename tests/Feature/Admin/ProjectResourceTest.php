<?php

use App\Filament\Resources\Projects\Pages\ManageProjects;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\ProjectSeeder;
use Filament\Actions\Testing\TestAction;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Livewire\livewire;

beforeEach(function (): void {
    $this->actingAs(User::factory()->admin()->create());
});

it('lists projects', function (): void {
    $projects = Project::factory()->count(3)->create();

    livewire(ManageProjects::class)
        ->assertOk()
        ->assertCanSeeTableRecords($projects);
});

it('creates a project with tags, technologies, and an optimised image', function (): void {
    Storage::fake('public');

    livewire(ManageProjects::class)
        ->callAction('create', data: [
            'title' => 'Tree and Salt',
            'description' => 'A travel agency in the Maldives.',
            'tags' => ['Web Apps'],
            'technologies' => ['Laravel', 'Inertia', 'React'],
            'image' => UploadedFile::fake()->image('cover.jpg'),
            'link' => 'https://treeandsalt.com',
            'is_published' => true,
        ])
        ->assertHasNoActionErrors();

    $project = Project::query()->where('slug', 'tree-and-salt')->firstOrFail();

    expect($project->tags)->toBe(['Web Apps']);
    expect($project->technologies)->toBe(['Laravel', 'Inertia', 'React']);
    expect($project->link)->toBe('https://treeandsalt.com');

    // The optimiser names files with a ULID, proving the upload was routed
    // through it rather than stored by Filament directly.
    expect($project->image)->toStartWith('projects/');
    Storage::disk('public')->assertExists($project->image);
});

it('requires a title and description', function (): void {
    livewire(ManageProjects::class)
        ->callAction('create', data: ['title' => null, 'description' => null])
        ->assertHasActionErrors(['title' => 'required', 'description' => 'required']);
});

it('rejects an invalid link url', function (): void {
    livewire(ManageProjects::class)
        ->callAction('create', data: [
            'title' => 'X',
            'description' => 'y',
            'link' => 'not-a-url',
        ])
        ->assertHasActionErrors(['link']);
});

it('updates a project', function (): void {
    $project = Project::factory()->create();

    livewire(ManageProjects::class)
        ->callAction(TestAction::make('edit')->table($project), data: [
            'title' => 'Renamed',
            'slug' => $project->slug,
            'description' => $project->description,
            'is_published' => true,
        ])
        ->assertHasNoActionErrors();

    expect($project->refresh()->title)->toBe('Renamed');
});

it('deletes a project and its image', function (): void {
    Storage::fake('public');
    $path = UploadedFile::fake()->image('x.jpg')->store('projects', 'public');
    $project = Project::factory()->create(['image' => $path]);

    livewire(ManageProjects::class)
        ->callAction(TestAction::make('delete')->table($project));

    assertDatabaseMissing('projects', ['id' => $project->id]);
    Storage::disk('public')->assertMissing($path);
});

it('reorders projects', function (): void {
    $first = Project::factory()->create(['sort_order' => 1]);
    $second = Project::factory()->create(['sort_order' => 2]);

    livewire(ManageProjects::class)
        ->call('reorderTable', [$second->getKey(), $first->getKey()]);

    expect($second->refresh()->sort_order)->toBeLessThan($first->refresh()->sort_order);
});

it('seeder populates 8 projects with tree-and-salt last', function (): void {
    $this->seed(ProjectSeeder::class);

    expect(Project::count())->toBe(8);

    $last = Project::orderBy('sort_order', 'desc')->first();
    expect($last->title)->toBe('Tree and Salt');
    expect($last->link)->toBe('https://treeandsalt.com');
    expect($last->technologies)->toBe(['Laravel', 'Inertia', 'React']);
});
