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
            ['tag_name' => 'Getting Started', 'tag_slug' => 'getting-started'],
            ['tag_name' => 'Account Management', 'tag_slug' => 'account-management'],
            ['tag_name' => 'Billing', 'tag_slug' => 'billing'],
            ['tag_name' => 'Features', 'tag_slug' => 'features'],
            ['tag_name' => 'Troubleshooting', 'tag_slug' => 'troubleshooting'],
            ['tag_name' => 'Mobile App', 'tag_slug' => 'mobile-app'],
            ['tag_name' => 'Integrations', 'tag_slug' => 'integrations'],
            ['tag_name' => 'Security', 'tag_slug' => 'security'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
