<?php

namespace Database\Seeders;

use App\Models\Applicant\Applicant;
use App\Models\Auth\User;
use App\Models\School\School;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoApplicantSeeder extends Seeder
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

        // Path to demo applicants JSON file
        $jsonPath = database_path('data/demo_applicants.json');

        if (! file_exists($jsonPath)) {
            $this->command->warn('⚠️  Demo applicants JSON file not found. Skipping seeder.');
            $this->command->info('Expected path: '.$jsonPath);

            return;
        }

        // Load demo applicants from JSON
        $demoApplicants = json_decode(file_get_contents($jsonPath), true);

        if (empty($demoApplicants)) {
            $this->command->warn('⚠️  No demo applicants found in JSON file.');

            return;
        }

        // Map hardcoded school IDs to actual DB IDs using index-based rotation
        $schoolIds = $schools->pluck('id')->values();

        foreach ($demoApplicants as $applicantData) {
            // Resolve school_id: use JSON value as 1-based index into actual school IDs
            $jsonSchoolId = $applicantData['school_id'] ?? null;
            $resolvedSchoolId = $jsonSchoolId
                ? ($schoolIds->get(($jsonSchoolId - 1) % $schoolIds->count()) ?? $schoolIds->first())
                : null;

            $user = User::create([
                'name' => $applicantData['name'],
                'email' => $applicantData['email'],
                'password' => Hash::make('password'),
                'avatar' => 'https://i.pravatar.cc/150?u='.$applicantData['email'],
                'gender' => $applicantData['gender'],
                'birth_date' => $this->getQualificationByBirthYear($applicantData['birth_year']),
                'phone' => $applicantData['phone'],
                'country' => $applicantData['country'],
                'city' => $applicantData['city'],
                'school_id' => $resolvedSchoolId,
                'created_at' => $applicantData['created_at'],
                'updated_at' => $applicantData['created_at'],
            ]);

            Applicant::create([
                'school_id' => $user->school_id,
                'user_id' => $user->id,
                'school_id' => $user->school_id,
                'application_type' => $applicantData['application_type'],
                'status' => $applicantData['status'],
                'qualifications' => $applicantData['qualifications'],
                'bio' => $applicantData['bio'],
                'created_at' => $applicantData['created_at'],
                'updated_at' => $applicantData['created_at'],
            ]);
        }
        $this->command->info('✅ Created '.count($demoApplicants).' Applicant.');
    }

    private function getQualificationByBirthYear($birthYear): string
    {
        $month = rand(1, 12);
        $day = rand(1, 28);

        return "{$birthYear}-{$month}-{$day}";
    }
}
