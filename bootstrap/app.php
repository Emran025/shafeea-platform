<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route; // Required for proxy headers
use Illuminate\Auth\AuthenticationException ;
use App\Http\Middleware\IsSuperVisor ;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Custom route files
            Route::middleware('web')
                ->group(base_path('routes/teachers.php'));

            Route::middleware('web')
                ->group(base_path('routes/schools.php'));

            Route::middleware('api')
                ->group(base_path('routes/help.php'));

            Route::middleware('web')
                ->prefix('admin')
                ->name('admin.')
                ->group(base_path('routes/admin.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->redirectGuestsTo(fn (Request $request) => $request->is('admin/*') || $request->is('admin') ? route('admin.login') : '/');

        // Trust proxies for Render/Load Balancers to fix HTTPS/Mixed Content issues
        $middleware->trustProxies(at: '*', headers: Request::HEADER_X_FORWARDED_FOR |
            Request::HEADER_X_FORWARDED_HOST |
            Request::HEADER_X_FORWARDED_PORT |
            Request::HEADER_X_FORWARDED_PROTO |
            Request::HEADER_X_FORWARDED_AWS_ELB
        );

        // Middleware Aliases
        $middleware->alias([
            'admin' => IsSuperVisor::class,
        ]);

        // Exempt cookies from encryption
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // Append middleware to the web group
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Custom exception rendering for API
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token is invalid or already revoked',
                ], 401);
            }
        });

        // Diagnostic logging: every form validation failure ends up as a 302
        // redirect back to the form with flashed errors (normal Laravel/Inertia
        // behaviour), which looks identical to a "silent" failure from the
        // access log alone. Log the actual field errors so failures on any
        // POST route (admin login, school registration, teacher applications,
        // etc.) are traceable in storage/logs/laravel.log instead of only
        // showing up as an unexplained 302.
        $exceptions->report(function (ValidationException $e) {
            Log::warning('Form validation failed', [
                'url' => request()->fullUrl(),
                'method' => request()->method(),
                'errors' => $e->errors(),
                'ip' => request()->ip(),
            ]);
        });

        // A 419 here almost always means the session/CSRF cookie did not
        // round-trip correctly (session cookie domain mismatch, proxy not
        // forwarding cookies, session storage not persisting, etc). Log it
        // with enough context to diagnose without server access.
        $exceptions->report(function (TokenMismatchException $e) {
            Log::warning('CSRF token mismatch (session likely not persisting)', [
                'url' => request()->fullUrl(),
                'method' => request()->method(),
                'has_session_cookie' => request()->hasCookie(config('session.cookie')),
                'ip' => request()->ip(),
            ]);
        });
    })->create();
