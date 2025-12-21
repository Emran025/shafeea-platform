<?php

namespace Database\Factories;

use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        $gender = $this->faker->randomElement(['Male', 'Female']);

        return [
            'name' => $gender === 'Male' ? $this->faker->name('male') : $this->faker->name('female'),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'avatar' => $this->faker->imageUrl(300, 300, 'people', true, 'User'),
            'phone' => '+9677' . $this->faker->numerify('########'),
            'phone_zone' => '+967',
            'whatsapp' => '+9677' . $this->faker->numerify('########'),
            'whatsapp_zone' => '+967',
            'gender' => $gender,
            'birth_date' => $this->faker->dateTimeBetween('-40 years', '-18 years')->format('Y-m-d'),
            'country' => 'Yemen',
            'city' => $this->faker->randomElement(['Sana\'a', 'Aden', 'Taiz', 'Hodeidah', 'Ibb']),
            'residence' => $this->faker->streetName(),
            'status' => 'active',
            'school_id' => School::factory(),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'birth_date' => $this->faker->dateTimeBetween('-50 years', '-30 years')->format('Y-m-d'),
        ]);
    }

    public function student(): static
    {
        return $this->state(fn (array $attributes) => [
            'birth_date' => $this->faker->dateTimeBetween('-18 years', '-10 years')->format('Y-m-d'),
        ]);
    }

    public function teacher(): static
    {
        return $this->state(fn (array $attributes) => [
            'birth_date' => $this->faker->dateTimeBetween('-50 years', '-25 years')->format('Y-m-d'),
        ]);
    }
}
