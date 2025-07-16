<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tracking>
 */
class TrackingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'plan_id' => \App\Models\Plan::factory(),
            'date' => $this->faker->date(),
            'note' => $this->faker->optional()->sentence(),
            'behavior_note' => $this->faker->optional()->sentence(),
        ];
    }
}
