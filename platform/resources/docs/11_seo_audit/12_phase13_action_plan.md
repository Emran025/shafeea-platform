# المرحلة 13 — خطة العمل التنفيذية

## الإجراءات مُجمَّعة حسب الأثر والأولوية

---

## 🔴 حرجة — تُعيق الرؤية الآن

هذه الإصلاحات تستغرق ساعات لكنها تُحدث أكبر تأثير فوري.

---

### CR-1: تصحيح `<html dir="ltr">` → `dir="rtl"`

**الملف:** `resources/views/app.blade.php`  
**الوقت:** 5 دقائق  
**الأثر:** إزالة إشارة مربكة لجوجل + تحسين تجربة المستخدم

```html
<!-- قبل -->
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="ltr">

<!-- بعد -->
<html lang="ar" dir="rtl">
```

---

### CR-2: تصحيح عنوان الصفحة الرئيسية

**الملف:** `resources/js/Pages/Home.tsx`  
**الوقت:** 5 دقائق  
**الأثر:** أول شيء يراه جوجل — "Home" = فاشل، يجب أن يكون الكلمة المفتاحية المستهدفة

```tsx
// قبل
<title>Home</title>

// بعد
<title>قيد (qayd) — تطبيق محاسبة شخصية بالقيد المزدوج | مشفر ومحلي</title>
```

---

### CR-3: توحيد اسم التطبيق

**الملف:** `config/app.php`  
**الوقت:** 5 دقائق

```php
// قبل
'name' => env('APP_NAME', 'QaydAPI'),

// بعد
'name' => env('APP_NAME', 'قيد | Qayd'),
```

---

### CR-4: تحديث robots.txt

**الملف:** `public/robots.txt`  
**الوقت:** 10 دقائق

```txt
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /login
Disallow: /logout
Disallow: /verify-email/
Disallow: /reset-password/

Sitemap: https://qayd.accsystemerp.com/sitemap.xml
```

---

### CR-5: إنشاء sitemap.xml

**الوقت:** 2-4 ساعات  
**التبعيات:** `composer require spatie/laravel-sitemap`

**خطوات التنفيذ:**

```bash
composer require spatie/laravel-sitemap
```

```php
// routes/web.php أو SitemapController جديد
Route::get('/sitemap.xml', function () {
    $sitemap = \Spatie\Sitemap\Sitemap::create()
        ->add(\Spatie\Sitemap\Tags\Url::create('/')
            ->setChangeFrequency('weekly')->setPriority(1.0))
        ->add(\Spatie\Sitemap\Tags\Url::create('/pillars')
            ->setChangeFrequency('monthly')->setPriority(0.8))
        ->add(\Spatie\Sitemap\Tags\Url::create('/services')
            ->setChangeFrequency('monthly')->setPriority(0.8))
        ->add(\Spatie\Sitemap\Tags\Url::create('/about')
            ->setChangeFrequency('monthly')->setPriority(0.7))
        ->add(\Spatie\Sitemap\Tags\Url::create('/pricing')
            ->setChangeFrequency('weekly')->setPriority(0.9))
        ->add(\Spatie\Sitemap\Tags\Url::create('/faq')
            ->setChangeFrequency('monthly')->setPriority(0.8))
        ->add(\Spatie\Sitemap\Tags\Url::create('/contact')
            ->setChangeFrequency('yearly')->setPriority(0.5));
    
    // إضافة صفحات التوثيق
    $docFiles = glob(resource_path('docs/**/*.md'));
    foreach ($docFiles as $file) {
        $path = str_replace(resource_path('docs'), '', $file);
        $path = str_replace('.md', '', $path);
        $path = str_replace('.mdx', '', $path);
        $urlPath = '/docs' . str_replace('_', '-', $path);
        $sitemap->add(\Spatie\Sitemap\Tags\Url::create($urlPath)
            ->setChangeFrequency('monthly')->setPriority(0.6));
    }
    
    return response($sitemap->render(), 200)
        ->header('Content-Type', 'application/xml');
});
```

**بعد الإنشاء:** تقديم الـ sitemap في Google Search Console.

---

### CR-6: إضافة JSON-LD Schema للصفحة الرئيسية

**الملف:** `resources/js/Pages/Home.tsx`  
**الوقت:** 30 دقيقة  

