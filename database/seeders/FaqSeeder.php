<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Faq;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure categories, tags, and a user exist
        $categories = Category::all();
        $tags = Tag::all();
        $user = User::first(); // Assumes at least one user exists

        if ($categories->isEmpty() || $tags->isEmpty() || ! $user) {
            $this->command->info('Please seed FAQ categories, tags, and users before running the FaqSeeder.');
            return;
        }

        // Path to faqs JSON file
        $jsonPath = database_path('data/faqs.json');

        if (! file_exists($jsonPath)) {
            $this->command->warn('⚠️  Demo faqs JSON file not found. Skipping seeder.');
            $this->command->info('Expected path: ' . $jsonPath);
            return;
        }

        // Load faqs from JSON
        $faqs = json_decode(file_get_contents($jsonPath), true);

        if (empty($faqs)) {
            $this->command->warn('⚠️  No faqs found in JSON file.');
            return;
        }

        // Clear existing FAQs to avoid duplicates
        Faq::query()->delete();

        foreach ($faqs as $faqData) {
            $category = $categories->firstWhere('name', $faqData['category']);
            if ($category) {
                $faq = Faq::create([
                    'category_id' => $category->id,
                    'question' => $faqData['question'],
                    'answer' => $faqData['answer'],
                    'created_by' => $user->id,
                    'is_active' => true,
                    'view_count' => rand(0, 150),
                    'display_order' => rand(0, 1), // You can adjust this as needed
                ]);

                // Attach tags
                $tagIds = $tags->whereIn('tag_slug', $faqData['tags'])->pluck('id');
                $faq->tags()->attach($tagIds);
            }
        }

        $this->command->info('✅ Created ' . Faq::count() . ' FAQs from JSON file.');
    }
}
