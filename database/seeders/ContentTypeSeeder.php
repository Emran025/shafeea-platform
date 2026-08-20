<?php

namespace Database\Seeders;

use App\Models\Content\ContentType;
use Illuminate\Database\Seeder;

class ContentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['slug' => 'faq',             'name' => 'الأسئلة الشائعة'],
            ['slug' => 'privacy-policy',  'name' => 'سياسة الخصوصية'],
            ['slug' => 'terms-of-use',    'name' => 'شروط الاستخدام'],
            ['slug' => 'general-content', 'name' => 'محتوى عام'],
        ];

        foreach ($types as $type) {
            ContentType::firstOrCreate(
                ['slug' => $type['slug']],
                ['name' => $type['name']]
            );
        }

        $this->command->info('✅ Seeded ' . ContentType::count() . ' content types.');
    }
}
