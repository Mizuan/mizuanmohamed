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
    /**
     * The longest edge (in pixels) a stored image is scaled down to.
     */
    public const MAX_DIMENSION = 2400;

    public function store(UploadedFile $file, string $directory, string $disk = 'public'): string
    {
        $directory = trim($directory, '/');
        $extension = $this->normaliseExtension($file);
        $filename = Str::ulid().'.'.$extension;
        $path = $directory.'/'.$filename;

        try {
            // Decoding a high-resolution photo with GD is memory-hungry, so
            // lift the ceiling for this request before reading it.
            @ini_set('memory_limit', '512M');

            $encoded = $this->manager
                ->decodePath($file->getRealPath())
                ->scaleDown(self::MAX_DIMENSION, self::MAX_DIMENSION)
                ->encodeUsingFileExtension($extension, quality: self::QUALITY);

            Storage::disk($disk)->put($path, (string) $encoded);
        } catch (\Throwable $e) {
            // If optimisation fails (e.g. an unusual format), keep the upload
            // working by storing the original file unprocessed.
            report($e);
            Storage::disk($disk)->putFileAs($directory, $file, $filename);
        }

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
