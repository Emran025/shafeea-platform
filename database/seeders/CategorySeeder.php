<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create(['name' => 'أسئلة عامة', 'display_order' => 1]);
        Category::create(['name' => 'إدارة الحساب', 'display_order' => 2]);
        Category::create(['name' => 'الميزات', 'display_order' => 3]);
        Category::create(['name' => 'الدعم الفني', 'display_order' => 4]);
        Category::create(['name' => 'الأسعار والخطط', 'display_order' => 5]);

        $this->command->info('✅ Created ' . Category::count() . ' categories.');
    }
}
