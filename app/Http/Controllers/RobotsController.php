<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RobotsController extends Controller
{
    /**
     * Serve a per-host robots.txt: the public site allows everything and
     * advertises the sitemap, while the admin subdomain is fully disallowed.
     */
    public function __invoke(Request $request): Response
    {
        $adminDomain = config('fortify.domain');

        $lines = $adminDomain && $request->getHost() === $adminDomain
            ? [
                'User-agent: *',
                'Disallow: /',
            ]
            : [
                'User-agent: *',
                'Disallow:',
                '',
                'Sitemap: '.rtrim(config('app.url'), '/').'/sitemap.xml',
            ];

        return response(implode("\n", $lines)."\n", 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }
}
