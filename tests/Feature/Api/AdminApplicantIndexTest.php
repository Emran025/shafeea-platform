<?php

use App\Models\User;
use App\Models\Admin;
use App\Models\Applicant;
use App\Models\Role;
use App\Models\School;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\getJson;

test('admin applicants index returns a summarized list', function () {
    $school = School::factory()->create();
    $adminUser = User::factory()->create(['school_id' => $school->id]);
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $adminUser->roles()->attach($adminRole);
    Sanctum::actingAs($adminUser);

    Applicant::factory()->withSchool()->create(['school_id' => $school->id]);

    $response = getJson('/api/v1/admin/applicants');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                'data' => [
                    '*' => [
                        'id',
                        'application_type',
                        'status',
                        'user' => [
                            'name',
                            'email',
                            'avatar',
                        ],
                    ],
                ],
            ],
        ]);
});
