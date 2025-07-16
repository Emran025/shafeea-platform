<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrackingDetail>
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
            'tracking_id' => \App\Models\Tracking::factory(),
            'tracking_type_id' => \App\Models\TrackingType::factory(),
            'from_tracking_unit_id' => \App\Models\TrackingUnit::factory(),
            'to_tracking_unit_id' => \App\Models\TrackingUnit::factory(),
            'actual_amount' => $this->faker->numberBetween(1, 50),
            'comment' => $this->faker->optional()->sentence(),
            'score' => $this->faker->numberBetween(0, 100),
        ];
    }
}
