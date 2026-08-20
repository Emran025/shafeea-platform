<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Halaqah\HalaqahNote>
 */
class HalaqahNoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'halaqah_id' => \App\Models\Halaqah\Halaqah::factory(),
            'admin_id' => \App\Models\Auth\Admin::factory(),
            'note' => fake()->sentence(),
        ];
    }
}
