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
        $startDate = fake()->dateTimeBetween('now', '+1 month');
        $endDate = fake()->dateTimeBetween($startDate, '+6 months');
        
        $hasReview = fake()->boolean();
        $hasMemorization = fake()->boolean();
        $hasSard = fake()->boolean();

        return [
            'name' => fake()->word(),
            'description' => fake()->sentence(6),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'has_review' => $hasReview,
            'review_unit_id' => $hasReview ? \App\Models\Unit::factory() : null,
            'review_amount' => fake()->numberBetween(1, 50),
            'has_memorization' => $hasMemorization,
            'memorization_unit_id' => $hasMemorization ? \App\Models\Unit::factory() : null,
            'memorization_amount' => fake()->numberBetween(1, 50),
            'has_sard' => $hasSard,
            'sard_unit_id' => $hasSard ? \App\Models\Unit::factory() : null,
            'sard_amount' => fake()->numberBetween(1, 50),
            'frequency_type_id' => \App\Models\FrequencyType::factory(),
        ];
    }
}
