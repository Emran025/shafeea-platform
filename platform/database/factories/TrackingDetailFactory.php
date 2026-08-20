<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tracking\TrackingDetail>
 */
class TrackingDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tracking_id' => \App\Models\Tracking\Tracking::factory(),
            'tracking_type_id' => \App\Models\Tracking\TrackingType::factory(),
            'from_tracking_unit_id' => \App\Models\Tracking\TrackingUnit::factory(),
            'to_tracking_unit_id' => \App\Models\Tracking\TrackingUnit::factory(),
            'actual_amount' => fake()->numberBetween(1, 50),
            'comment' => fake()->optional()->sentence(),
            'score' => fake()->numberBetween(0, 100),
        ];
    }
}
