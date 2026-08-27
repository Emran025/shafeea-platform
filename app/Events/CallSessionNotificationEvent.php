<?php

namespace App\Events;

use App\Models\Halaqah\CallSession;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallSessionNotificationEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $session;

    public $action; // 'requested', 'accepted', 'rejected', 'ended'

    public $targetUserId;

    /**
     * Create a new event instance.
     */
    public function __construct(CallSession $session, string $action, int $targetUserId)
    {
        $this->session = $session;
        $this->action = $action;
        $this->targetUserId = $targetUserId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // Broadcast directly to the user's private notification channel
        return new PrivateChannel('user.'.$this->targetUserId);
    }

    public function broadcastAs()
    {
        return 'call_session_notification';
    }

    public function broadcastWith()
    {
        return [
            'session_id' => $this->session->session_id,
            'action' => $this->action,
            'initiator_id' => $this->session->initiator_id,
            'target_id' => $this->session->target_id,
        ];
    }
}
