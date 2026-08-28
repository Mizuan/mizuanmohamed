<?php

use Illuminate\Support\Facades\Storage;

it('generates root-relative public storage urls', function (): void {
    // Absolute URLs pin uploads to APP_URL's host, which makes the admin
    // subdomain fetch them cross-origin and trip CORS.
    expect(Storage::disk('public')->url('projects/example.png'))
        ->toBe('/storage/projects/example.png');
});
