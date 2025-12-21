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
        return $this->for(User::factory()->student())
            ->afterMaking(function ($student) {
                $age = Carbon::parse($student->user->birth_date)->age;
                
                $student->qualification = match (true) {
                    $age >= 18 => 'University',
                    $age >= 15 => 'High School',
                    $age >= 12 => 'Middle',
                    default => 'Primary',
                };
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
