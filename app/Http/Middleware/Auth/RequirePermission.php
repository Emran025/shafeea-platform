<?php

namespace App\Http\Middleware\Auth;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Route-level permission gate for the admin API.
 *
 * Usage in routes:
 *   ->middleware('require.permission:manage_faq')
 *
 * The middleware resolves the authenticated admin user (set by AuthenticateAdminApi),
 * looks up their role's permissions via role_permissions, and rejects the request
 * with 403 if the required permission code is not present.
 *
 * platform.admin is always allowed through regardless of permission code.
 */
class RequirePermission
{
    public function handle(Request $request, Closure $next, string $permissionCode): Response
    {
        $user = $request->attributes->get('admin_user');

        if (! $user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        // Platform admin bypasses all permission checks
        if ($user->role === 'platform.admin') {
            return $next($request);
        }

        $hasPermission = $user->hasPermission($permissionCode);

        if (! $hasPermission) {
            return response()->json([
                'error'      => 'Forbidden.',
                'required'   => $permissionCode,
                'your_role'  => $user->role,
            ], 403);
        }

        return $next($request);
    }
}
