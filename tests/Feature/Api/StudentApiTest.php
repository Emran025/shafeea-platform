<?php

use App\Models\Student;
use App\Models\User;
use App\Models\Halaqah;
use App\Models\Plan;
use App\Models\Tracking;
use App\Models\TrackingDetail;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Students API', function () {
    beforeEach(function () {
        // Always authenticate as a user
        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'sanctum');
    });
    it('can list students with pagination', function () {
        Student::factory()->count(15)->create();
        $response = $this->getJson('/api/v1/students?limit=10');
        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'pagination' => [
                    'total',
                    'per_page',
                    'current_page',
                    'total_pages',
                ],
            ]);
    });
    it('can show a student', function () {
        $student = Student::factory()->create();
        $response = $this->getJson("/api/v1/students/{$student->id}");
        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $student->id,
                ],
            ]);
    });
    it('can update a student', function () {
        $student = Student::factory()->create();
        $payload = [
            'qualification' => 'Updated qualification',
            'memorization_level' => '15', // The model expects a string
            'status' => 'active',
            'name' => $student->user->name,
            'email' => $student->user->email,
        ];
        $response = $this->putJson("/api/v1/students/{$student->id}", $payload);
        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Student updated successfully.',
            ]);
        $student->refresh();
        expect($student->qualification)->toBe('Updated qualification');
        expect($student->memorization_level)->toBe('15');
        expect($student->status)->toBe('active');
    });
    it('validates student update', function () {
        $student = Student::factory()->create();
        $payload = [ 'gender' => 'invalid-gender' ];
        $response = $this->putJson("/api/v1/students/{$student->id}", $payload);
        $response->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'errors']);
    });
    it('can get student follow up', function () {
        $student = Student::factory()->create();
        $response = $this->getJson("/api/v1/students/{$student->id}/follow-up");
        $response->assertOk()
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonIsObject('data')
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'details'
                ]
            ]);
    });
    it('can update student follow up', function () {
        $student = Student::factory()->create();
        $payload = [
            'studentId' => $student->id,
            'frequency' => 'weekly',
            'details' => [
                ['type' => 'memorization', 'unit' => 'page', 'amount' => 1],
            ],
        ];
        $response = $this->putJson("/api/v1/students/{$student->id}/follow-up", $payload);
        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Follow-up plan updated.',
            ]);
    });
    it('can assign student to halaqa', function () {
        $student = Student::factory()->create();
        $teacher = \App\Models\Teacher::factory()->create();
        $halaqah = Halaqah::factory()->create();
        $halaqah->teachers()->attach($teacher);
        $payload = [
            'halaqaId' => $halaqah->id,
            'studentId' => $student->id,
            'enrolled_at' => now()->toDateTimeString(), // Add missing enrolled_at
        ];
        $response = $this->postJson("/api/v1/students/{$student->id}/assign", $payload);
        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Student assigned to halaqa successfully.',
            ]);
    });
    it('can take action on student', function () {
        $student = Student::factory()->create();
        $payload = [
            'action' => 'suspend',
            'reason' => 'Violation of academy rules.',
        ];
        $response = $this->postJson("/api/v1/students/{$student->id}/actions", $payload);
        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Action completed successfully.',
            ]);
    });
    // --- Plan Management ---
    it('can list all plans for a student', function () {
        $student = Student::factory()->create();
        $enrollment = \App\Models\Enrollment::factory()->create(['student_id' => $student->id]);
        $plan = Plan::factory()->create();
        $enrollment->plans()->attach($plan->id);

        $response = $this->getJson("/api/v1/students/{$student->id}/plans");
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    });
    it('can get active plan for a student', function () {
        $student = Student::factory()->create();
        $enrollment = \App\Models\Enrollment::factory()->create(['student_id' => $student->id]);
        $plan = Plan::factory()->create();
        $enrollment->plans()->attach($plan->id, ['is_current' => true]);

        $response = $this->getJson("/api/v1/students/{$student->id}/plans/active");
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    });
    it('can create a plan for a student', function () {
        $student = Student::factory()->create();
        \App\Models\Enrollment::factory()->create(['student_id' => $student->id]);
        $payload = Plan::factory()->make([
            'start_date' => now()->toDateString(),
            'end_date' => now()->addMonth()->toDateString(),
            'frequency_type_id' => \App\Models\FrequencyType::factory()->create()->id,
        ])->toArray();

        $response = $this->postJson("/api/v1/students/{$student->id}/plans", $payload);
        $response->assertStatus(201)->assertJsonStructure(['success', 'data', 'message']);
    });
    it('can update a plan', function () {
        $plan = Plan::factory()->create();
        $teacher = \App\Models\Teacher::factory()->create();
        $halaqah = Halaqah::factory()->create();
        $halaqah->teachers()->attach($teacher);
        $frequencyType = \App\Models\FrequencyType::factory()->create();
        $payload = [
            'name' => 'Updated Plan Name',
            'start_date' => now()->toDateString(),
            'frequency_type_id' => $frequencyType->id,
            'halaqah_id' => $halaqah->id,
        ];
        $response = $this->putJson("/api/v1/students/plans/{$plan->id}", $payload);
        $response->assertOk()->assertJsonStructure(['success', 'data', 'message']);
    });
    it('can delete a plan', function () {
        $plan = Plan::factory()->create();
        $response = $this->deleteJson("/api/v1/students/plans/{$plan->id}");
        $response->assertOk()->assertJson(['success' => true, 'message' => 'Plan deleted.']);
    });
    // --- Tracking Management ---
    it('can list all trackings for a student', function () {
        $student = Student::factory()->create();
        $enrollment = \App\Models\Enrollment::factory()->create(['student_id' => $student->id]);
        Tracking::factory()->create(['enrollment_id' => $enrollment->id]);
        $response = $this->getJson("/api/v1/students/{$student->id}/trackings");
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    });
    it('can create a tracking for a plan', function () {
        $enrollment = \App\Models\Enrollment::factory()->create();
        $payload = Tracking::factory()->make(['date' => now()->toDateString()])->toArray();
        $response = $this->postJson("/api/v1/students/enrollments/{$enrollment->id}/trackings", $payload);
        $response->assertStatus(200)->assertJsonStructure(['success', 'data', 'message']);
    });
    it('can update a tracking', function () {
        $tracking = Tracking::factory()->create();
        $payload = $tracking->toArray();
        $payload['note'] = 'Updated note';
        $response = $this->putJson("/api/v1/students/trackings/{$tracking->id}", $payload);
        $response->assertOk()->assertJsonStructure(['success', 'data', 'message']);
    });
    it('can delete a tracking', function () {
        $tracking = Tracking::factory()->create();
        $response = $this->deleteJson("/api/v1/students/trackings/{$tracking->id}");
        $response->assertOk()->assertJson(['success' => true, 'message' => 'Tracking deleted.']);
    });
    // --- Tracking Details ---
    it('can list tracking details', function () {
        $tracking = Tracking::factory()->create();
        TrackingDetail::factory()->count(2)->create(['tracking_id' => $tracking->id]);
        $response = $this->getJson("/api/v1/students/trackings/{$tracking->id}/details");
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    });
    it('can add a tracking detail', function () {
        $tracking = Tracking::factory()->create();
        $payload = TrackingDetail::factory()->make()->toArray();
        $response = $this->postJson("/api/v1/students/trackings/{$tracking->id}/details", $payload);
        $response->assertStatus(200)->assertJsonStructure(['success', 'data', 'message']);
    });
    it('can delete a tracking detail', function () {
        $detail = TrackingDetail::factory()->create();
        $response = $this->deleteJson("/api/v1/students/tracking-details/{$detail->id}");
        $response->assertOk()->assertJson(['success' => true, 'message' => 'Tracking detail deleted.']);
    });
});
