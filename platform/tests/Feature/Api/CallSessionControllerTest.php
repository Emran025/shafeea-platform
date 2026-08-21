<?php

namespace Tests\Feature\Api;

use App\Models\Auth\User;
use App\Models\School\School;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CallSessionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_cannot_request_session_across_different_schools()
    {
        $schoolA = School::factory()->create();
        $schoolB = School::factory()->create();

        $userA = User::factory()->create(['school_id' => $schoolA->id]);
        $userB = User::factory()->create(['school_id' => $schoolB->id]);

        $response = $this->actingAs($userA)->postJson('/api/v1/calls/request', [
            'target_id' => $userB->id,
        ]);

        $response->assertStatus(403)
                 ->assertJson(['error' => 'Users must belong to the same school to initiate a call.']);
    }

    public function test_can_request_session_within_same_school()
    {
        $school = School::factory()->create();

        $userA = User::factory()->create(['school_id' => $school->id]);
        $userB = User::factory()->create(['school_id' => $school->id]);

        $response = $this->actingAs($userA)->postJson('/api/v1/calls/request', [
            'target_id' => $userB->id,
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['message', 'session' => ['session_id']]);
    }
}
