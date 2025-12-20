<?php

namespace App\Http\Middleware;

use App\Enums\AdminStatus;
use Closure;
use Illuminate\Http\Request;

class IsSuperVisor
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->admin && $user->admin->status === AdminStatus::ACCEPTED && $user->admin->super_admin === true) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return redirect('/');
    }
}
