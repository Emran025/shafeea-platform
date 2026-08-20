<?php

use App\Http\Middleware\Inertia\HandleAppearance;
use App\Http\Middleware\Inertia\HandleInertiaRequests;
use App\Http\Middleware\School\ResolveSchoolFromAppKey;
use App\Http\Middleware\Api\VerifyBuildApiSignature;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route; // Required for proxy headers
use Illuminate\Auth\AuthenticationException;
use App\Http\Middleware\Auth\IsSuperVisor;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/platform/web.php',
        api: __DIR__ . '/../routes/platform/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: function () {
            // Custom route files
            Route::middleware('web')
                ->group(base_path('routes/platform/teachers.php'));

            Route::middleware('web')
                ->group(base_path('routes/schools/schools.php'));

            Route::middleware('api')
                ->group(base_path('routes/platform/help.php'));

            Route::middleware('web')
                ->prefix('admin')
                ->name('admin.')
                ->group(base_path('routes/platform/admin.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->redirectGuestsTo(fn(Request $request) => $request->is('admin/*') || $request->is('admin') ? route('admin.login') : '/');

        // Trust proxies for Render/Load Balancers to fix HTTPS/Mixed Content issues
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR |
                Request::HEADER_X_FORWARDED_HOST |
                Request::HEADER_X_FORWARDED_PORT |
                Request::HEADER_X_FORWARDED_PROTO |
                Request::HEADER_X_FORWARDED_AWS_ELB
        );

        // Middleware Aliases
        $middleware->alias([
            'admin'                  => IsSuperVisor::class,
            'verify.build.signature' => VerifyBuildApiSignature::class,
            'admin.auth'             => \App\Http\Middleware\Auth\AuthenticateAdminApi::class,
            'require.permission'     => \App\Http\Middleware\Auth\RequirePermission::class,
        ]);

        // Exempt cookies from encryption
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // Exempt school admin API routes from CSRF validation (authenticated via Bearer token)
        $middleware->validateCsrfTokens(except: [
            'school/*/admin/*',
            'school/*/admin',
        ]);

        // Append middleware to the web group
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Append ResolveSchoolFromAppKey to the API group.
        // When X-App-Key is present: resolves school and binds it to the request.
        // When absent: complete no-op — General Mode, fully backward compatible.
        $middleware->api(append: [
            ResolveSchoolFromAppKey::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Laravel silently ignores ValidationException and TokenMismatchException
        // in its internal "don't report" list (they're expected, user-facing
        // exceptions, not bugs) — which means the report() callbacks below for
        // these two types would NEVER actually run without this call. That is
        // exactly why the "Form validation failed" / CSRF diagnostic logging
        // never produced any log entries for the teacher application and other
        // forms: the exception itself was never getting to the report stage.
        $exceptions->stopIgnoring([
            ValidationException::class,
            TokenMismatchException::class,
        ]);

        // Custom exception rendering for API and School Admin API
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*') || $request->is('school/*/admin/*') || $request->wantsJson()) {
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
        // NOTE: report() callbacks run with no surrounding try/catch in
        // Laravel's exception handler (see Handler::reportThrowable) — if the
        // callback itself throws (e.g. Log::warning() fails because
        // storage/logs isn't writable, disk is full, or the log channel is
        // misconfigured), that new exception replaces the original one and
        // turns what used to be a normal 302/419 into an unhandled 500. Every
        // diagnostic logging call here MUST be wrapped so a logging failure
        // can never break the request it's trying to observe.
        $exceptions->report(function (ValidationException $e) {
            try {
                Log::warning('Form validation failed', [
                    'url' => request()->fullUrl(),
                    'method' => request()->method(),
                    'errors' => $e->errors(),
                    'ip' => request()->ip(),
                ]);
            } catch (\Throwable $loggingError) {
                // Never let a logging failure mask/replace the real exception.
            }

            // Returning false stops Laravel from ALSO logging this via its
            // default reportThrowable() path (which — now that stopIgnoring()
            // makes this exception reportable at all — would otherwise write
            // a full ERROR-level stack trace for every single validation
            // failure, an extremely common, expected user event, not a bug).
            return false;
        });

        // A 419 here almost always means the session/CSRF cookie did not
        // round-trip correctly (session cookie domain mismatch, proxy not
        // forwarding cookies, session storage not persisting, etc). Log it
        // with enough context to diagnose without server access.
        $exceptions->report(function (TokenMismatchException $e) {
            try {
                Log::warning('CSRF token mismatch (session likely not persisting)', [
                    'url' => request()->fullUrl(),
                    'method' => request()->method(),
                    'has_session_cookie' => request()->hasCookie(config('session.cookie')),
                    'ip' => request()->ip(),
                ]);
            } catch (\Throwable $loggingError) {
                // Never let a logging failure mask/replace the real exception.
            }

            // Same reasoning as the ValidationException handler above: avoid
            // an additional noisy default ERROR-level stack trace for every
            // expected 419.
            return false;
        });
    })->create();
