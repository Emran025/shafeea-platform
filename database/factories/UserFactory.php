<?php

namespace Database\Factories;

use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        $gender = fake()->randomElement(['Male', 'Female']);

        return [
            'name' => $gender === 'Male' ? fake()->name('male') : fake()->name('female'),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => 'password',
            'remember_token' => Str::random(10),

            // Additional fields
            'avatar' => fake()->imageUrl(300, 300, 'people', true, 'User'),
            'phone' => '5'.fake()->numerify('########'), // Saudi Arabian phone number format
            'phone_zone' => '+966',
            'whatsapp' => '5'.fake()->numerify('########'),
            'whatsapp_zone' => '+966',
            'gender' => $gender,
            'birth_date' => fake()->dateTimeBetween('-40 years', '-18 years')->format('Y-m-d'),
            'country' => 'Saudi Arabia',
            'city' => fake()->randomElement(['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina']),
            'residence' => fake()->streetName(),
            'status' => 'active',

            // Ensure there's a related school (or use create method)
            'school_id' => School::factory(),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
