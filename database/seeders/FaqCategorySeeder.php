<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FaqCategory;

class FaqCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FaqCategory::create(['name' => 'General Questions', 'display_order' => 1]);
        FaqCategory::create(['name' => 'Technical Support', 'display_order' => 2]);
        FaqCategory::create(['name' => 'Pricing and Plans', 'display_order' => 3]);
        FaqCategory::create(['name' => 'User Guides', 'display_order' => 4]);
    }
}
