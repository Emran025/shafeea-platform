<?php

namespace Database\Seeders;

use App\Models\Content\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'أسئلة عامة',      'display_order' => 1],
            ['name' => 'إدارة الحساب',    'display_order' => 2],
            ['name' => 'الميزات',          'display_order' => 3],
            ['name' => 'الدعم الفني',      'display_order' => 4],
            ['name' => 'الأسعار والخطط',  'display_order' => 5],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['display_order' => $category['display_order']],
                ['name'          => $category['name']]
            );
        }

        $this->command->info('✅ Seeded ' . Category::count() . ' categories.');
    }
}
