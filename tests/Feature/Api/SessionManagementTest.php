<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SessionManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_their_sessions()
    {
        $user = User::factory()->create();

        // Simulate a session for the user
        DB::table('sessions')->insert([
            'id' => session()->getId(),
            'user_id' => $user->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'payload' => 'payload',
            'last_activity' => now()->getTimestamp(),
        ]);

        $token = $user->createToken('test-device')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/v1/account/sessions');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'sessions',
                'analytics',
            ],
        ]);
        $response->assertJsonCount(1, 'data.sessions');
    }

    public function test_user_can_terminate_a_session()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-device')->plainTextToken;

        // Simulate a session for the user
        $sessionToTerminate = 'some_other_session_id';
        DB::table('sessions')->insert([
            'id' => $sessionToTerminate,
            'user_id' => $user->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'some_agent',
            'payload' => 'payload',
            'last_activity' => now()->getTimestamp(),
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/v1/account/sessions/{$sessionToTerminate}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('sessions', ['id' => $sessionToTerminate]);
    }

    public function test_user_can_terminate_all_other_sessions()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-device')->plainTextToken;

        // Simulate some other sessions for the user
        for ($i = 0; $i < 3; $i++) {
            DB::table('sessions')->insert([
                'id' => "session_{$i}",
                'user_id' => $user->id,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'some_agent',
                'payload' => 'payload',
                'last_activity' => now()->getTimestamp(),
            ]);
        }

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/v1/account/sessions/terminate-all');

        $response->assertStatus(200);
        $response->assertJson(['data' => ['terminatedSessionsCount' => 3]]);
    }

    public function test_user_can_refresh_token()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/v1/account/sessions/refresh');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'token',
                'expires_at',
            ],
        ]);
    }
}
