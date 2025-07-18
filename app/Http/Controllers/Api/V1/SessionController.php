<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SessionController extends ApiController
{
    // Helper to generate mock sessions data
    private function generateSessions()
    {
        return [
            [
                'id' => 'session_12345',
                'device' => [
                    'browser' => 'Chrome',
                    'os' => 'Windows 10',
                    'platform' => 'Desktop',
                ],
                'startTime' => Carbon::now()->subHours(2)->toIso8601String(),
                'ipAddress' => '192.168.1.100',
                'location' => 'Riyadh, Saudi Arabia',
                'isCurrent' => true,
            ],
            [
                'id' => 'session_67890',
                'device' => [
                    'browser' => 'Safari',
                    'os' => 'iOS 16',
                    'platform' => 'Mobile',
                ],
                'startTime' => Carbon::now()->subDay()->toIso8601String(),
                'ipAddress' => '10.0.0.5',
                'location' => 'Jeddah, Saudi Arabia',
                'isCurrent' => false,
            ],
        ];
    }

    /**
     * GET /account/sessions
     * List all active login sessions for the current user.
     */
    public function listSessions(Request $request)
    {
        // In real app: retrieve sessions for authenticated user from DB/session store
        $sessions = $this->generateSessions();

        return $this->success([
            'data' => $sessions
        ]);
    }

    /**
     * POST /account/sessions/refresh
     * Refresh the current session token.
     */
    public function refreshSession(Request $request)
    {
        // In real app: generate a new JWT token or refresh token for current session
        $newToken = 'new_refreshed_jwt_token_' . Str::random(10);
        $expiresAt = Carbon::now()->addHours(2)->toIso8601String();

        return $this->success([
            'token' => $newToken,
            'expiresAt' => $expiresAt,
        ]);
    }

    /**
     * POST /account/sessions/terminate-all
     * Terminate all other login sessions except the current one.
     */
    public function terminateAllOtherSessions(Request $request)
    {
        // In real app: find all sessions except current and terminate them
        $terminatedCount = 1; // mocked

        return $this->success([
            'terminatedSessionsCount' => $terminatedCount,
            'message' => 'All other sessions have been terminated.'
        ]);
    }

    /**
     * DELETE /account/sessions/{id}
     * Terminate a specific login session.
     */
    public function terminateSession($id)
    {
        // In real app: find session by $id and terminate it
        // Here we just assume success

        return $this->success(null, 'Session terminated successfully.');
    }
}
