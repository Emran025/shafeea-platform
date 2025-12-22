<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\User;
use App\Models\Student;
use App\Models\Plan;
use App\Models\Halaqah;
use Illuminate\Database\Seeder;

class DemoEnrollmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeds demo enrollment with specific creation dates and memorization levels
     * Useful for demonstrating historical data and various teacher states
     */
    public function run(): void
    {
        $students = Student::all();
        $plans = Plan::all();
        $halaqahs = Halaqah::all();
        // Enroll students and assign a current plan
        foreach ($students as $student) {
            $enrollment = Enrollment::create([
                'student_id' => $student->id,
                'halaqah_id' => $halaqahs->random()->id,
                'enrolled_at' => now()->subDays(rand(1, 20)),
            ]);
            // Attach a random plan and set it as current
            $enrollment->plans()->attach($plans->random()->id, ['is_current' => true]);
        }
        $this->command->info('✅ Created demo enrollment.');
    }
}
