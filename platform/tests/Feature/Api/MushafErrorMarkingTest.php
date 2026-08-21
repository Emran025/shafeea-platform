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

        $school = new School(['name' => 'School A', 'domain' => 'a.com', 'phone' => '1', 'email' => 'a@a.com', 'address' => 'A', 'identity_title' => 'A', 'identity_purpose' => 'A', 'identity_owner' => 'A', 'identity_canonical_url' => 'A']);
        $school->save();
        
        $teacher = new User(['name' => 'Teacher', 'email' => 't@test.com', 'password' => '123', 'school_id' => $school->id]);
        $teacher->save();
        $student = new User(['name' => 'Student', 'email' => 's@test.com', 'password' => '123', 'school_id' => $school->id]);
        $student->save();
        $outsider = new User(['name' => 'Outsider', 'email' => 'o@test.com', 'password' => '123', 'school_id' => $school->id]);
        $outsider->save();

        $session = CallSession::create([
            'session_id' => 'sess_456',
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
