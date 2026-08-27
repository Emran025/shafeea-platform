<?php

namespace App\Http\Middleware\Auth;

use App\Models\Auth\AdminApiToken;
use App\Models\School\School;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateAdminApi
{
    public function handle(Request $request, Closure $next): Response
    {
        $bearer = $request->bearerToken();
        if (! $bearer) {
            if ($request->isMethod('GET') && $request->acceptsHtml() && ! $request->expectsJson()) {
                $schoolCode = $request->route('school_code') ?? '';
                $school = School::where('code', $schoolCode)->first();

                return response()->view('schools.app', [
                    'school' => $school,
                    'school_code' => $schoolCode,
                    'seo' => ['title' => 'لوحة التحكم - منصة شفيع'],
                ]);
            }

            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $token = AdminApiToken::with('user')
            ->where('token_hash', hash('sha256', $bearer))
            ->first();

        if (! $token || ! $token->user || $token->expires_at->isPast() || ! $token->user->is_active) {
            return response()->json(['error' => 'Invalid or expired token.'], 401);
        }

        $token->forceFill(['last_used_at' => now()])->save();
        $request->attributes->set('admin_user', $token->user);

        $userId = (string) $token->user->id;
        $actorUuid = Str::isUuid($userId)
            ? $userId
            : sprintf('00000000-0000-0000-0000-%012d', (int) $token->user->id);

        $request->headers->set('X-Actor-ID', $actorUuid);

        return $next($request);
    }
}
