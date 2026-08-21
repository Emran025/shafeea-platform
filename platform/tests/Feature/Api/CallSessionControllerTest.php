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
        $schoolA = new School(['name' => 'School A', 'domain' => 'a.com', 'phone' => '1', 'email' => 'a@a.com', 'address' => 'A', 'identity_title' => 'A', 'identity_purpose' => 'A', 'identity_owner' => 'A', 'identity_canonical_url' => 'A']);
        $schoolA->save();
        $schoolB = new School(['name' => 'School B', 'domain' => 'b.com', 'phone' => '2', 'email' => 'b@b.com', 'address' => 'B', 'identity_title' => 'B', 'identity_purpose' => 'B', 'identity_owner' => 'B', 'identity_canonical_url' => 'B']);
        $schoolB->save();

        $userA = new User(['name' => 'User A', 'email' => 'ua@test.com', 'password' => '123', 'school_id' => $schoolA->id]);
        $userA->save();
        $userB = new User(['name' => 'User B', 'email' => 'ub@test.com', 'password' => '123', 'school_id' => $schoolB->id]);
        $userB->save();

        $response = $this->actingAs($userA)->postJson('/api/v1/calls/request', [
            'target_id' => $userB->id,
        ]);

        $response->assertStatus(403)
                 ->assertJson(['error' => 'Users must belong to the same school to initiate a call.']);
    }

    public function test_can_request_session_within_same_school()
    {
        $school = new School(['name' => 'School A', 'domain' => 'a.com', 'phone' => '1', 'email' => 'a@a.com', 'address' => 'A', 'identity_title' => 'A', 'identity_purpose' => 'A', 'identity_owner' => 'A', 'identity_canonical_url' => 'A']);
        $school->save();

        $userA = new User(['name' => 'User A', 'email' => 'ua@test.com', 'password' => '123', 'school_id' => $school->id]);
        $userA->save();
        $userB = new User(['name' => 'User B', 'email' => 'ub@test.com', 'password' => '123', 'school_id' => $school->id]);
        $userB->save();

        $response = $this->actingAs($userA)->postJson('/api/v1/calls/request', [
            'target_id' => $userB->id,
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['message', 'session' => ['session_id']]);
    }
}
