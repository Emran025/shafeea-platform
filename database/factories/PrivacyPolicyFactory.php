<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PrivacyPolicy>
 */
class PrivacyPolicyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'version' => $this->faker->semver,
            'last_updated' => Carbon::now(),
            'summary_json' => json_encode(['summary' => $this->faker->paragraph]),
            'sections_json' => json_encode([['title' => $this->faker->sentence, 'content' => $this->faker->paragraph]]),
            'is_active' => true,
        ];
    }
}
