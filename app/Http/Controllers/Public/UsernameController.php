<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\Auth\UsernameGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UsernameController extends Controller
{
    /**
     * Return a username suggestion derived from the given name.
     *
     * This endpoint is intentionally public and read-only. The returned value
     * is a sanitized base candidate (stages 1-3 of the generator pipeline only)
     * and is NOT guaranteed to be unique — uniqueness is still enforced
     * server-side when the form is actually submitted.
     *
     * GET /username/suggest?name=محمد+علي
     *
     * @return JsonResponse { "username": "mohamed.ali" }
     */
    public function suggest(Request $request): JsonResponse
    {
        $name = (string) $request->query('name', '');

        $suggestion = UsernameGenerator::suggest($name);

        return response()->json(['username' => $suggestion]);
    }
}
