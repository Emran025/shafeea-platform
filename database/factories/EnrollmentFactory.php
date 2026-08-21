<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Student\Enrollment>
 */
class EnrollmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => \App\Models\Student\Student::factory(),
            'halaqah_id' => \App\Models\Halaqah\Halaqah::factory(),
            'enrolled_at' => fake()->dateTime(),
        ];
    }
}
