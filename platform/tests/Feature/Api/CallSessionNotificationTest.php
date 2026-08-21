<?php

namespace Tests\Feature\Api;

use App\Models\Auth\User;
use App\Models\Halaqah\CallSession;
use App\Models\School\School;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class CallSessionNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_rejecting_session_updates_status_and_sends_notification()
    {
        Event::fake();

        $school = School::factory()->create();
        $initiator = User::factory()->create(['school_id' => $school->id]);
        $target = User::factory()->create(['school_id' => $school->id]);
        $outsider = User::factory()->create(['school_id' => $school->id]);

        $session = CallSession::create([
            'school_id' => $school->id,
            'initiator_id' => $initiator->id,
            'target_id' => $target->id,
            'status' => 'requested',
        ]);

        // Outsider attempts to reject
        $response = $this->actingAs($outsider)->postJson("/api/v1/calls/{$session->session_id}/reject");
        $response->assertStatus(403);

        // Target successfully rejects
        $response = $this->actingAs($target)->postJson("/api/v1/calls/{$session->session_id}/reject");
        $response->assertStatus(200);

        $this->assertDatabaseHas('call_sessions', [
            'id' => $session->id,
            'status' => 'rejected',
        ]);

        // Verify that the initiator gets the rejection notification
        Event::assertDispatched(\App\Events\CallSessionNotificationEvent::class, function ($e) use ($session, $initiator) {
            return $e->session->id === $session->id &&
                   $e->action === 'rejected' &&
                   $e->targetUserId === $initiator->id;
        });
    }
}
