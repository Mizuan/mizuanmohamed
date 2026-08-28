<?php

namespace App\Providers\Filament;

use App\Filament\Widgets\ContentOverview;
use App\Filament\Widgets\LatestArticles;
use App\Http\Middleware\PreventIndexing;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\View\PanelsRenderHook;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Contracts\View\View;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->brandName('Mizuan Mohamed')
            ->viteTheme('resources/css/filament/admin/theme.css')
            // Shades 500 and 600 are dark enough to carry white text, so solid
            // buttons use the crimson background rather than Filament's pale
            // dark-text fallback.
            ->colors([
                'primary' => [
                    50 => '#fdf5f3',
                    100 => '#fbe8e4',
                    200 => '#f6d2cb',
                    300 => '#eeb0a4',
                    400 => '#e2836f',
                    500 => '#c8402c',
                    600 => '#b93222',
                    700 => '#9b291c',
                    800 => '#80241a',
                    900 => '#6b221a',
                    950 => '#3a0f0b',
                ],
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                ContentOverview::class,
                LatestArticles::class,
            ])
            ->renderHook(
                PanelsRenderHook::FOOTER,
                fn (): View => view('filament.footer'),
            )
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
                PreventIndexing::class,
            ])
            ->authMiddleware([
                Authenticate::class,
                EnsureEmailIsVerified::class,
            ]);

        // Authentication stays with Fortify (passkeys, 2FA, throttling), so the
        // panel has no login page of its own; guests are redirected to it.
        if ($domain = config('fortify.domain')) {
            $panel->domain($domain);
        }

        return $panel;
    }
}
