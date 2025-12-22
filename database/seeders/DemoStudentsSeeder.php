<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoStudentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeds demo students with specific creation dates and memorization levels
     * Useful for demonstrating historical data and various student states
     */

    public function run(): void
    {
        // Path to demo students JSON file
        $jsonPath = database_path('data/demo_students.json');

        if (! file_exists($jsonPath)) {
            $this->command->warn('⚠️  Demo students JSON file not found. Skipping seeder.');
            $this->command->info('Expected path: ' . $jsonPath);
            return;
        }

        // Load demo students from JSON
        $demoStudents = json_decode(file_get_contents($jsonPath), true);

        if (empty($demoStudents)) {
            $this->command->warn('⚠️  No demo students found in JSON file.');
            return;
        }

        // Get a random school to assign students to
        $schoolId = \App\Models\School::inRandomOrder()->first()?->id;

        if (! $schoolId) {
            $this->command->error('❌ No schools found! Please run SchoolSeeder first.');
            return;
        }

        foreach ($demoStudents as $studentData) {
            // Create user
            $user = User::create([
                'name' => $studentData['name'],
                'email' => $studentData['email'],
                'password' => bcrypt('password'),
                'gender' => $studentData['gender'],
                'birth_date' => ($studentData['birth_year'] ?? 2010) . '-01-01',
                'phone' => '+9677' . rand(10000000, 99999999),
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'school_id' => $schoolId,
                'created_at' => $studentData['created_at'] ?? now(),
                'updated_at' => $studentData['last_modified'] ?? now(),
            ]);

            // Create student
            Student::create([
                'user_id' => $user->id,
                'memorization_level' => $studentData['memorization_level'] ?? 1,
                'qualification' => $this->getQualificationByBirthYear($studentData['birth_year'] ?? 2010),
                'status' => ($studentData['is_deleted'] ?? false) ? 'inactive' : 'active',
                'created_at' => $studentData['created_at'] ?? now(),
                'updated_at' => $studentData['last_modified'] ?? now(),
            ]);
        }


        $this->command->info('✅ Created ' . count($demoStudents) . ' demo students.');
    }

    /**
     * Determine qualification based on birth year
     */
    private function getQualificationByBirthYear(int $birthYear): string
    {
        $age = now()->year - $birthYear;

        return match (true) {
            $age >= 18 => 'University',
            $age >= 15 => 'High School',
            $age >= 12 => 'Middle',
            default => 'Primary',
        };
    }
}
