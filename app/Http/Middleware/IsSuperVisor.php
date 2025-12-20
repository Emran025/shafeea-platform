<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Enums\AdminStatus;


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
