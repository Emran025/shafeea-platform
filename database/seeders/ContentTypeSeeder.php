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
        ContentType::create([
            'name' => 'FAQ',
            'slug' => 'faq',
        ]);
        ContentType::create([
            'name' => 'Privacy Policy',
            'slug' => 'privacy-policy',
        ]);
        ContentType::create([
            'name' => 'Terms of Use',
            'slug' => 'terms-of-use',
        ]);
        ContentType::create([
            'name' => 'General Content',
            'slug' => 'general-content',
        ]);
    }
}
