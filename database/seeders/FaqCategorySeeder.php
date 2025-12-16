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
        FaqCategory::withTrashed()->updateOrCreate(['name' => 'أسئلة عامة', 'display_order' => 1]);
        FaqCategory::withTrashed()->updateOrCreate(['name' => 'الدعم الفني', 'display_order' => 2]);
        FaqCategory::withTrashed()->updateOrCreate(['name' => 'الأسعار والخطط', 'display_order' => 3]);
        FaqCategory::withTrashed()->updateOrCreate(['name' => 'أدلة المستخدم', 'display_order' => 4]);
    }
}
