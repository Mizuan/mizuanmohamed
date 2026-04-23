<?php

use App\Support\ImageOptimizer;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('re-encodes uploaded jpeg at capped quality and stores under the given directory', function (): void {
    Storage::fake('public');
    $optimizer = app(ImageOptimizer::class);
    $upload = UploadedFile::fake()->image('photo.jpg', 800, 600);

    $path = $optimizer->store($upload, 'articles');

    expect($path)->toStartWith('articles/')->toEndWith('.jpg');
    Storage::disk('public')->assertExists($path);

    $stored = Storage::disk('public')->get($path);
    expect($stored)->not->toBe(file_get_contents($upload->getRealPath()));

    $info = getimagesizefromstring($stored);
    expect($info)->not->toBeFalse();
    expect($info[2])->toBe(IMAGETYPE_JPEG);
});

it('preserves png extension when uploading a png', function (): void {
    Storage::fake('public');
    $optimizer = app(ImageOptimizer::class);
    $upload = UploadedFile::fake()->image('icon.png', 100, 100);

    $path = $optimizer->store($upload, 'projects');

    expect($path)->toEndWith('.png');
    Storage::disk('public')->assertExists($path);
});

it('normalises jpeg extension to jpg', function (): void {
    Storage::fake('public');
    $optimizer = app(ImageOptimizer::class);
    $upload = UploadedFile::fake()->image('shot.jpeg', 200, 200);

    $path = $optimizer->store($upload, 'articles');

    expect($path)->toEndWith('.jpg');
});

it('caps quality constant at 90', function (): void {
    expect(ImageOptimizer::QUALITY)->toBe(90);
});
