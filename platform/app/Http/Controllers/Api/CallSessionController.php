<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Halaqah\CallSession;
use App\Models\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CallSessionController extends Controller
{
    /**
     * Request a new call session.
     */
    public function requestSession(Request $request)
    {
        $request->validate([
            'target_id' => 'required|exists:users,id',
        ]);

        $initiator = $request->user();
        $target = User::findOrFail($request->target_id);

        // School Scoping: Must belong to the same school
        if ($initiator->school_id !== $target->school_id) {
            return response()->json(['error' => 'Users must belong to the same school to initiate a call.'], 403);
        }

        // Prevent active duplicate sessions
        $activeSession = CallSession::where('initiator_id', $initiator->id)
            ->whereIn('status', ['requested', 'active'])
            ->first();

        if ($activeSession) {
            return response()->json([
                'error' => 'You already have an active or requested session.',
                'session_id' => $activeSession->session_id
            ], 422);
        }

        $session = CallSession::create([
            'session_id' => \Illuminate\Support\Str::uuid()->toString(),
            'school_id' => $initiator->school_id,
            'initiator_id' => $initiator->id,
            'target_id' => $target->id,
            'status' => 'requested',
        ]);

        // Dispatch WebSocket notification to the target user
        broadcast(new \App\Events\CallSessionNotificationEvent($session, 'requested', $target->id));

        return response()->json([
            'message' => 'Call requested successfully.',
            'session' => $session
        ], 201);
    }

    /**
     * Accept a call session.
     */
    public function acceptSession(Request $request, $sessionId)
    {
        $session = CallSession::where('session_id', $sessionId)->firstOrFail();
        $user = $request->user();

        if ($session->target_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized to accept this call.'], 403);
        }

        if ($session->status !== 'requested') {
            return response()->json(['error' => 'Call is no longer in requested state.'], 422);
        }

        $session->update([
            'status' => 'active',
            'started_at' => now(),
        ]);

        // Dispatch WebSocket notification to the initiator that the call was accepted
        broadcast(new \App\Events\CallSessionNotificationEvent($session, 'accepted', $session->initiator_id));

        return response()->json([
            'message' => 'Call accepted.',
            'session' => $session
        ]);
    }

    /**
     * Reject a call session.
     */
    public function rejectSession(Request $request, $sessionId)
    {
        $session = CallSession::where('session_id', $sessionId)->firstOrFail();
        $user = $request->user();

        if ($session->target_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized to reject this call.'], 403);
        }

        if ($session->status !== 'requested') {
            return response()->json(['error' => 'Call is no longer in requested state.'], 422);
        }

        $session->update([
            'status' => 'rejected',
            'ended_at' => now(),
        ]);

        // Dispatch WebSocket notification to the initiator that the call was rejected
        broadcast(new \App\Events\CallSessionNotificationEvent($session, 'rejected', $session->initiator_id));

        return response()->json([
            'message' => 'Call rejected.',
            'session' => $session
        ]);
    }

    /**
     * Handle WebRTC signaling data (SDP / ICE candidates) and broadcast to peers.
     */
    public function signal(Request $request, $sessionId)
    {
        $request->validate([
            'signal_data' => 'required|array',
        ]);

        $session = CallSession::where('session_id', $sessionId)->firstOrFail();
        $user = $request->user();

        if (!in_array($user->id, [$session->initiator_id, $session->target_id, $session->third_party_id])) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        if (!in_array($session->status, ['requested', 'active'])) {
            return response()->json(['error' => 'Session is not active.'], 422);
        }

        broadcast(new \App\Events\CallSignalingEvent($session, $user->id, $request->signal_data));

        return response()->json(['message' => 'Signal broadcasted.']);
    }

    /**
     * Broadcast a Mushaf error mark to the student.
     */
    public function markMushafError(Request $request, $sessionId)
    {
        $request->validate([
            'surah' => 'required|integer',
            'ayah' => 'required|integer',
            'word_index' => 'required|integer',
        ]);

        $session = CallSession::where('session_id', $sessionId)->firstOrFail();
        $user = $request->user();

        if (!in_array($user->id, [$session->initiator_id, $session->target_id])) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        if ($session->status !== 'active') {
            return response()->json(['error' => 'Session is not active.'], 422);
        }

        broadcast(new \App\Events\MushafErrorMarked($session, $request->only(['surah', 'ayah', 'word_index'])));

        return response()->json(['message' => 'Error marked successfully.']);
    }

    /**
     * End a call session.
     */
    public function endSession(Request $request, $sessionId)
    {
        $session = CallSession::where('session_id', $sessionId)->firstOrFail();
        $user = $request->user();

        if (!in_array($user->id, [$session->initiator_id, $session->target_id, $session->third_party_id])) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $duration = $session->started_at ? now()->diffInSeconds($session->started_at) : 0;

        $session->update([
            'status' => 'completed',
            'ended_at' => now(),
            'duration_seconds' => $duration,
        ]);

        // Notify the other participant that the call ended
        $notifyTarget = ($user->id === $session->initiator_id) ? $session->target_id : $session->initiator_id;
        broadcast(new \App\Events\CallSessionNotificationEvent($session, 'ended', $notifyTarget));

        return response()->json([
            'message' => 'Call ended.',
            'duration' => $duration
        ]);
    }
}
