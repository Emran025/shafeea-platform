<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContentType;

class ContentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ContentType::withTrashed()->updateOrCreate([
            'name' => 'الأسئلة الشائعة',
            'slug' => 'faq',
        ]);
        ContentType::withTrashed()->updateOrCreate([
            'name' => 'سياسة الخصوصية',
            'slug' => 'privacy-policy',
        ]);
        ContentType::withTrashed()->updateOrCreate([
            'name' => 'شروط الاستخدام',
            'slug' => 'terms-of-use',
        ]);
        ContentType::withTrashed()->updateOrCreate([
            'name' => 'محتوى عام',
            'slug' => 'general-content',
        ]);
    }
}
