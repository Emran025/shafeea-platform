<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create(['name' => 'أسئلة عامة', 'display_order' => 1]);
        Category::create(['name' => 'الدعم الفني', 'display_order' => 2]);
        Category::create(['name' => 'الأسعار والخطط', 'display_order' => 3]);
        Category::create(['name' => 'أدلة المستخدم', 'display_order' => 4]);
    }
}
