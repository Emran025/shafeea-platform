<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Halaqah>
 */
class HalaqahFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $maxStudents = fake()->numberBetween(10, 50);

        return [
            'name' => fake()->word(),
            'avatar' => fake()->imageUrl(200, 200, 'halaqah', true, 'Halaqah'),
            'gender' => fake()->randomElement(['male', 'female']),
            'residence' => fake()->city(),
            'max_students' => $maxStudents,
            'sum_of_students' => fake()->numberBetween(0, $maxStudents),
            'is_active' => true,  // Default to active for realistic test data
            'is_deleted' => false, // Default to not deleted
            'school_id' => \App\Models\School::factory(),
        ];
    }
}
