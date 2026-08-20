<?php

namespace App\Events;

use App\Models\Halaqah\CallSession;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallSignalingEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $session;
    public $senderId;
    public $signalData;

    /**
     * Create a new event instance.
     *
     * @param CallSession $session
     * @param int $senderId
     * @param array $signalData SDP offer/answer or ICE candidate
     */
    public function __construct(CallSession $session, int $senderId, array $signalData)
    {
        $this->session = $session;
        $this->senderId = $senderId;
        $this->signalData = $signalData;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('session.' . $this->session->session_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'call_signal';
    }
}
