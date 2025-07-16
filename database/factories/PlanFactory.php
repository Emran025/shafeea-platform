<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plan>
 */
class PlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'description' => fake()->sentence(6),
            'start_date' => fake()->date(),
            'end_date' => fake()->date(),
            'has_review' => fake()->boolean(),
            'review_unit_id' => \App\Models\Unit::factory(),
            'review_amount' => fake()->numberBetween(1, 50),
            'has_memorization' => fake()->boolean(),
            'memorization_unit_id' => \App\Models\Unit::factory(),
            'memorization_amount' => fake()->numberBetween(1, 50),
            'has_sard' => fake()->boolean(),
            'sard_unit_id' => \App\Models\Unit::factory(),
            'sard_amount' => fake()->numberBetween(1, 50),
            'frequency_type_id' => \App\Models\FrequencyType::factory(),
        ];
    }
}
