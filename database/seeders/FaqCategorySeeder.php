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
        FaqCategory::create(['name' => 'أسئلة عامة', 'display_order' => 1]);
        FaqCategory::create(['name' => 'الدعم الفني', 'display_order' => 2]);
        FaqCategory::create(['name' => 'الأسعار والخطط', 'display_order' => 3]);
        FaqCategory::create(['name' => 'أدلة المستخدم', 'display_order' => 4]);
    }
}
