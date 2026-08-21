<?php

namespace Tests\Feature\Api;

use App\Models\Auth\User;
use App\Models\Halaqah\CallSession;
use App\Models\School\School;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class MushafErrorMarkingTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_session_participants_can_mark_errors()
    {
        Event::fake();

        $school = School::factory()->create();
        $teacher = User::factory()->create(['school_id' => $school->id]);
        $student = User::factory()->create(['school_id' => $school->id]);
        $outsider = User::factory()->create(['school_id' => $school->id]);

        $session = CallSession::create([
            'school_id' => $school->id,
            'initiator_id' => $student->id,
            'target_id' => $teacher->id,
            'status' => 'active',
        ]);

        // Outsider attempts to mark an error
        $response = $this->actingAs($outsider)->postJson("/api/v1/calls/{$session->session_id}/mark-error", [
            'surah' => 1,
            'ayah' => 2,
            'word_index' => 3,
        ]);

        $response->assertStatus(403);
        Event::assertNotDispatched(\App\Events\MushafErrorMarked::class);

        // Teacher successfully marks an error
        $response = $this->actingAs($teacher)->postJson("/api/v1/calls/{$session->session_id}/mark-error", [
            'surah' => 1,
            'ayah' => 2,
            'word_index' => 3,
        ]);

        $response->assertStatus(200);
        Event::assertDispatched(\App\Events\MushafErrorMarked::class, function ($e) use ($session) {
            return $e->session->id === $session->id &&
                   $e->wordData['surah'] === 1 &&
                   $e->wordData['word_index'] === 3;
        });
    }
}
