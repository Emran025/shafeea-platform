<?php

namespace Database\Seeders;

use App\Models\Applicant;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ApplicantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $schools = School::all();
        if ($schools->isEmpty()) {
            $this->command->warn('No schools found. Please seed schools before running the ApplicantSeeder.');
            return;
        }

        // Create a variety of applicants with different statuses and types
        $this->createPendingApplicants($schools);
        $this->createUnderReviewApplicants($schools);
        $this->createApprovedApplicants($schools);
        $this->createRejectedApplicants($schools);
    }

    private function createPendingApplicants($schools): void
    {
        // General pool of pending applicants (no specific school)
        User::factory(20)->create(['password' => Hash::make('password')])->each(function ($user) {
            Applicant::factory()->create([
                'user_id' => $user->id,
                'application_type' => $this->getRandomApplicationType(),
            ]);
        });

        // Pending applicants for specific schools
        User::factory(30)->create(['password' => Hash::make('password')])->each(function ($user) use ($schools) {
            Applicant::factory()->withSchool()->create([
                'user_id' => $user->id,
                'school_id' => $schools->random()->id,
                'application_type' => $this->getRandomApplicationType(),
            ]);
        });
    }

    private function createUnderReviewApplicants($schools): void
    {
        User::factory(15)->create(['password' => Hash::make('password')])->each(function ($user) use ($schools) {
            Applicant::factory()->withSchool()->underReview()->create([
                'user_id' => $user->id,
                'school_id' => $schools->random()->id,
                'application_type' => $this->getRandomApplicationType(),
            ]);
        });
    }

    private function createApprovedApplicants($schools): void
    {
        User::factory(25)->create(['password' => Hash::make('password')])->each(function ($user) use ($schools) {
            Applicant::factory()->withSchool()->approved()->create([
                'user_id' => $user->id,
                'school_id' => $schools->random()->id,
                'application_type' => $this->getRandomApplicationType(),
            ]);
        });
    }

    private function createRejectedApplicants($schools): void
    {
        User::factory(10)->create(['password' => Hash::make('password')])->each(function ($user) use ($schools) {
            Applicant::factory()->withSchool()->rejected()->create([
                'user_id' => $user->id,
                'school_id' => $schools->random()->id,
                'application_type' => $this->getRandomApplicationType(),
            ]);
        });
    }

    private function getRandomApplicationType(): string
    {
        return rand(0, 1) ? 'teacher' : 'student';
    }
}
