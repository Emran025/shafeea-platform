<?php

namespace App\Http\Middleware\School;

use App\Models\School\School;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * ResolveSchoolFromAppKey
 *
 * Reads the `X-App-Key` header and resolves the associated school.
 *
 * ── School-Locked Mode ────────────────────────────────────────────────────────
 * When the header is present:
 *   1. The key is looked up in the `schools.app_key` column.
 *   2. If found and the school is active, the school is bound to the request
 *      as `$request->school`, and `$request->school_id` is set for convenience.
 *   3. If the key is invalid or the school is inactive, the request is rejected
 *      with a 401.
 *
 * ── General Mode ─────────────────────────────────────────────────────────────
 * When the header is absent, the middleware is a complete no-op.
 * `$request->school` will be null and all existing multi-school logic continues
 * to function exactly as before. Full backward compatibility is guaranteed.
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 * Apply globally (in bootstrap/app.php api middleware group) so that every
 * mobile API request automatically benefits from school-locking without any
 * change to individual controllers.
 */
class ResolveSchoolFromAppKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $appKey = $request->header('X-App-Key');

        // ── General Mode: no key present — pass through untouched ─────────────
        if (empty($appKey)) {
            return $next($request);
        }

        // ── School-Locked Mode: resolve the school from the key ───────────────
        $school = School::where('app_key', $appKey)
            ->where('is_active', true)
            ->first();

        if (!$school) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or inactive application key.',
            ], 401);
        }

        // Bind the resolved school to the request so downstream code can use it
        // without hitting the database again.
        $request->merge(['school_id' => $school->id]);
        $request->attributes->set('school', $school);

        return $next($request);
    }
}
