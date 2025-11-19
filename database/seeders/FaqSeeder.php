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
                'category' => 'أسئلة عامة',
                'question' => 'ما هي البنية التحتية التقنية الأساسية للمنصة؟',
                'answer' => 'تعتمد المنصة على بنية الخدمات المصغرة (Microservices) المستضافة على AWS، مما يضمن قابلية التوسع العالية والتوافرية. نستخدم Kubernetes لإدارة الحاويات وقواعد بيانات Aurora لأداء مثالي.',
                'tags' => ['getting-started', 'features']
            ],
            [
                'category' => 'أسئلة عامة',
                'question' => 'هل تدعم المنصة التكامل مع أنظمة إدارة التعلم (LMS) الأخرى؟',
                'answer' => 'نعم، نوفر واجهة برمجة تطبيقات (API) قوية وموثقة جيدًا تتيح التكامل السلس مع أنظمة LMS الشهيرة مثل Moodle وBlackboard. يمكن للمطورين استخدام RESTful endpoints لمزامنة البيانات.',
                'tags' => ['getting-started', 'integrations']
            ],

            // Technical Support
            [
                'category' => 'الدعم الفني',
                'question' => 'أواجه خطأ 502 Bad Gateway عند محاولة الوصول إلى لوحة التحكم، ما السبب؟',
                'answer' => 'عادةً ما يشير هذا الخطأ إلى مشكلة مؤقتة في الاتصال بين خوادمنا. فريقنا يعمل على حلها. يُنصح بمسح ذاكرة التخزين المؤقت للمتصفح والمحاولة مرة أخرى بعد بضع دقائق. إذا استمرت المشكلة، يرجى التحقق من صفحة حالة الخدمة أو الاتصال بالدعم الفني.',
                'tags' => ['troubleshooting']
            ],
            [
                'category' => 'الدعم الفني',
                'question' => 'تطبيق الجوال يستهلك الكثير من طاقة البطارية، هل هناك حل؟',
                'answer' => 'نحن ندرك هذه المشكلة في الإصدار الحالي ونعمل على تحسين أداء البطارية في التحديث القادم (v2.5.1). كحل مؤقت، يمكنك تعطيل الإشعارات الفورية وتحديث المزامنة الخلفية من إعدادات التطبيق.',
                'tags' => ['mobile-app', 'troubleshooting']
            ],
            [
                'category' => 'الدعم الفني',
                'question' => 'كيف يمكنني الإبلاغ عن ثغرة أمنية (Vulnerability)؟',
                'answer' => 'نحن نأخذ الأمان على محمل الجد. يرجى إرسال تقرير مفصل عن الثغرة إلى security@example.com مع خطوات واضحة لإعادة إنتاج المشكلة. نحن نتبع سياسة الإفصاح المسؤول ونقدر مساهمات الباحثين الأمنيين.',
                'tags' => ['troubleshooting', 'security']
            ],

            // Pricing and Plans
            [
                'category' => 'الأسعار والخطط',
                'question' => 'هل يتم احتساب استهلاك الـ API ضمن خطط التسعير؟',
                'answer' => 'نعم، كل خطة تسعير تأتي مع حد معين من استدعاءات الـ API شهريًا. تتضمن خطة "Enterprise" عددًا غير محدود من الاستدعاءات. يمكنك تتبع استهلاكك عبر لوحة التحكم.',
                'tags' => ['billing', 'integrations']
            ],
            [
                'category' => 'الأسعار والخطط',
                'question' => 'كيف يتم التعامل مع الفواتير للخدمات الإضافية مثل التخزين السحابي الإضافي؟',
                'answer' => 'يتم إصدار فاتورة بالخدمات الإضافية بشكل منفصل في نهاية كل دورة فوترة. تعتمد التكلفة على الاستخدام الفعلي (Pay-as-you-go) ويمكن مراقبتها من قسم "الفواتير" في حسابك.',
                'tags' => ['billing', 'account-management']
            ],

            // User Guides
            [
                'category' => 'أدلة المستخدم',
                'question' => 'كيف يمكنني استخدام Webhooks لتلقي إشعارات فورية بالأحداث؟',
                'answer' => 'يمكنك تكوين Webhooks من قسم "التكاملات" في إعدادات المطور. قم بإدخال عنوان URL الخاص بنقطة النهاية (Endpoint) واختر الأحداث التي ترغب في الاشتراك بها، مثل `student.created` أو `submission.graded`.',
                'tags' => ['features', 'integrations']
            ],
            [
                'category' => 'أدلة المستخدم',
                'question' => 'ما هي أفضل الممارسات لتأمين حسابي باستخدام المصادقة الثنائية (2FA)؟',
                'answer' => 'نوصي بشدة بتمكين المصادقة الثنائية باستخدام تطبيق موثوق مثل Google Authenticator أو Authy. قم بتخزين رموز الاسترداد الاحتياطية في مكان آمن. لا تشارك رموزك أبدًا وتجنب استخدام الرسائل القصيرة SMS كطريقة أساسية للمصادقة.',
                'tags' => ['features', 'account-management', 'security']
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
