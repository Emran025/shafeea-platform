<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\SessionService;
use Illuminate\Http\Request;

class SessionController extends ApiController
{
    protected $sessionService;

    public function __construct(SessionService $sessionService)
    {
        $this->sessionService = $sessionService;
    }

    /**
     * GET /account/sessions
     * List all active login sessions for the current user.
     */
    public function listSessions(Request $request)
    {
        $result = $this->sessionService->listSessions($request);

        return $this->success($result['data']);
    }

    /**
     * POST /account/sessions/terminate-all
     * Terminate all other login sessions except the current one.
     */
    public function terminateAllOtherSessions(Request $request)
    {
        $terminatedCount = $this->sessionService->terminateAllOtherSessions($request);

        return $this->success([
            'terminatedSessionsCount' => $terminatedCount,
            'message' => 'All other sessions have been terminated.',
        ]);
    }

    /**
     * DELETE /account/sessions/{id}
     * Terminate a specific login session.
     */
    public function terminateSession($id, Request $request)
    {
        if ($id === $request->session()->getId()) {
            return $this->error('You cannot terminate your current session.', 400);
        }

        $success = $this->sessionService->terminateSession($id, $request);
        if ($success) {
            return $this->success(null, 'Session terminated successfully.');
        }

        return $this->error('Session not found or you do not have permission to terminate it.', 404);
    }
}
