<?php

use App\Models\User;
use App\Models\Admin;
use App\Models\Applicant;
use App\Models\Role;
use App\Models\School;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\getJson;

use Pest\Plugins\Actions;

test('admin applicants index returns a summarized list', function () {
    $school = School::factory()->create();

    // Create an admin user correctly
    $adminUser = User::factory()->create(['school_id' => $school->id]);
    Admin::factory()->create(['user_id' => $adminUser->id]); // This is the key fix

    Sanctum::actingAs($adminUser);

    Applicant::factory()->create(['school_id' => $school->id]);

    $response = getJson('/api/v1/admin/applicants');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'data' => [
                'data' => [
                    '*' => [
                        'id',
                        'application_type',
                        'status',
                        'submitted_at',
                        'user' => [
                            'name',
                            'gender',
                            'residence',
                            'city',
                            'country',
                            'email',
                            'avatar',
                        ],
                    ],
                ],
            ],
            'pagination',
        ]);
});
