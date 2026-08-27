<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Halaqah\CallSession;
use App\Events\CallSessionNotificationEvent;
use App\Events\CallSignalingEvent;
use Illuminate\Support\Str;

class CallSessionController extends Controller
{
    public function requestSession(Request $request)
    {
        $request->validate([
            'target_id' => 'required|exists:users,id',
            'third_party_id' => 'nullable|exists:users,id',
        ]);

        // Max 3 participants logic enforced by schema (initiator, target, third_party)
        
        $session = CallSession::create([
            'session_id' => Str::uuid()->toString(),
            'initiator_id' => $request->user()->id,
            'target_id' => $request->target_id,
            'third_party_id' => $request->third_party_id,
            'status' => 'pending',
        ]);

        broadcast(new CallSessionNotificationEvent($session, 'requested', $session->target_id))->toOthers();
        
        if ($session->third_party_id) {
            broadcast(new CallSessionNotificationEvent($session, 'requested', $session->third_party_id))->toOthers();
        }

        return response()->json(['session' => $session]);
    }

    public function updateStatus(Request $request, $sessionId)
    {
        $request->validate([
            'status' => 'required|in:active,ended,rejected',
        ]);

        $session = CallSession::where('session_id', $sessionId)->firstOrFail();
        
        // Only participants can update status
        if (!in_array($request->user()->id, [$session->initiator_id, $session->target_id, $session->third_party_id])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $session->update(['status' => $request->status]);

        // Notify other participants
        $participants = array_filter([$session->initiator_id, $session->target_id, $session->third_party_id]);
        foreach ($participants as $participantId) {
            if ($participantId !== $request->user()->id) {
                broadcast(new CallSessionNotificationEvent($session, $request->status, $participantId))->toOthers();
            }
        }

        return response()->json(['session' => $session]);
    }

    public function signal(Request $request, $sessionId)
    {
        $request->validate([
            'signal_data' => 'required|array',
        ]);

        $session = CallSession::where('session_id', $sessionId)->firstOrFail();
        
        if (!in_array($request->user()->id, [$session->initiator_id, $session->target_id, $session->third_party_id])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Store public keys if they are part of the signal
        if (isset($request->signal_data['type']) && $request->signal_data['type'] === 'rsa_pub_key') {
            if ($request->user()->id === $session->initiator_id) {
                $session->update(['initiator_rsa_pub' => $request->signal_data['key']]);
            } elseif ($request->user()->id === $session->target_id) {
                $session->update(['target_rsa_pub' => $request->signal_data['key']]);
            }
        }

        broadcast(new CallSignalingEvent($session, $request->user()->id, $request->signal_data))->toOthers();

        return response()->json(['status' => 'Signal sent']);
    }
}
