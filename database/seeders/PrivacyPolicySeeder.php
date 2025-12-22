<?php

namespace Database\Seeders;

use App\Models\PrivacyPolicy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class PrivacyPolicySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Path to Privacy Policy JSON file
        $jsonPath = database_path('data/privacy_Policy.json');

        if (! file_exists($jsonPath)) {
            $this->command->warn('⚠️  Demo privacy_Policy JSON file not found. Skipping seeder.');
            $this->command->info('Expected path: ' . $jsonPath);
            return;
        }

        // Load privacy Policy from JSON
        $privacy_Policy = json_decode(file_get_contents($jsonPath), true);

        if (empty($privacy_Policy)) {
            $this->command->warn('⚠️  No privacy_Policy found in JSON file.');
            return;
        }

        $summary = $privacy_Policy['summary'];
        $sections = $privacy_Policy['sections'];

        PrivacyPolicy::updateOrCreate(
            ['version' => '1.1.0'],
            [
                'last_updated' => Carbon::now(),
                'summary_json' => json_encode($summary, JSON_UNESCAPED_UNICODE),
                'sections_json' => json_encode($sections, JSON_UNESCAPED_UNICODE),
                'is_active' => true,
            ]
        );

        $this->command->info('✅ Privacy Policy seeded successfully.');
    }
}
