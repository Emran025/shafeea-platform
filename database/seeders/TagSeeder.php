<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            ['tag_name' => 'بدء الاستخدام', 'tag_slug' => 'getting-started'],
            ['tag_name' => 'إدارة الحساب', 'tag_slug' => 'account-management'],
            ['tag_name' => 'الفواتير والدفع', 'tag_slug' => 'billing'],
            ['tag_name' => 'الميزات والوظائف', 'tag_slug' => 'features'],
            ['tag_name' => 'استكشاف الأخطاء وإصلاحها', 'tag_slug' => 'troubleshooting'],
            ['tag_name' => 'تطبيق الجوال', 'tag_slug' => 'mobile-app'],
            ['tag_name' => 'التكاملات', 'tag_slug' => 'integrations'],
            ['tag_name' => 'الأمان والخصوصية', 'tag_slug' => 'security'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
