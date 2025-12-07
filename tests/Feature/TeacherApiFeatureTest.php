<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Halaqah;

class TeacherApiFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Optionally authenticate a user if needed
        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'sanctum');
    }

    public function test_can_list_teachers()
    {
        Teacher::factory()->count(5)->create();
        $response = $this->getJson('/api/v1/teachers');
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

    public function test_can_show_a_teacher()
    {
        $teacher = Teacher::factory()->create();
        $response = $this->getJson("/api/v1/teachers/{$teacher->id}");
        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $teacher->id,
                ],
            ]);
    }

    public function test_can_update_a_teacher()
    {
        $teacher = Teacher::factory()->create();
        $payload = [
            'bio' => 'Updated bio',
            'experience_years' => 20,
        ];
        $response = $this->putJson("/api/v1/teachers/{$teacher->id}", $payload);
        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Teacher updated successfully',
            ]);
        $teacher->refresh();
        $this->assertEquals('Updated bio', $teacher->bio);
        $this->assertEquals(20, $teacher->experience_years);
    }

    public function test_can_assign_teacher_to_halaqas()
    {
        $teacher = Teacher::factory()->create();
        $halaqahs = Halaqah::factory()->count(2)->create();
        $halaqaIds = $halaqahs->pluck('id')->toArray();
        $response = $this->postJson("/api/v1/teachers/{$teacher->id}/halaqas", [
            'halaqaIds' => $halaqaIds
        ]);
        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Teacher assigned to halaqas successfully.',
            ]);
        foreach ($halaqaIds as $id) {
            $this->assertDatabaseHas('halaqah_teacher', [
                'halaqah_id' => $id,
                'teacher_id' => $teacher->id,
            ]);
        }
    }

    public function test_can_list_teacher_halaqas()
    {
        $teacher = Teacher::factory()->create();
        $halaqahs = Halaqah::factory()->count(2)->create();
        $teacher->halaqahs()->attach($halaqahs);
        $response = $this->getJson("/api/v1/teachers/{$teacher->id}/halaqas");
        $response->assertOk()
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    'data'
                ]
            ]);
    }
} 