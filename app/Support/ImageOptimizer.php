<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Interfaces\ImageManagerInterface;

class ImageOptimizer
{
    public const QUALITY = 90;

    public function __construct(private readonly ImageManagerInterface $manager) {}

    /**
     * Re-encode an upload at capped quality and store it on the given disk.
     * Returns the stored path (relative to the disk root).
     */
    public function store(UploadedFile $file, string $directory, string $disk = 'public'): string
    {
        $extension = $this->normaliseExtension($file);
        $filename = Str::ulid().'.'.$extension;
        $path = trim($directory, '/').'/'.$filename;

        $encoded = $this->manager
            ->decodePath($file->getRealPath())
            ->encodeUsingFileExtension($extension, quality: self::QUALITY);

        Storage::disk($disk)->put($path, (string) $encoded);

        return $path;
    }

    private function normaliseExtension(UploadedFile $file): string
    {
        $ext = strtolower((string) ($file->getClientOriginalExtension() ?: $file->extension()));

        return match ($ext) {
            'jpeg' => 'jpg',
            '' => 'jpg',
            default => $ext,
        };
    }
}
