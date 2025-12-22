<?php

namespace Database\Seeders;

use App\Models\ContentType;
use Illuminate\Database\Seeder;

class ContentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ContentType::create([
            'name' => 'الأسئلة الشائعة',
            'slug' => 'faq',
        ]);
        ContentType::create([
            'name' => 'سياسة الخصوصية',
            'slug' => 'privacy-policy',
        ]);
        ContentType::create([
            'name' => 'شروط الاستخدام',
            'slug' => 'terms-of-use',
        ]);
        ContentType::create([
            'name' => 'محتوى عام',
            'slug' => 'general-content',
        ]);

        $this->command->info('✅ Created ' . ContentType::count() . ' content types.');
    }
}
