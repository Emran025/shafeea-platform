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
    public function definition(): array
    {
        return [
            'student_id' => \App\Models\Student::factory(),
            'halaqah_id' => \App\Models\Halaqah::factory(),
            'date' => $this->faker->date(),
            'attendance' => $this->faker->randomElement(['present', 'absent', 'late']),
            'behavior' => $this->faker->randomElement(['excellent', 'good', 'average', 'poor']),
            'notes' => $this->faker->optional()->sentence(),
            'created_by' => \App\Models\User::factory(),
        ];
    }
}
