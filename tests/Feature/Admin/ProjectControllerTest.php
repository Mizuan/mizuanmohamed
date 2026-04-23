<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    $this->admin = User::factory()->admin()->create();
});

it('creates a project with tags, technologies, and image', function (): void {
    Storage::fake('public');

    $this->actingAs($this->admin)
        ->post(route('admin.projects.store'), [
            'title' => 'Tree and Salt',
            'description' => 'A travel agency in the Maldives.',
            'tags' => ['Web Apps'],
            'technologies' => ['Laravel', 'Inertia', 'React'],
            'image' => UploadedFile::fake()->image('cover.jpg'),
            'link' => 'https://treeandsalt.com',
            'is_published' => true,
            'sort_order' => 1,
        ])
        ->assertRedirect(route('admin.projects.index'));

    $project = Project::query()->where('slug', 'tree-and-salt')->firstOrFail();
    expect($project->tags)->toBe(['Web Apps']);
    expect($project->technologies)->toBe(['Laravel', 'Inertia', 'React']);
    expect($project->link)->toBe('https://treeandsalt.com');
    Storage::disk('public')->assertExists($project->image);
});

it('requires title, description, and is_published', function (): void {
    $this->actingAs($this->admin)
        ->post(route('admin.projects.store'), [])
        ->assertSessionHasErrors(['title', 'description', 'is_published']);
});

it('rejects an invalid link url', function (): void {
    $this->actingAs($this->admin)
        ->post(route('admin.projects.store'), [
            'title' => 'X',
            'description' => 'y',
            'link' => 'not-a-url',
            'is_published' => true,
        ])
        ->assertSessionHasErrors('link');
});

it('updates a project and removes its image when asked', function (): void {
    Storage::fake('public');
    $path = UploadedFile::fake()->image('x.jpg')->store('projects', 'public');
    $project = Project::factory()->create(['image' => $path]);

    $this->actingAs($this->admin)
        ->put(route('admin.projects.update', $project), [
            'title' => 'Renamed',
            'slug' => $project->slug,
            'description' => $project->description,
            'is_published' => true,
            'remove_image' => true,
        ])
        ->assertRedirect(route('admin.projects.index'));

    $project->refresh();
    expect($project->title)->toBe('Renamed');
    expect($project->image)->toBeNull();
    Storage::disk('public')->assertMissing($path);
});

it('deletes a project and its image', function (): void {
    Storage::fake('public');
    $path = UploadedFile::fake()->image('x.jpg')->store('projects', 'public');
    $project = Project::factory()->create(['image' => $path]);

    $this->actingAs($this->admin)
        ->delete(route('admin.projects.destroy', $project))
        ->assertRedirect(route('admin.projects.index'));

    $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    Storage::disk('public')->assertMissing($path);
});

it('seeder populates 8 projects with tree-and-salt last', function (): void {
    $this->seed(\Database\Seeders\ProjectSeeder::class);

    expect(Project::count())->toBe(8);

    $last = Project::orderBy('sort_order', 'desc')->first();
    expect($last->title)->toBe('Tree and Salt');
    expect($last->link)->toBe('https://treeandsalt.com');
    expect($last->technologies)->toBe(['Laravel', 'Inertia', 'React']);
});
