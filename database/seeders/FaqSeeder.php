<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\FaqCategory;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure categories and tags are available
        $categories = FaqCategory::all();
        $tags = Tag::all();
        $user = User::first(); // Assumes at least one user exists

        if ($categories->isEmpty() || $tags->isEmpty() || !$user) {
            $this->command->info('Please seed FAQ categories, tags, and users before running the FaqSeeder.');
            return;
        }

        $faqs = [
            // General Questions
            [
                'category' => 'General Questions',
                'question' => 'What is the main goal of this platform?',
                'answer' => 'The main goal is to provide a centralized and easy-to-use system for managing educational content and tracking student progress.',
                'tags' => ['getting-started', 'features']
            ],
            [
                'category' => 'General Questions',
                'question' => 'Who is the target audience for this application?',
                'answer' => 'The application is designed for educational institutions, including schools and learning centers, as well as individual teachers and students.',
                'tags' => ['getting-started']
            ],

            // Technical Support
            [
                'category' => 'Technical Support',
                'question' => 'I forgot my password. How can I reset it?',
                'answer' => 'You can reset your password by clicking the "Forgot Password" link on the login page and following the on-screen instructions.',
                'tags' => ['account-management', 'troubleshooting']
            ],
            [
                'category' => 'Technical Support',
                'question' => 'The mobile app is crashing. What should I do?',
                'answer' => 'Please ensure your app is updated to the latest version. If the problem persists, try clearing the cache or reinstalling the app. Contact support if you need further assistance.',
                'tags' => ['mobile-app', 'troubleshooting']
            ],
            [
                'category' => 'Technical Support',
                'question' => 'How do I report a technical bug?',
                'answer' => 'You can report a bug through the "Help & Support" section in your account dashboard. Please provide as much detail as possible.',
                'tags' => ['troubleshooting']
            ],

            // Pricing and Plans
            [
                'category' => 'Pricing and Plans',
                'question' => 'What are the available subscription plans?',
                'answer' => 'We offer several plans, including a free tier for basic use and premium plans for advanced features. You can find details on our Pricing page.',
                'tags' => ['billing']
            ],
            [
                'category' => 'Pricing and Plans',
                'question' => 'Can I change my plan later?',
                'answer' => 'Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be prorated.',
                'tags' => ['billing', 'account-management']
            ],
            [
                'category' => 'Pricing and Plans',
                'question' => 'What payment methods do you accept?',
                'answer' => 'We accept all major credit cards, as well as payments via PayPal and bank transfer for annual subscriptions.',
                'tags' => ['billing']
            ],

            // User Guides
            [
                'category' => 'User Guides',
                'question' => 'How do I create a new student profile?',
                'answer' => 'To create a new student profile, navigate to the "Students" section and click the "Add New Student" button. Fill in the required information and save.',
                'tags' => ['features', 'account-management']
            ],
            [
                'category' => 'User Guides',
                'question' => 'How can I track student attendance?',
                'answer' => 'Attendance can be tracked from the "Halaqa" (Session) view. Simply mark each student as present, absent, or late for the session.',
                'tags' => ['features']
            ],
            [
                'category' => 'User Guides',
                'question' => 'Is it possible to export reports?',
                'answer' => 'Yes, all reports can be exported in PDF or CSV format. Look for the "Export" button on the top right of the report page.',
                'tags' => ['features', 'integrations']
            ]
        ];

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
                    'display_order' => 0,
                ]);

                // Attach tags
                $tagIds = $tags->whereIn('tag_slug', $faqData['tags'])->pluck('id');
                $faq->tags()->attach($tagIds);
            }
        }
    }
}
