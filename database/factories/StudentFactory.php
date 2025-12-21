<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class StudentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->student(),
            'qualification' => $this->faker->randomElement(['Primary', 'Middle', 'High School', 'University']),
            'memorization_level' => (int) $this->faker->numberBetween(1, 30),
            'status' => 'active',
        ];
    }

    public function withQualification(): static
    {
        return $this->state(function (array $attributes) {
            // Ensure user_id is created if not present
            $user = User::find($attributes['user_id'] ?? User::factory()->student()->create()->id);
            $birthDate = Carbon::parse($user->birth_date);
            $age = $birthDate->age;

            if ($age >= 18) {
                $qualification = 'University';
            } elseif ($age >= 15) {
                $qualification = 'High School';
            } elseif ($age >= 12) {
                $qualification = 'Middle';
            } else {
                $qualification = 'Primary';
            }

            return [
                'qualification' => $qualification,
            ];
        });
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'inactive']);
    }

    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'suspended']);
    }
}
