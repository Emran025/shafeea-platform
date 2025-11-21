<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Applicant>
 */
class ApplicantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'school_id' => null,
            'application_type' => $this->faker->randomElement(['teacher', 'student']),
            'status' => 'pending',
            'bio' => $this->faker->paragraph,
            'qualifications' => $this->faker->sentence,
            'intent_statement' => $this->faker->paragraph,
        ];
    }

    /**
     * Indicate that the applicant has a school.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withSchool()
    {
        return $this->state(function (array $attributes) {
            return [
                'school_id' => School::factory(),
            ];
        });
    }
}
