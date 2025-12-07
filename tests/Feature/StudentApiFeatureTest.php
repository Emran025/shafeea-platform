<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Student;
use App\Models\Halaqah;
use App\Models\Plan;

class StudentApiFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Optionally authenticate a user if needed
        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'sanctum');
    }

    public function test_can_list_students()
    {
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
    }

    public function test_can_show_a_student()
    {
        $student = Student::factory()->create();
        $response = $this->getJson("/api/v1/students/{$student->id}");
        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $student->id,
                ],
            ]);
    }

    public function test_can_update_a_student()
    {
        $student = Student::factory()->create();
        $payload = [
            'qualification' => 'Updated qualification',
            'memorization_level' => '15', // Correct field name and type
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
        $this->assertEquals('Updated qualification', $student->qualification);
        $this->assertEquals('15', $student->memorization_level);
        $this->assertEquals('active', $student->status);
    }

    public function test_can_get_student_follow_up()
    {
        $student = Student::factory()->create();
        $response = $this->getJson("/api/v1/students/{$student->id}/follow-up");
        $response->assertOk()
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'frequency',
                ]
            ]);
    }

    public function test_can_update_student_follow_up()
    {
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
    }

    public function test_can_assign_student_to_halaqa()
    {
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
    }

    public function test_can_take_action_on_student()
    {
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
    }
}
