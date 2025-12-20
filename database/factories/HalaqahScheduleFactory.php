<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HalaqahSchedule>
 */
class HalaqahScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'halaqah_id' => \App\Models\Halaqah::factory(), // Creates related Halaqah model
            'day_of_week' => fake()->randomElement([
                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
            ]),
            'start_time' => fake()->time('H:i'),
            'end_time' => fake()->time('H:i'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
