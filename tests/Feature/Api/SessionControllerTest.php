<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SessionControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_user_sessions()
    {
        $user = User::factory()->create();
        $this->seedSessions($user->id);

        Sanctum::actingAs($user, ['*'], 'web');

        $response = $this->getJson(route('account.sessions.list'));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'is_current_device',
                        'last_accessed_at',
                        'device_info' => [
                            'device_id',
                            'device_model',
                            'manufacturer',
                            'os_version',
                            'app_version',
                            'timezone',
                            'locale',
                            'push_notification_token',
                        ],
                    ],
                ],
            ]);
    }

    private function seedSessions($userId)
    {
        DB::table('sessions')->insert([
            [
                'id' => 'session_1',
                'user_id' => $userId,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'payload' => 'payload',
                'last_activity' => now()->subMinutes(10)->getTimestamp(),
                'device_id' => 'device_1',
                'model' => 'Pixel 4',
                'manufacturer' => 'Google',
                'os_version' => '11',
                'app_version' => '1.0.0',
                'timezone' => 'UTC',
                'locale' => 'en_US',
                'fcm_token' => 'fcm_token_1',
                'login_time' => now()->subMinutes(20),
            ],
            [
                'id' => 'session_2',
                'user_id' => $userId,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
                'payload' => 'payload',
                'last_activity' => now()->subMinutes(5)->getTimestamp(),
                'device_id' => 'device_2',
                'model' => 'iPhone 12',
                'manufacturer' => 'Apple',
                'os_version' => '14.6',
                'app_version' => '1.0.1',
                'timezone' => 'UTC',
                'locale' => 'en_US',
                'fcm_token' => 'fcm_token_2',
                'login_time' => now()->subMinutes(15),
            ],
        ]);
    }
}
