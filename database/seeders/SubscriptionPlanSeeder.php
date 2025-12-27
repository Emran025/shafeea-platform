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
                'name' => 'الباقة الأساسية',
                'slug' => 'basic',
                'price' => 0,
                'currency' => 'SAR',
                'billing_period' => 'yearly',
                'features' => [
                    'إدارة حتى 50 طالباً بفعالية',
                    'دعم لـ 5 معلمين بحسابات خاصة',
                    'تقارير المتابعة اليومية الأساسية',
                    'دعم فني عبر البريد الإلكتروني',
                    'مساحة تخزين 2 جيجابايت للمستندات',
                    'لوحة تحكم سهلة الاستخدام',
                ],
                'is_recommended' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'باقة النمو',
                'slug' => 'growth',
                'price' => 499,
                'currency' => 'SAR',
                'billing_period' => 'yearly',
                'features' => [
                    'إدارة حتى 200 طالب',
                    'دعم لـ 20 معلماً بحسابات متقدمة',
                    'تقارير أداء تفصيلية واحصائيات نمو',
                    'دعم فني عبر المحادثة المباشرة',
                    'مساحة تخزين 10 جيجابايت',
                    'نظام إشعارات ذكي للطلاب وأولياء الأمور',
                    'إدارة الحلقات والمجموعات التعليمية',
                ],
                'is_recommended' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'الباقة الاحترافية',
                'slug' => 'professional',
                'price' => 999,
                'currency' => 'SAR',
                'billing_period' => 'yearly',
                'features' => [
                    'إدارة حتى 500 طالب',
                    'دعم لـ 50 معلماً مع صلاحيات متقدمة',
                    'تحليلات ذكاء أعمال وتقارير مخصصة',
                    'دعم فني مخصص وأولوية في الرد',
                    'مساحة تخزين 50 جيجابايت',
                    'تطبيق جوال مخصص للمؤسسة',
                    'نظام إدارة مالي متكامل للحلقات',
                    'تكامل مع خدمات الرسائل القصيرة',
                ],
                'is_recommended' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'باقة المؤسسات',
                'slug' => 'enterprise',
                'price' => 1999,
                'currency' => 'SAR',
                'billing_period' => 'yearly',
                'features' => [
                    'عدد غير محدود من الطلاب والمعلمين',
                    'تقارير استراتيجية شاملة للمؤسسة',
                    'مدير حساب مخصص للدعم الفني',
                    'مساحة تخزين مفتوحة',
                    'تخصيص كامل للنظام وهوية المؤسسة',
                    'تكامل مع الأنظمة الخارجية عبر API',
                    'نسخ احتياطي يومي ومتقدم',
                    'تدريب مباشر للطاقم الإداري والتعليمي',
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
