<?php

namespace Database\Seeders;

use App\Models\TermsOfUse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TermsOfUsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // Path to terms of us JSON file
        $jsonPath = database_path('data/terms_of_us.json');

        if (! file_exists($jsonPath)) {
            $this->command->warn('⚠️  Demo terms_of_us JSON file not found. Skipping seeder.');
            $this->command->info('Expected path: ' . $jsonPath);
            return;
        }

        // Load terms_of_us from JSON
        $terms_of_us = json_decode(file_get_contents($jsonPath), true);

        if (empty($terms_of_us)) {
            $this->command->warn('⚠️  No terms_of_us found in JSON file.');
            return;
        }

        $summary = $terms_of_us['summary'];
        $sections = $terms_of_us['sections'];

        TermsOfUse::updateOrCreate(
            ['version' => '1.1.0'],
            [
                'last_updated' => Carbon::now(),
                'summary_json' => json_encode($summary, JSON_UNESCAPED_UNICODE),
                'sections_json' => json_encode($sections, JSON_UNESCAPED_UNICODE),
                'is_active' => true,
            ]
        );
        
        $this->command->info('✅ Terms of Use seeded successfully.');
    }
}
