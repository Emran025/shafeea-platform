<?php

namespace Tests\Feature\Api;

use App\Models\Enrollment;
use App\Models\Halaqah;
use App\Models\Plan;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HalaqaApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_assign_students_to_halaqa()
    {
        // 1. Arrange
        $user = User::factory()->create();
        $teacher = Teacher::factory()->create(['user_id' => $user->id]);
        $halaqa = Halaqah::factory()->create();
        $halaqa->teachers()->attach($teacher);
        $students = Student::factory()->count(3)->create();
        $studentIds = $students->pluck('id')->toArray();

        // Create the default plan
        Plan::factory()->create(['id' => 1]);

        // 2. Act
        $response = $this->actingAs($user, 'sanctum')->postJson("/api/v1/halaqas/{$halaqa->id}/assign-students", [
            'student_ids' => $studentIds,
        ]);

        // 3. Assert
        $response->assertSuccessful();
        $this->assertDatabaseCount('enrollments', 3);
    }

    public function test_assign_students_with_existing_plan()
    {
        // 1. Arrange
        $user = User::factory()->create();
        $teacher = Teacher::factory()->create(['user_id' => $user->id]);
        $halaqa = Halaqah::factory()->create();
        $halaqa->teachers()->attach($teacher);
        $student = Student::factory()->create();

        // Create the default plan and a custom plan
        Plan::factory()->create(['id' => 1]);
        $customPlan = Plan::factory()->create();

        // Create a previous enrollment for the student with the custom plan
        Enrollment::factory()->create([
            'student_id' => $student->id,
            'plan_id' => $customPlan->id,
        ]);

        // 2. Act
        $response = $this->actingAs($user, 'sanctum')->postJson("/api/v1/halaqas/{$halaqa->id}/assign-students", [
            'student_ids' => [$student->id],
        ]);

        // 3. Assert
        $response->assertSuccessful();
        $this->assertDatabaseHas('enrollments', [
            'student_id' => $student->id,
            'halaqah_id' => $halaqa->id,
            'plan_id' => $customPlan->id,
        ]);
    }

    public function test_assign_student_without_plan_uses_default_plan()
    {
        // 1. Arrange
        $user = User::factory()->create();
        $teacher = Teacher::factory()->create(['user_id' => $user->id]);
        $halaqa = Halaqah::factory()->create();
        $halaqa->teachers()->attach($teacher);
        $student = Student::factory()->create();

        // Create the default plan
        Plan::factory()->create(['id' => 1]);

        // 2. Act
        $response = $this->actingAs($user, 'sanctum')->postJson("/api/v1/halaqas/{$halaqa->id}/assign-students", [
            'student_ids' => [$student->id],
        ]);

        // 3. Assert
        $response->assertSuccessful();
        $this->assertDatabaseHas('enrollments', [
            'student_id' => $student->id,
            'halaqah_id' => $halaqa->id,
            'plan_id' => 1,
        ]);
    }

    public function test_assign_students_fails_if_default_plan_is_missing()
    {
        // 1. Arrange
        $user = User::factory()->create();
        $teacher = Teacher::factory()->create(['user_id' => $user->id]);
        $halaqa = Halaqah::factory()->create();
        $halaqa->teachers()->attach($teacher);
        $student = Student::factory()->create();

        // 2. Act
        $response = $this->actingAs($user, 'sanctum')->postJson("/api/v1/halaqas/{$halaqa->id}/assign-students", [
            'student_ids' => [$student->id],
        ]);

        // 3. Assert
        $response->assertStatus(400);
        $response->assertJson(['message' => 'Default plan with ID 1 does not exist.']);
    }
}
