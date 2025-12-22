<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\Plan;
use Illuminate\Database\Seeder;

class DemoTrackingsPlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeds demo plans with specific creation dates and memorization levels
     * Useful for demonstrating historical data and various student states
     */

    public function run(): void
    {
        // Path to demo plans JSON file
        $jsonPath = database_path('data/demo_trackings_plans.json');

        if (! file_exists($jsonPath)) {
            $this->command->warn('⚠️  Demo plans JSON file not found. Skipping seeder.');
            $this->command->info('Expected path: ' . $jsonPath);
            return;
        }

        // Load demo plans from JSON
        $realisticPlans = json_decode(file_get_contents($jsonPath), true);

        if (empty($realisticPlans)) {
            $this->command->warn('⚠️  No demo plans found in JSON file.');
            return;
        }

        // foreach ($realisticPlans as $planData) {
        $planData = $realisticPlans[0];
        Plan::create([
            'name' => $planData['name'],
            'description' => $planData['description'],
            'start_date' => now(),
            'end_date' => now()->addDays(rand(90, 365)),
            'has_review' => true,
            'review_unit_id' => $planData['review_unit_id'],
            'review_amount' => $planData['review_amount'],
            'has_memorization' => true,
            'memorization_unit_id' => $planData['memorization_unit_id'],
            'memorization_amount' => $planData['memorization_amount'],
            'has_sard' => true,
            'sard_unit_id' => $planData['sard_unit_id'],
            'sard_amount' => $planData['sard_amount'],
            'frequency_type_id' => $planData['frequency_type_id'],
        ]);
        // }
        $this->command->info('✅ Created ' . count($realisticPlans) . ' demo plans.');
    }
}
