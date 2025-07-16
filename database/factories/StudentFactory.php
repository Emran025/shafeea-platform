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
            'qualification' => $this->faker->word(),
            'memorization_level' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
            'status' => $this->faker->randomElement(['active', 'inactive', 'suspended']),
        ];
    }
}