```tsx
<Head>
  <title>قيد (qayd) — تطبيق محاسبة شخصية بالقيد المزدوج | مشفر ومحلي</title>
  <meta name="description" content="قيد: تطبيق محاسبة شخصية للأفراد بنظام القيد المزدوج الكامل. تشفير E2EE، بيانات على جهازك، وساطة ثنائية. للسعودية والإمارات والخليج." />
  <meta property="og:title" content="قيد (qayd) — محاسبة شخصية مشفرة بالقيد المزدوج" />
  <meta property="og:description" content="تطبيق محاسبة شخصية مشفر من طرف إلى طرف. بيانات على جهازك. قيد مزدوج كامل. للأفراد والمهنيين." />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ar_SA" />
  <meta name="robots" content="index, follow" />
  <script type="application/ld+json">{JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "قيد",
    "alternateName": "Qayd",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Android, iOS",
    "description": "تطبيق محاسبة شخصية بالقيد المزدوج الكامل مع تشفير E2EE ومعمارية Local-First. بيانات على جهازك فقط.",
    "inLanguage": ["ar"],
    "author": {
      "@type": "Organization",
      "name": "ACCSYSTEM",
      "url": "https://qayd.accsystemerp.com"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "تشفير E2EE كامل",
      "Local-First Architecture",
      "قيد مزدوج احترافي",
      "وساطة مالية ثنائية",
      "يعمل بدون إنترنت",
      "بيانات على جهازك"
    ]
  })}</script>
</Head>
```

---

## 🟠 عالية التأثير — نمو كبير

---

### HI-1: SSR للصفحات التسويقية

**الوقت:** 1-2 أسبوع  
**الأثر:** الأكبر على قابلية الفهرسة

**الخيار السريع (بدون SSR كامل):** تحويل الصفحات التسويقية الرئيسية إلى Blade templates مع محتوى static، مع الإبقاء على Inertia للـ admin فقط.

**الخيار الصحيح (SSR كامل):**

```bash
npm install @inertiajs/react
# تفعيل SSR في inertia.php
php artisan inertia:start-ssr
```

---

### HI-2: مدونة عربية — 10 مقالات الأولى

**الوقت:** 2-4 أسابيع  
**الأثر:** أعلى عائد SEO على المدى المتوسط

**المقالات الـ 10 الأولى مُرتَّبة حسب الأولوية:**

```txt
1. "القيد المزدوج: الدليل الكامل للمبتدئين" — 3000 كلمة
2. "من يملك بياناتك المالية؟ الحقيقة المقلقة" — 2000 كلمة
3. "كيف تُدير الديون مع الأصدقاء بدون إحراج" — 2000 كلمة
4. "الفرق بين المدين والدائن: شرح مبسط بأمثلة يومية" — 1500 كلمة
5. "تطبيقات المحاسبة الشخصية: مقارنة شاملة 2025" — 2500 كلمة
6. "كيف تُنشئ ميزانيتك الشخصية بطريقة محاسبية صحيحة" — 2000 كلمة
7. "E2EE في تطبيقات المالية الشخصية: ما تحتاج معرفته" — 1500 كلمة
8. "Local-First Software: مستقبل التطبيقات الحريصة على الخصوصية" — 1500 كلمة
9. "كيف تُسجّل دخل الفريلانسر في تطبيق محاسبة" — 1500 كلمة
10. "قيد مقابل Firefly III: أيهما يناسب المستخدم العربي؟" — 2000 كلمة
```

---

### HI-3: تحسين meta tags لصفحات التوثيق

**الوقت:** 1 أسبوع  
**الأثر:** تحويل 49 صفحة جاهزة إلى أصول SEO فعلية

**في `DocsController.php`:** استخراج الـ H1 من كل ملف Markdown وتعيينه كـ `meta title` مع إضافة "| توثيق قيد".

**إضافة meta description:** أول فقرة من كل صفحة توثيق كـ description.

---

### HI-4: صفحات Landing مُحسَّنة (5 صفحات)

**الوقت:** 2 أسبوع  
**الأثر:** استهداف مباشر للكلمات التجارية

```txt
/محاسبة-شخصية      → "تطبيق محاسبة شخصية عربي"
/قيد-مزدوج         → "محاسبة بالقيد المزدوج للأفراد"
/تشفير-مالي        → "تطبيق مالي مشفر E2EE"
/ادارة-الديون      → "إدارة الديون الشخصية"
/بدون-سحابة        → "تطبيق محاسبة offline"
```

---

## 🟡 استراتيجية — تنافسية طويلة الأمد

---

### ST-1: الانتقال إلى دومين مستقل

**الجدول الزمني:** الشهر 3-4  
**الخطوات:**

