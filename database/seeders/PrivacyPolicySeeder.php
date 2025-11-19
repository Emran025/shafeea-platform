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
        PrivacyPolicy::create([
            'version' => '1.0.0',
            'last_updated' => Carbon::now(),
            'summary_json' => json_encode(['summary' => 'This is a summary of the privacy policy.']),
            'sections_json' => json_encode([['title' => 'Introduction', 'content' => 'This is the introduction.']]),
            'is_active' => true,
        ]);
    }
}
