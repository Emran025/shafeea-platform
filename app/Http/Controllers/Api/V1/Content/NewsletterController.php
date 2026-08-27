<?php

namespace App\Http\Controllers\Api\V1\Content;

use App\Http\Controllers\Controller;
use App\Models\Cms\NewsletterSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsletterController extends Controller
{
    /**
     * POST /api/newsletter/subscribe
     *
     * Body (JSON):
     *   { "email": "...", "name": "...", "source": "newsroom" }
     *
     * Responses:
     *   201 — subscribed successfully
     *   409 — email already subscribed
     *   422 — validation error
     */
    public function subscribe(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email', 'max:254'],
            'name' => ['nullable', 'string', 'max:120'],
            'source' => ['nullable', 'string', 'max:60'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid email address.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = strtolower(trim($request->input('email')));

        // Check if already subscribed.
        if (NewsletterSubscription::where('email', $email)->exists()) {
            return response()->json([
                'message' => 'already_subscribed',
            ], 409);
        }

        NewsletterSubscription::create([
            'email' => $email,
            'name' => trim($request->input('name', '')) ?: null,
            'source' => $request->input('source', 'newsroom'),
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'subscribed',
        ], 201);
    }

    /**
     * GET /api/admin/newsletter/subscriptions
     * Admin-only list of all subscriptions (newest first, paginated).
     */
    public function index(): JsonResponse
    {
        $subs = NewsletterSubscription::orderByDesc('created_at')->paginate(50);

        return response()->json($subs);
    }
}
