<?php

use App\Models\Halaqah\CallSession;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.Auth.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('session.{sessionId}', function ($user, $sessionId) {
    $session = CallSession::where('session_id', $sessionId)->first();
    if (! $session) {
        return false;
    }

    // Only initiator, target, or third_party can listen to this session's events
    return in_array($user->id, [$session->initiator_id, $session->target_id, $session->third_party_id]);
});
