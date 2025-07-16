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
            'from_surah' => $this->faker->numberBetween(1, 114),
            'from_page' => $this->faker->numberBetween(1, 604),
            'from_ayah' => $this->faker->numberBetween(1, 286),
            'to_surah' => $this->faker->numberBetween(1, 114),
            'to_page' => $this->faker->numberBetween(1, 604),
            'to_ayah' => $this->faker->numberBetween(1, 286),
        ];
    }
}
