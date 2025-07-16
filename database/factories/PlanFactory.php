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
            'name' => $this->faker->word(),
            'description' => $this->faker->optional()->sentence(),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'has_review' => $this->faker->boolean(),
            'review_unit_id' => \App\Models\Unit::factory(),
            'review_amount' => $this->faker->numberBetween(1, 50),
            'has_memorization' => $this->faker->boolean(),
            'memorization_unit_id' => \App\Models\Unit::factory(),
            'memorization_amount' => $this->faker->numberBetween(1, 50),
            'has_sard' => $this->faker->boolean(),
            'sard_unit_id' => \App\Models\Unit::factory(),
            'sard_amount' => $this->faker->numberBetween(1, 50),
            'frequency_type_id' => \App\Models\FrequencyType::factory(),
        ];
    }
}
