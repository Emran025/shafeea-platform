<?php

// tests/Feature/ApiFeatureTest.php

use App\Models\Halaqah;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\Teacher;
use App\Models\User;
use Faker\Generator as Faker;
use Illuminate\Foundation\Testing\RefreshDatabase;

// 1. Use RefreshDatabase to ensure a clean slate for every test.
uses(Tests\TestCase::class, RefreshDatabase::class);

// 2. A global supervisor will be created and authenticated before each test.
beforeEach(function () {
    // Create a supervisor using its factory
    $supervisor = User::factory()->create();
    // Authenticate the user for all subsequent API requests in the test
    $this->actingAs($supervisor, 'sanctum');
});


// -------------------------------------
// Authentication & Account API
// -------------------------------------
describe('Auth & Account API', function () {
    it('handles login requests with valid credentials', function () {
        // Arrange: Create a user to log in with
        $user = User::factory()->create(['password' => bcrypt($password = 'i-am-a-password')]);

        // Act & Assert
        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => $password,
        ])
            ->assertOk()
            ->assertJsonStructure(['token', 'user']);
    });

    it('handles fetching the current user profile', function () {
        $this->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonStructure(['user' => ['id', 'status', 'name', 'email']]);
    });

    it('handles listing active sessions', function () {
        $this->getJson('/api/v1/account/sessions')
             ->assertOk()
             ->assertJsonStructure(['data']);
    });

    it('handles session termination', function () {
        // Arrange: The endpoint needs an ID, even if it's just for the route path
        $sessionId = 'session_12345';

        // Act & Assert
        $this->deleteJson("/api/v1/account/sessions/{$sessionId}")
             ->assertOk()
             ->assertJsonStructure(['status', 'message']);
    });
});


// -------------------------------------
// Halaqahs API
// -------------------------------------
describe('Halaqahs API', function () {
    it('handles listing halaqas', function () {
        // Arrange: Create 3 halaqas to ensure the list is not empty
        Halaqah::factory(3)->create();

        // Act & Assert
        $this->getJson('/api/v1/Halaqahs')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    });

    it('handles Halaqah creation', function (Faker $faker) {
        // Arrange: Prepare the data for the new Halaqah
        $payload = ['name' => $faker->company, 'gender' => 'Male', 'residence' => $faker->city];

        // Act & Assert
        $this->postJson('/api/v1/Halaqahs', $payload)
            ->assertCreated()
            ->assertJsonFragment(['name' => $payload['name']]);
    });

    it('handles viewing a specific Halaqah', function () {
        // Arrange: Create a Halaqah to view
        $Halaqah = Halaqah::factory()->create();

        // Act & Assert
        $this->getJson("/api/v1/Halaqahs/{$Halaqah->id}")
            ->assertOk()
            ->assertJsonFragment(['id' => $Halaqah->id]);
    });

    it('handles updating a Halaqah', function (Faker $faker) {
        // Arrange
        $Halaqah = Halaqah::factory()->create();
        $payload = ['name' => $faker->company];

        // Act & Assert
        $this->putJson("/api/v1/Halaqahs/{$Halaqah->id}", $payload)
            ->assertOk()
            ->assertJsonFragment(['name' => $payload['name']]);
    });
});

// -------------------------------------
// Students & Applicants API
// -------------------------------------
describe('Students & Applicants API', function () {
    it('handles listing students', function () {
        // Arrange
        Student::factory(5)->create();

        // Act & Assert
        $this->getJson('/api/v1/students')
            ->assertOk()
            ->assertJsonCount(5, 'data');
    });

    it('handles updating a student', function () {
        // Arrange
        $student = Student::factory()->create();
        $payload = ['name' => 'Updated Name', 'email' => 'updated.email@example.com'];

        // Act & Assert
        $this->putJson("/api/v1/students/{$student->id}", $payload)
            ->assertOk()
            ->assertJsonFragment(['email' => $payload['email']]);
    });

    it('handles student application creation', function (Faker $faker) {
        // Arrange
        $payload = [
            'name' => $faker->name,
            'email' => $faker->unique()->safeEmail,
            'password' => 'password',
            'gender' => 'Female',
            'birthDate' => '2005-01-01'
        ];

        // Act & Assert
        $this->postJson('/api/v1/students/applicants', $payload)
            ->assertCreated()
            ->assertJsonFragment(['email' => $payload['email']]);
    });

    it('handles actions on student applicants', function () {
        // Arrange: Create an applicant to action
        $applicant = Student::factory()->create(['status' => 'new']);
        $payload = ['action' => 'accept', 'note' => 'Accepted.'];

        // Act & Assert
        $this->postJson("/api/v1/students/applicants/{$applicant->id}/actions", $payload)
             ->assertOk();
    });
});


// -------------------------------------
// Teachers & Applicants API
// -------------------------------------
describe('Teachers & Applicants API', function () {
    it('handles listing teachers', function () {
        // Arrange
        Teacher::factory(3)->create();

        // Act & Assert
        $this->getJson('/api/v1/teachers')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    });

    it('handles updating a teacher', function () {
        // Arrange
        $teacher = Teacher::factory()->create();
        $payload = ['name' => 'Updated Teacher Name'];

        // Act & Assert
        $this->putJson("/api/v1/teachers/{$teacher->id}", $payload)
            ->assertOk()
            ->assertJsonFragment($payload);
    });

    it('handles teacher application creation', function (Faker $faker) {
        // Arrange
        $payload = [
            'name' => $faker->name,
            'email' => $faker->unique()->safeEmail,
            'password' => 'password',
        ];

        // Act & Assert
        $this->postJson('/api/v1/teachers/applicants', $payload)->assertCreated();
    });
});


// -------------------------------------
// Follow-ups & Sync API
// -------------------------------------
describe('Follow-ups & Sync API', function () {
    it('handles fetching student follow-up reports', function () {
        $this->getJson('/api/v1/follow-ups/students?trackDate=' . now()->toDateString())
            ->assertOk()
            ->assertJsonStructure(['reports', 'summary', 'pagination']);
    });

    it('handles fetching Halaqah follow-up reports', function () {
        $this->getJson('/api/v1/follow-ups/Halaqahs?date=' . now()->toDateString())
            ->assertOk()
            ->assertJsonStructure(['Halaqahs', 'summary', 'pagination']);
    });

    it('handles syncing students', function () {
        // Arrange
        Student::factory()->create(['updated_at' => now()]);
        $timestamp = now()->subMinute()->toIso8601String();

        // Act & Assert
        $this->getJson("/api/v1/sync/students?updatedSince={$timestamp}")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonStructure(['data', 'pagination', 'syncTimestamp']);
    });
});