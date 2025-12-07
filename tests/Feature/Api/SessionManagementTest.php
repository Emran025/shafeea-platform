<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

use Pest\Laravel;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->token = $this->user->createToken('test-device')->plainTextToken;

    // Simulate a session for the user
    DB::table('sessions')->insert([
        'id' => 'test_session_id',
        'user_id' => $this->user->id,
        'ip_address' => '127.0.0.1',
        'user_agent' => 'Mozilla/5.0',
        'payload' => 'payload',
        'last_activity' => now()->getTimestamp(),
    ]);

    Sanctum::actingAs($this->user);
});

test('user can list their sessions', function () {
    getJson('/api/v1/account/sessions')
        ->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'is_current_device',
                    'last_accessed_at',
                    'device_info',
                ],
            ],
            'pagination',
        ]);
});

test('user can terminate a session', function () {
    $sessionToTerminate = 'some_other_session_id';
    DB::table('sessions')->insert([
        'id' => $sessionToTerminate,
        'user_id' => $this->user->id,
        'ip_address' => '127.0.0.1',
        'user_agent' => 'some_agent',
        'payload' => 'payload',
        'last_activity' => now()->getTimestamp(),
    ]);

    deleteJson("/api/v1/account/sessions/{$sessionToTerminate}")
        ->assertStatus(200)
        ->assertJson(['success' => true]);

    $this->assertDatabaseMissing('sessions', ['id' => $sessionToTerminate]);
});

test('user can terminate all other sessions', function () {
    // Simulate some other sessions for the user
    for ($i = 0; $i < 3; $i++) {
        DB::table('sessions')->insert([
            'id' => "session_{$i}",
            'user_id' => $this->user->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'some_agent',
            'payload' => 'payload',
            'last_activity' => now()->getTimestamp(),
        ]);
    }

    postJson('/api/v1/account/sessions/terminate-all')
        ->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'All other sessions terminated successfully.',
        ]);
});

test('user can refresh token', function () {
    postJson('/api/v1/auth/refresh') // Corrected route
        ->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'data' => [
                'token',
                'expiresAt',
            ],
        ]);
});
