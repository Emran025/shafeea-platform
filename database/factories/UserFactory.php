<?php

namespace Database\Factories;

use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),

            // Additional fields
            'avatar' => fake()->imageUrl(300, 300, 'people', true, 'User'),
            'phone' => fake()->phoneNumber(),
            'whatsapp' => fake()->phoneNumber(),
            'gender' => fake()->randomElement(['Male', 'Female']),
            'birth_date' => fake()->date('Y-m-d', '-10 years'),
            'country' => fake()->country(),
            'city' => fake()->city(),
            'residence' => fake()->streetAddress(),
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
