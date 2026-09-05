<!DOCTYPE html>
@php($isPublicSite = str_starts_with($page['component'] ?? '', 'site/'))
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    @class(['dark' => ! $isPublicSite && ($appearance ?? 'system') == 'dark'])
    @if ($isPublicSite) data-public-site @endif>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Server-rendered SEO fallbacks: crawlers that don't execute JS see
             these; Inertia's <Head> augments/overrides them client-side. --}}
        <meta name="description" content="Full-stack developer based in Malé, Maldives. Selected work, writing, and notes on building for the web with Laravel, React, and TypeScript.">
        <meta name="author" content="Mizuan Mohamed">
        <meta name="theme-color" content="{{ $isPublicSite ? '#ffffff' : '#0a0506' }}">
        <meta name="color-scheme" content="{{ $isPublicSite ? 'light' : 'dark light' }}">
        <meta property="og:site_name" content="{{ config('app.name', 'Mizuan Mohamed') }}">
        <meta property="og:type" content="website">
        <meta property="og:title" content="Mizuan Mohamed — Full-Stack Developer">
        <meta property="og:description" content="Full-stack developer based in Malé, Maldives. Selected work, writing, and notes on building for the web.">
        <meta property="og:url" content="{{ config('app.url') }}">
        <meta property="og:image" content="{{ config('app.url') }}/favicon-512x512.png">

        <script type="application/ld+json">
            {!! json_encode([
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'Person',
                        '@id' => config('app.url').'#person',
                        'name' => 'Mizuan Mohamed',
                        'url' => config('app.url'),
                        'jobTitle' => 'Full-Stack Developer',
                        'address' => ['@type' => 'PostalAddress', 'addressLocality' => 'Malé', 'addressCountry' => 'MV'],
                        'sameAs' => [
                            'https://github.com/Mizuan',
                            'https://www.linkedin.com/in/mizuanmohamed/',
                            'https://x.com/mizuanmohamed',
                        ],
                    ],
                    [
                        '@type' => 'WebSite',
                        'url' => config('app.url'),
                        'name' => config('app.name', 'Mizuan Mohamed'),
                        'publisher' => ['@id' => config('app.url').'#person'],
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
        </script>

        @unless ($isPublicSite)
            {{-- Apply the system dark preference before first paint --}}
            <script>
                (function() {
                    const appearance = '{{ $appearance ?? "system" }}';

                    if (appearance === 'system') {
                        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                        if (prefersDark) {
                            document.documentElement.classList.add('dark');
                        }
                    }
                })();
            </script>
        @endunless

        {{-- Matches --background so the first paint has no flash --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=4">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=4">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=4">
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png?v=4">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=4">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600|space-grotesk:400,500,600,700" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
