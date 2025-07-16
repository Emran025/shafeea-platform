<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'qualification' => fake()->word(),
            'memorization_level' => fake()->randomElement(['beginner', 'intermediate', 'advanced']),
            'status' => fake()->randomElement(['active', 'inactive', 'suspended']),
        ];
    }
}
