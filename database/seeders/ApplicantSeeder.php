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
        // Get all schools to assign applicants to them
        $schools = School::all();
        if ($schools->isEmpty()) {
            $this->command->warn('No schools found. Please seed schools before running the ApplicantSeeder.');
            return;
        }

        // --- Create Pending Applicants ---

        // 5 pending applicants for specific schools
        User::factory(5)->create(['password' => Hash::make('password')])->each(function ($user) use ($schools) {
            Applicant::factory()->withSchool()->create([
                'user_id' => $user->id,
                'school_id' => $schools->random()->id,
            ]);
        });

        // 5 pending applicants without a specific school (general pool)
        User::factory(5)->create(['password' => Hash::make('password')])->each(function ($user) {
            Applicant::factory()->create(['user_id' => $user->id]);
        });

        // --- Create Applicants in Other Statuses ---

        // 3 applicants under review
        User::factory(3)->create(['password' => Hash::make('password')])->each(function ($user) use ($schools) {
            Applicant::factory()->withSchool()->underReview()->create([
                'user_id' => $user->id,
                'school_id' => $schools->random()->id,
            ]);
        });

        // 4 approved applicants
        User::factory(4)->create(['password' => Hash::make('password')])->each(function ($user) use ($schools) {
            Applicant::factory()->withSchool()->approved()->create([
                'user_id' => $user->id,
                'school_id' => $schools->random()->id,
            ]);
        });

        // 3 rejected applicants
        User::factory(3)->create(['password' => Hash::make('password')])->each(function ($user) use ($schools) {
            Applicant::factory()->withSchool()->rejected()->create([
                'user_id' => $user->id,
                'school_id' => $schools->random()->id,
            ]);
        });
    }
}
