<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Halaqah>
 */
class HalaqahFactory extends Factory
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
            'avatar' => $this->faker->imageUrl(200, 200, 'halaqah', true, 'Halaqah'),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'residence' => $this->faker->city(),
            'max_students' => $this->faker->numberBetween(10, 50),
            'sum_of_students' => $this->faker->numberBetween(0, 50),
            'is_active' => $this->faker->boolean(),
            'is_deleted' => $this->faker->boolean(),
            'teacher_id' => \App\Models\Teacher::factory(),
            'school_id' => \App\Models\School::factory(),
        ];
    }
}
