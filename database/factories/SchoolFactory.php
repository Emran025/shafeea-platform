<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\School>
 */
class SchoolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->company() . ' School',
            'logo' => fake()->imageUrl(),
            'phone' => fake()->phoneNumber(),
            'country' => 'Yemen',
            'city' => fake()->randomElement(['Sana\'a', 'Aden', 'Taiz', 'Hodeidah', 'Ibb']),
            'location' => fake()->streetAddress(),
            'address' => fake()->address(),
        ];
    }
}
