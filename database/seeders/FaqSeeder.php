<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\FaqCategory;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure categories, tags, and a user exist
        $categories = FaqCategory::all();
        $tags = Tag::all();
        $user = User::first(); 

        if ($categories->isEmpty() || $tags->isEmpty() || !$user) {
            $this->command->info('Please seed FAQ categories, tags, and users before running the FaqSeeder.');
            return;
        }

        $faqs = [
            // General Questions
            [
                'category' => 'أسئلة عامة',
                'question' => 'ما هي منصة شفيع؟',
                'answer' => 'شفيع هي منصة تعليمية متطورة مخصصة لإدارة الحلقات القرآنية والمؤسسات التعليمية الإسلامية. توفر أدوات شاملة لإدارة الطلاب والمعلمين ومتابعة التقدم في حفظ القرآن الكريم.',
                'tags' => ['getting-started', 'features']
            ],
            [
                'category' => 'أسئلة عامة',
                'question' => 'كيف يمكنني البدء باستخدام المنصة؟',
                'answer' => 'يمكنك البدء بإنشاء حساب مجاني من خلال صفحة التسجيل. ستحصل على فترة تجريبية مجانية لمدة 30 يوماً لاستكشاف جميع ميزات المنصة.',
                'tags' => ['getting-started', 'account-management']
            ],
            [
                'category' => 'أسئلة عامة',
                'question' => 'هل بياناتي آمنة على المنصة؟',
                'answer' => 'نعم، نحن نستخدم تشفيرًا متقدمًا ونسخًا احتياطية منتظمة. نلتزم بأعلى معايير الأمان الدولية وقوانين حماية البيانات. يمكنك مراجعة سياسة الخصوصية الخاصة بنا لمزيد من التفاصيل.',
                'tags' => ['security', 'privacy']
            ],
            [
                'category' => 'أسئلة عامة',
                'question' => 'هل تدعم المنصة التكامل مع أنظمة إدارة التعلم (LMS) الأخرى؟',
                'answer' => 'نعم، نوفر واجهة برمجة تطبيقات (API) قوية وموثقة جيدًا تتيح التكامل السلس مع أنظمة LMS الشهيرة مثل Moodle وBlackboard. يمكن للمطورين استخدام RESTful endpoints لمزامنة البيانات.',
                'tags' => ['integrations', 'features']
            ],

            // Account Management
            [
                'category' => 'إدارة الحساب',
                'question' => 'كيف أنشئ حساباً جديداً؟',
                'answer' => 'انقر على "التسجيل"، املأ البيانات المطلوبة، واتبع التعليمات. ستحصل على رابط تفعيل عبر البريد الإلكتروني.',
                'tags' => ['account-management', 'getting-started']
            ],
            [
                'category' => 'إدارة الحساب',
                'question' => 'نسيت كلمة المرور، ماذا أفعل؟',
                'answer' => 'انقر على "نسيت كلمة المرور" في صفحة تسجيل الدخول، أدخل بريدك الإلكتروني، وستصلك تعليمات إعادة التعيين.',
                'tags' => ['account-management', 'troubleshooting']
            ],
            [
                'category' => 'إدارة الحساب',
                'question' => 'ما هي أفضل الممارسات لتأمين حسابي باستخدام المصادقة الثنائية (2FA)؟',
                'answer' => 'نوصي بشدة بتمكين المصادقة الثنائية باستخدام تطبيق موثوق مثل Google Authenticator أو Authy. قم بتخزين رموز الاسترداد الاحتياطية في مكان آمن. لا تشارك رموزك أبدًا وتجنب استخدام الرسائل القصيرة SMS كطريقة أساسية للمصادقة.',
                'tags' => ['security', 'account-management']
            ],

            // Features
            [
                'category' => 'الميزات',
                'question' => 'كيف أدير بيانات الطلاب؟',
                'answer' => 'من لوحة التحكم، اذهب إلى "إدارة الطلاب" حيث يمكنك إضافة طلاب جدد، تعديل بياناتهم، وتتبع تقدمهم في الحفظ.',
                'tags' => ['features', 'student-management']
            ],
            [
                'category' => 'الميزات',
                'question' => 'كيف أتابع تقدم الطلاب؟',
                'answer' => 'نوفر نظام متابعة شامل يسجل ما تم حفظه ومراجعته ودرجات التقييم في رسوم بيانية واضحة وتقارير مفصلة.',
                'tags' => ['features', 'reporting']
            ],
            [
                'category' => 'الميزات',
                'question' => 'ما أنواع التقارير المتاحة؟',
                'answer' => 'نوفر تقارير متنوعة: تقدم الطالب الفردي، تقارير الصف، الحضور والغياب، والأداء الشهري والسنوي.',
                'tags' => ['features', 'reporting']
            ],
            [
                'category' => 'الميزات',
                'question' => 'كيف يمكنني استخدام Webhooks لتلقي إشعارات فورية بالأحداث؟',
                'answer' => 'يمكنك تكوين Webhooks من قسم "التكاملات" في إعدادات المطور. قم بإدخال عنوان URL الخاص بنقطة النهاية (Endpoint) واختر الأحداث التي ترغب في الاشتراك بها، مثل `student.created` أو `submission.graded`.',
                'tags' => ['features', 'integrations']
            ],

            // Technical Support
            [
                'category' => 'الدعم الفني',
                'question' => 'أواجه خطأ 502 Bad Gateway عند محاولة الوصول إلى لوحة التحكم، ما السبب؟',
                'answer' => 'عادةً ما يشير هذا الخطأ إلى مشكلة مؤقتة في الاتصال بين خوادمنا. فريقنا يعمل على حلها. يُنصح بمسح ذاكرة التخزين المؤقت للمتصفح والمحاولة مرة أخرى بعد بضع دقائق. إذا استمرت المشكلة، يرجى التحقق من صفحة حالة الخدمة أو الاتصال بالدعم الفني.',
                'tags' => ['troubleshooting', 'technical-support']
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
                'tags' => ['security', 'technical-support']
            ],

            // Billing and Plans
            [
                'category' => 'الأسعار والخطط',
                'question' => 'ما هي خطط الأسعار المتاحة؟',
                'answer' => 'نوفر ثلاث خطط رئيسية: الأساسية (299 ريال)، المتقدمة (599 ريال)، والاحترافية (1299 ريال شهرياً). كل خطة تناسب حجم مؤسسة مختلف. يمكنك الاطلاع على صفحة الأسعار لمقارنة الميزات.',
                'tags' => ['billing', 'pricing']
            ],
            [
                'category' => 'الأسعار والخطط',
                'question' => 'ما هي طرق الدفع المقبولة؟',
                'answer' => 'نقبل جميع البطاقات الائتمانية الرئيسية، التحويل البنكي، ومدى. الدفع آمن ومشفر بالكامل.',
                'tags' => ['billing', 'payment']
            ],
            [
                'category' => 'الأسعار والخطط',
                'question' => 'ما هي سياسة الاسترداد؟',
                'answer' => 'نوفر ضمان استرداد لمدة 14 يوماً من تاريخ الاشتراك الأول. يمكنك إلغاء الاشتراك في أي وقت دون رسوم إضافية.',
                'tags' => ['billing', 'policy']
            ],
            [
                'category' => 'الأسعار والخطط',
                'question' => 'هل يتم احتساب استهلاك الـ API ضمن خطط التسعير؟',
                'answer' => 'نعم، كل خطة تسعير تأتي مع حد معين من استدعاءات الـ API شهريًا. تتضمن خطة "Enterprise" عددًا غير محدود من الاستدعاءات. يمكنك تتبع استهلاكك عبر لوحة التحكم.',
                'tags' => ['billing', 'integrations']
            ],
        ];

        foreach ($faqs as $faqData) {
            $category = $categories->firstWhere('name', $faqData['category']);
            
            if ($category) {
                // Use smartUpdateOrCreate to avoid duplicates based on the Question text
                $faq = $this->smartUpdateOrCreate(Faq::class, 
                    ['question' => $faqData['question']], 
                    [
                        'category_id' => $category->id,
                        'answer' => $faqData['answer'],
                        'created_by' => $user->id,
                        'is_active' => true,
                        'view_count' => rand(0, 150),
                        'display_order' => 0,
                    ]
                );

                // Sync Tags (Attach without duplicating)
                $tagIds = $tags->whereIn('tag_slug', $faqData['tags'])->pluck('id');
                $faq->tags()->sync($tagIds);
            }
        }
    }

    /**
     * Helper to safely update or create records, handling SoftDeletes automatically.
     */
    private function smartUpdateOrCreate($modelClass, array $searchConditions, array $data = [])
    {
        $query = $modelClass::query();

        if (in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses_recursive($modelClass))) {
            $query->withTrashed();
        }

        $record = $query->updateOrCreate($searchConditions, $data);

        if (method_exists($record, 'trashed') && $record->trashed()) {
            $record->restore();
        }

        return $record;
    }
}