<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

/**
 * The login screen is an Inertia page but the admin panel is not, so a plain
 * redirect would be followed over XHR and rendered in Inertia's error overlay.
 * `Inertia::location()` forces a real browser navigation instead.
 */
class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): Response
    {
        $target = redirect()->intended(config('fortify.home'))->getTargetUrl();

        return $this->redirect($request, $target);
    }

    protected function redirect(Request $request, string $target): Response
    {
        return $request->hasHeader('X-Inertia')
            ? Inertia::location($target)
            : redirect()->to($target);
    }
}
