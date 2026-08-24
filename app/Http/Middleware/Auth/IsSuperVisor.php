<?php

namespace App\Http\Middleware\Auth;

use App\Enums\AdminStatus;
use Closure;
use Illuminate\Http\Request;

class IsSuperVisor
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->admin && $user->admin->status === AdminStatus::ACCEPTED ) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return redirect('/');
    }
}
