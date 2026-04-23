<?php

namespace App\Http\Controllers\Concerns;

use Inertia\Inertia;

trait FlashesToasts
{
    /**
     * Flash a toast notification for the next Inertia response.
     */
    protected function toast(string $type, string $message): void
    {
        Inertia::flash('toast', ['type' => $type, 'message' => $message]);
    }
}
