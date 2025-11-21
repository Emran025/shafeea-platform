<?php

use App\Models\User;
use App\Models\Admin;
use App\Models\Applicant;
use App\Models\Role;
use App\Models\School;
use App\Models\Student;
use App\Models\Teacher;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\postJson;
use function Pest\Laravel\getJson;

test('a user can submit an application without a school', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $applicationData = [
        'application_type' => 'teacher',
        'bio' => 'This is my bio.',
        'qualifications' => 'These are my qualifications.',
        'intent_statement' => 'This is my intent statement.',
    ];

    $response = postJson('/api/v1/applicants', $applicationData);

    $response->assertStatus(201);
    $this->assertDatabaseHas('applicants', [
        'user_id' => $user->id,
        'school_id' => null,
    ]);
});

test('a user can submit an application with a specific school', function () {
    $user = User::factory()->create();
    $school = School::factory()->create();
    Sanctum::actingAs($user);

    $applicationData = [
        'application_type' => 'teacher',
        'bio' => 'This is my bio.',
        'qualifications' => 'These are my qualifications.',
        'intent_statement' => 'This is my intent statement.',
        'school_id' => $school->id,
    ];

    $response = postJson('/api/v1/applicants', $applicationData);

    $response->assertStatus(201);
    $this->assertDatabaseHas('applicants', [
        'user_id' => $user->id,
        'school_id' => $school->id,
    ]);
});

test('an admin can see applicants for their school and unassigned applicants', function () {
    $schoolA = School::factory()->create();
    $schoolB = School::factory()->create();

    $adminUser = User::factory()->create(['school_id' => $schoolA->id]);
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $adminUser->roles()->attach($adminRole);
    Sanctum::actingAs($adminUser);

    // Applicant for admin's school
    Applicant::factory()->withSchool()->create(['school_id' => $schoolA->id]);
    // Applicant without a school
    Applicant::factory()->create(['school_id' => null]);
    // Applicant for another school (should not be visible)
    Applicant::factory()->withSchool()->create(['school_id' => $schoolB->id]);

    $response = getJson('/api/v1/admin/applicants');

    $response->assertStatus(200)
        ->assertJsonCount(2, 'data.data');
});

test('an admin can approve an unassigned application and it gets assigned to their school', function () {
    $school = School::factory()->create();
    $adminUser = User::factory()->create(['school_id' => $school->id]);
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $adminUser->roles()->attach($adminRole);
    Sanctum::actingAs($adminUser);

    $applicantUser = User::factory()->create(['school_id' => null]);
    $applicant = Applicant::factory()->create(['user_id' => $applicantUser->id, 'school_id' => null]);

    $response = postJson("/api/v1/admin/applicants/{$applicant->id}/approve");

    $response->assertStatus(200);

    $this->assertDatabaseHas('users', [
        'id' => $applicantUser->id,
        'school_id' => $school->id,
    ]);

    $this->assertDatabaseHas('applicants', [
        'id' => $applicant->id,
        'status' => 'approved',
    ]);

    $this->assertDatabaseHas('students', [
        'user_id' => $applicantUser->id,
        'bio' => $applicant->bio,
    ]);
});

test('an admin cannot see applicants for other schools', function () {
    $schoolA = School::factory()->create();
    $schoolB = School::factory()->create();
    $adminUser = User::factory()->create(['school_id' => $schoolA->id]);
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $adminUser->roles()->attach($adminRole);
    Sanctum::actingAs($adminUser);

    $applicantForSchoolB = Applicant::factory()->withSchool()->create(['school_id' => $schoolB->id]);

    // Attempt to get the applicant from another school
    $response = getJson("/api/v1/admin/applicants/{$applicantForSchoolB->id}");
    $response->assertStatus(403);

    // Attempt to approve the applicant from another school
    $response = postJson("/api/v1/admin/applicants/{$applicantForSchoolB->id}/approve");
    $response->assertStatus(403);
});

test('an admin can reject an application', function () {
    $school = School::factory()->create();
    $adminUser = User::factory()->create(['school_id' => $school->id]);
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $adminUser->roles()->attach($adminRole);
    Sanctum::actingAs($adminUser);

    $applicant = Applicant::factory()->create();

    $rejectionData = ['rejection_reason' => 'Does not meet requirements.'];
    $response = postJson("/api/v1/admin/applicants/{$applicant->id}/reject", $rejectionData);

    $response->assertStatus(200);
    $this->assertDatabaseHas('applicants', [
        'id' => $applicant->id,
        'status' => 'rejected',
        'rejection_reason' => 'Does not meet requirements.',
    ]);
});

test('a user with an existing role cannot submit an application', function () {
    $user = User::factory()->create();
    Teacher::factory()->create(['user_id' => $user->id]);
    Sanctum::actingAs($user);

    $applicationData = [
        'application_type' => 'student',
        'bio' => 'This is my bio.',
        'qualifications' => 'These are my qualifications.',
        'intent_statement' => 'This is my intent statement.',
    ];

    $response = postJson('/api/v1/applicants', $applicationData);

    $response->assertStatus(422);
});

test('a user cannot submit a second application while one is open', function () {
    $user = User::factory()->create();
    Applicant::factory()->create(['user_id' => $user->id, 'status' => 'pending']);
    Sanctum::actingAs($user);

    $applicationData = [
        'application_type' => 'student',
        'bio' => 'This is my bio.',
        'qualifications' => 'These are my qualifications.',
        'intent_statement' => 'This is my intent statement.',
    ];

    $response = postJson('/api/v1/applicants', $applicationData);

    $response->assertStatus(422);
});
