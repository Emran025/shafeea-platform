<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AccountTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function an_authenticated_user_can_get_their_profile()
    {
        $role = Role::create(['name' => 'student', 'description' => 'Student']);
        $user = User::factory()->create();
        $user->roles()->attach($role);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/account/profile');

        $response->assertSuccessful();
        $response->assertJson([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'role' => [
                    'id' => $role->id,
                    'name' => $role->name,
                ],
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
    public function a_user_without_a_role_has_a_null_role_in_their_profile()
    {
        $user = User::factory()->create();
        // Note: No role is attached to the user.

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/account/profile');

        $response->assertSuccessful();
        $response->assertJson([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => null,
            ],
        ]);
    }
}
