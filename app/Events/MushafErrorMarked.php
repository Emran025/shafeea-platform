<?php

namespace App\Events;

use App\Models\Halaqah\CallSession;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MushafErrorMarked implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $session;
    public $wordData;

    /**
     * Create a new event instance.
     *
     * @param CallSession $session The active call session
     * @param array $wordData Contains word identification (e.g., surah, ayah, word index)
     */
    public function __construct(CallSession $session, array $wordData)
    {
        $this->session = $session;
        $this->wordData = $wordData;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Broadcast securely on a private channel for this specific session
        return [
            new PrivateChannel('session.' . $this->session->session_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'mark_word_error';
    }
}
