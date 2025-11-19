<?php

namespace Database\Seeders;

use App\Models\TermsOfUse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TermsOfUseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TermsOfUse::create([
            'version' => '1.0.0',
            'last_updated' => Carbon::now(),
            'summary_json' => json_encode(['summary' => 'This is a summary of the terms of use.']),
            'sections_json' => json_encode([['title' => 'Introduction', 'content' => 'This is the introduction.']]),
            'is_active' => true,
        ]);
    }
}
