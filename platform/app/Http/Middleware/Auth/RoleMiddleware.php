<?php

namespace App\Http\Middleware\Auth;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Route-level role gate for API routes.
 *
 * Usage in routes:
 *   ->middleware('role:school_admin|students_supervisor')
 */
class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $rolesArray = explode('|', $roles);
        $hasRole = false;

        foreach ($rolesArray as $role) {
            if ($user->hasRole($role)) {
                $hasRole = true;
                break;
            }
        }

        if (! $hasRole) {
            return response()->json([
                'error' => 'Forbidden.',
                'message' => 'You do not have the required role to access this resource.'
            ], 403);
        }

        return $next($request);
    }
}