1. تسجيل `qayd.app` أو `getqayd.com`
2. إعداد 301 redirects من الدومين القديم
3. تحديث Search Console
4. تحديث Google Play وApp Store

---

### ST-2: استراتيجية بناء الروابط

**الجدول الزمني:** الشهر 2-6  

```txt
أ) الحضور في منصات التقييم:
   - Product Hunt (إطلاق رسمي)
   - AlternativeTo (قيد كبديل لـ Firefly III/GnuCash)
   - Trustpilot العربي

ب) التواجد في مجتمعات التقنية:
   - Hacker News (Show HN post)
   - Reddit r/personalfinance, r/privacy
   - مجتمعات التقنية العربية

ج) التعاون مع المحتوى:
   - مقابلات في بودكاست "تك عربي"، "عرب هاردوير"
   - مقالات ضيف في مدونات التقنية المالية
```

---

### ST-3: Topical Authority في المحاسبة الشخصية العربية

**الجدول الزمني:** الشهر 4-12  

الهدف: أن يُعتبر qayd.com المرجع الأول للمحاسبة الشخصية العربية — مثلما يُعتبر Wafeq مرجعاً لمحاسبة الشركات الصغيرة.

**خطة المحتوى الاستراتيجي:**

```txt
- قسم "مدرسة المحاسبة الشخصية" — 30+ مقالة تعليمية
- قسم "الخصوصية المالية" — 15+ مقالة تخصصية
- قسم "المقارنات" — 10+ مقالات تنافسية
- قسم "أدلة المستخدم" — 20+ دليل تطبيقي
```

---

## 🟢 هيمنة السوق — قيادة الفئة

---

### ML-1: هيمنة البحث الذكاء الاصطناعي

**الجدول الزمني:** الشهر 6-12  

**الهدف:** عندما يسأل أي شخص ChatGPT أو Gemini أو Perplexity "ما أفضل تطبيق محاسبة شخصية عربي مشفر؟" — يظهر قيد في الإجابة.

**كيف يحدث هذا:**

1. محتوى مرجعي واضح ومُحكم على الموقع
2. ذكر في مصادر خارجية موثوقة (HN، GitHub، مدونات)
3. Schema markup كامل يُعرّف قيد كـ entity
4. نمط الإجابة المباشرة (featured snippet style)

---

### ML-2: السيطرة على البحث الصوتي العربي

**الجدول الزمني:** الشهر 8-12  

محتوى FAQ مُحسَّن للأسئلة الصوتية:

- "يا سيري، ما أفضل تطبيق محاسبة شخصية عربي؟"
- "يا جوجل، كيف أُسجّل مصاريفي اليومية؟"

---

## ملخص قائمة الإصلاحات المُرتَّبة

| # | الإجراء | الأولوية | الوقت | الأثر |
| --- | --- | --- | --- | --- |
| 1 | تصحيح `dir="ltr"` → `dir="rtl"` | 🔴 حرجة | 5 دقائق | عالي |
| 2 | تصحيح `<title>Home</title>` | 🔴 حرجة | 5 دقائق | عالي |
| 3 | توحيد `app.name` | 🔴 حرجة | 5 دقائق | متوسط |
| 4 | تحديث robots.txt | 🔴 حرجة | 10 دقائق | متوسط |
| 5 | إضافة JSON-LD Schema | 🔴 حرجة | 30 دقيقة | عالي جداً |
| 6 | إنشاء sitemap.xml | 🔴 حرجة | 3 ساعات | عالي جداً |
| 7 | تقديم Sitemap في Search Console | 🔴 حرجة | 10 دقائق | عالي جداً |
| 8 | تحسين meta tags للتوثيق | 🟠 عالية | 1 أسبوع | عالي |
| 9 | SSR للصفحات التسويقية | 🟠 عالية | 1-2 أسبوع | عالي جداً |
| 10 | مدونة — 10 مقالات أولى | 🟠 عالية | 4 أسابيع | عالي جداً |
| 11 | 5 صفحات Landing مُحسَّنة | 🟠 عالية | 2 أسبوع | عالي |
| 12 | الحضور في Product Hunt | 🟡 استراتيجية | 1 أسبوع | متوسط-عالي |
| 13 | انتقال للدومين المستقل | 🟡 استراتيجية | 2 شهر | عالي جداً |
| 14 | 20+ مقالة إضافية | 🟡 استراتيجية | 3 أشهر | عالي جداً |
| 15 | بناء الروابط الخلفية | 🟡 استراتيجية | 4-6 أشهر | عالي |
