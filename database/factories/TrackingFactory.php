<?php

namespace Database\Factories;

use App\Models\Student\Enrollment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Tracking\Tracking>
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
            'enrollment_id' => Enrollment::factory(),
            'date' => fake()->date(),
            'note' => fake()->optional()->sentence(),
            'behavior_note' => fake()->optional()->sentence(),
        ];
    }
}
