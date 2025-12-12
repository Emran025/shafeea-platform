<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Enums\AdminStatus;


class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->admin && $user->admin->status === AdminStatus::ACCEPTED) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return redirect('admin/dashboard');
    }
}
