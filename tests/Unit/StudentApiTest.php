<?php

// use App\Models\Student;
// use App\Models\User;
// use App\Models\Plan;
// use App\Models\Halaqah;
// use Laravel\Sanctum\Sanctum;

// beforeEach(function () {
//     $this->user = User::factory()->create();
//     Sanctum::actingAs($this->user, ['*']);
// });

// test('it returns paginated students', function () {
//     Student::factory()->count(15)->create();

//     $response = $this->getJson('/api/v1/students?limit=10');

//     $response->assertOk()
//              ->assertJsonStructure([
//                 'success',
//                 'data' => [
//                     'data',
//                     'pagination' => [
//                         'total',
//                         'per_page',
//                         'current_page',
//                         'total_pages',
//                     ],
//                 ],
//              ]);
// });

// test('it shows a single student', function () {
//     $student = Student::factory()->create();

//     $response = $this->getJson("/api/v1/students/{$student->id}");

//     $response->assertOk()
//              ->assertJson([
//                 'success' => true,
//                 'data' => [
//                     'id' => $student->id,
//                     'user_id' => $student->user_id,
//                 ],
//              ]);
// });
// test('it updates a student', function () {
//     $student = Student::factory()->create();
//     $user = $student->user;

//     $payload = [
//         'qualification' => 'Updated qualification',
//         'memorization_level' => 'Advanced',
//         'status' => 'active',
//         'user' => [
//             'name' => 'Updated Name',
//             'email' => 'updated-email@example.com',
//         ],
//     ];

//     $response = $this->putJson("/api/v1/students/{$student->id}", $payload);

//     $response->assertOk()
//              ->assertJson([
//                  'success' => true,
//                  'message' => "Student with ID {$student->id} updated.",
//              ]);

//     $student->refresh();
//     expect($student->qualification)->toBe('Updated qualification');
//     expect($student->memorization_level)->toBe('Advanced');
//     expect($student->status)->toBe('active');

//     $user->refresh();
//     expect($user->name)->toBe('Updated Name');
//     expect($user->email)->toBe('updated-email@example.com');
// });



// test('it gets student follow up plan', function () {
//     $student = Student::factory()->create();
//     $plan = Plan::factory()->create();

//     // Create an enrollment linking the student and plan
//     $student->enrollments()->create([
//         'halaqah_id' => Halaqah::factory()->create()->id,
//         'plan_id' => $plan->id,
//         'enrolled_at' => now(),
//     ]);

//     $response = $this->getJson("/api/v1/students/{$student->id}/follow-up");

//     $response->assertOk()
//              ->assertJson([
//                 'success' => true,
//                 'data' => [
//                     'plan' => [
//                         'id' => $plan->id,
//                         'name' => $plan->name,
//                     ],
//                 ],
//              ]);
// });

// test('it updates student follow up plan', function () {
//     $student = Student::factory()->create();
//     $plan = Plan::factory()->create();

//     $payload = ['plan_id' => $plan->id];

//     $response = $this->putJson("/api/v1/students/{$student->id}/follow-up", $payload);

//     $response->assertOk()
//              ->assertJson([
//                 'success' => true,
//                 'message' => "Follow-up plan for student {$student->id} updated",
//              ]);

//     // Check enrollment updated or created
//     $this->assertDatabaseHas('enrollments', [
//         'student_id' => $student->id,
//         'plan_id' => $plan->id,
//     ]);
// });

// test('it assigns student to halaqa', function () {
//     $student = Student::factory()->create();
//     $halaqah = Halaqah::factory()->create();
//     $plan = Plan::factory()->create();

//     $payload = [
//         'halaqah_id' => $halaqah->id,
//         'plan_id' => $plan->id,
//     ];

//     $response = $this->postJson("/api/v1/students/{$student->id}/assign", $payload);

//     $response->assertOk()
//              ->assertJson([
//                 'success' => true,
//                 'message' => "Student {$student->id} assigned to halaqa",
//              ]);

//     $this->assertDatabaseHas('enrollments', [
//         'student_id' => $student->id,
//         'halaqah_id' => $halaqah->id,
//         'plan_id' => $plan->id,
//     ]);
// });

// test('it takes action on student', function () {
//     $student = Student::factory()->create();

//     $payload = [
//         'action' => 'suspend', // Make sure 'suspend' is a valid action in your controller
//         'reason' => 'Behavioral issues',
//     ];

//     $response = $this->postJson("/api/v1/students/{$student->id}/actions", $payload);

//     $response->assertOk()
//              ->assertJson([
//                 'success' => true,
//                 'message' => "Action taken on student {$student->id}",
//              ]);

//     // Optionally, check if the student status or any related field was updated in DB
// });