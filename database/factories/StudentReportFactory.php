<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentReport>
 */
class StudentReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'student_id' => \App\Models\Student::factory(), // creates related student if not provided
            'report_date' => fake()->date(),
            'summary' => fake()->paragraph(),
            'details' => json_encode([
                'attendance' => fake()->randomElement(['excellent', 'good', 'fair', 'poor']),
                'notes' => fake()->sentences(3),
                'scores' => [
                    'memorization' => fake()->numberBetween(50, 100),
                    'recitation' => fake()->numberBetween(50, 100),
                ],
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
