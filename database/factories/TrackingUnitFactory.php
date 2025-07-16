<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrackingUnit>
 */
class TrackingUnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'unit_id' => \App\Models\Unit::factory(),
            'from_surah' => fake()->numberBetween(1, 114),
            'from_page' => fake()->numberBetween(1, 604),
            'from_ayah' => fake()->numberBetween(1, 286),
            'to_surah' => fake()->numberBetween(1, 114),
            'to_page' => fake()->numberBetween(1, 604),
            'to_ayah' => fake()->numberBetween(1, 286),
        ];
    }
}
