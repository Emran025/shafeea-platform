<?php

namespace App\Http\Middleware\Auth;

use App\Models\Auth\AdminApiToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateAdminApi
{
    public function handle(Request $request, Closure $next): Response
    {
        $bearer = $request->bearerToken();
        if (! $bearer) {
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
        $request->headers->set('X-Actor-ID', (string) $token->user->id);

        return $next($request);
    }
}
