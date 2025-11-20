<?php

namespace Tests\Feature\Api;

use App\Models\User;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AccountTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function an_authenticated_user_can_get_their_profile()
    {

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/account/profile');

        $response->assertSuccessful();
        $response->assertJson([
            'success' => true,
            'data' => [

                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar,
                ],
                'role' => 'user',
            ],
        ]);
    }

    /** @test */
    public function an_unauthenticated_user_cannot_get_a_profile()
    {
        $response = $this->getJson('/api/v1/account/profile');

        $response->assertUnauthorized();
    }

    /** @test */

    public function an_admin_user_has_the_correct_role_in_their_profile()
    {
        $user = User::factory()->create();
        \App\Models\Admin::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/account/profile');

        $response->assertSuccessful();

        $response->assertJsonPath('data.role', 'admin');
    }

    /** @test */
    public function a_teacher_user_has_the_correct_role_in_their_profile()
    {
        $user = User::factory()->create();
        \App\Models\Teacher::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/account/profile');

        $response->assertSuccessful();
        $response->assertJsonPath('data.role', 'teacher');
    }

    /** @test */
    public function a_student_user_has_the_correct_role_in_their_profile()
    {
        $user = User::factory()->create();
        \App\Models\Student::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/account/profile');

        $response->assertSuccessful();
        $response->assertJsonPath('data.role', 'student');
    }
}
