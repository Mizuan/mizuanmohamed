<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Applies a baseline of hardening headers to every web response: clickjacking
 * protection, MIME-sniffing protection, referrer/permissions policy, and — in
 * production over HTTPS — HSTS. Deliberately does not set a Content-Security-
 * Policy, which would need per-page nonces for the inline Vite/theme scripts.
 */
class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $headers = [
            'X-Frame-Options' => 'DENY',
            'X-Content-Type-Options' => 'nosniff',
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
            'Permissions-Policy' => 'geolocation=(), camera=(), microphone=()',
            'X-Permitted-Cross-Domain-Policies' => 'none',
        ];

        // HSTS only makes sense once we're actually on HTTPS in production.
        if ($request->secure() && app()->isProduction()) {
            $headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
        }

        foreach ($headers as $key => $value) {
            if (! $response->headers->has($key)) {
                $response->headers->set($key, $value);
            }
        }

        return $response;
    }
}
