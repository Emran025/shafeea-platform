<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subscriptionPlans = [
            [
                'name' => 'الخطة الأساسية',
                'slug' => 'basic',
                'price' => 0,
                'currency' => 'SAR',
                'billing_period' => 'yearly',
                'features' => [
                    '100 students',
                    '10 teachers',
                    'Basic Reports',
                    'Email Support',
                    '5GB Storage',
                ],
                'is_recommended' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'الخطة المتوسطة',
                'slug' => 'medium',
                'price' => 249,
                'currency' => 'SAR',
                'billing_period' => 'yearly',
                'features' => [
                    '250 students',
                    '25 teachers',
                    'Basic Reports',
                    'Email Support',
                    '5GB Storage',
                ],
                'is_recommended' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'الخطة المتقدمة',
                'slug' => 'advanced',
                'price' => 490,
                'currency' => 'SAR',
                'billing_period' => 'yearly',
                'features' => [
                    '1000 students',
                    '75 teachers',
                    'All Reports',
                    'Live Support',
                    '50GB Storage',
                    'Mobile App',
                ],
                'is_recommended' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'الخطة الاحترافية',
                'slug' => 'professional',
                'price' => 990,
                'currency' => 'SAR',
                'billing_period' => 'yearly',
                'features' => [
                    'Unlimited students/teachers',
                    'Custom Reports',
                    'Priority Support',
                    'Unlimited Storage',
                    'Full Customization',
                ],
                'is_recommended' => false,
                'sort_order' => 4,
            ],
        ];

        foreach ($subscriptionPlans as $subscriptionPlanData) {
            SubscriptionPlan::updateOrCreate(
                ['slug' => $subscriptionPlanData['slug']],
                $subscriptionPlanData
            );
        }
        
        $this->command->info('✅ Created ' . count($subscriptionPlans) . ' subscription Plans');

    }
}
