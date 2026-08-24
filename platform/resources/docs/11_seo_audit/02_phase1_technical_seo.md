# المرحلة 1 — تحليل الاكتشاف التقني لمحركات البحث

## 1.1 ملف robots.txt

| العنصر | الحالة | التقييم |
| --- | --- | --- |
| الوجود | موجود | ✓ |
| حجب /admin/ | غير محجوب | ✗ |
| حجب /api/ | غير محجوب | ✗ |
| الإشارة إلى sitemap | غائبة | ✗ |
| الحجب الزائد | لا | ✓ |

**الخطورة الإجمالية:** متوسطة  
**ملاحظة:** غياب حجب `/admin/` لا يُشكّل خطراً أمنياً (المحتوى محمي بـ middleware)، لكنه يهدر زحف الـ crawl budget على صفحات لا قيمة لفهرستها.

---

## 1.2 ملف Sitemap.xml

**الحالة:** غائب تماماً.

**الصفحات التي يجب أن يشملها الـ sitemap:**

```txt
/                          — الرئيسية
/pillars                   — الأعمدة التقنية
/services                  — الخدمات المؤسسية
/about                     — من نحن
/pricing                   — الأسعار
/contact                   — تواصل معنا
/faq                       — الأسئلة الشائعة
/privacy-policy            — سياسة الخصوصية
/terms-of-use              — شروط الاستخدام
/docs/                     — التوثيق (الرئيسية)
/docs/00_introduction/...  — 49+ صفحة توثيق
```

**الإجمالي المقدَّر:** ~65 URL قابلة للفهرسة

**التوصية:** تثبيت `spatie/laravel-sitemap` وتوليد sitemap ديناميكي. يجب إضافة المسارات التالية يدوياً (لأنها ليست في نموذج eloquent):

```php
// في SitemapController أو scheduled command
Sitemap::create()
    ->add(Url::create('/'))
    ->add(Url::create('/pillars'))
    ->add(Url::create('/services'))
    ->add(Url::create('/about'))
    ->add(Url::create('/pricing'))
    ->add(Url::create('/contact'))
    ->add(Url::create('/faq'))
    // + كل صفحات /docs/ عبر DocsController::getDocsList()
    ->writeToFile(public_path('sitemap.xml'));
```

**الخطورة:** حرجة  
**التأثير المتوقع على الفهرسة:** عالي جداً

---

## 1.3 العلامات Canonical

**الحالة:** لا توجد علامات canonical صريحة في الكود.

**الخطورة:** متوسطة  
**التفسير:** حالياً الموقع بسيط بما يكفي لعدم وجود تعارضات canonical خطيرة، لكن مع نمو المحتوى ستصبح ضرورية.

**التوصية:** إضافة canonical tag افتراضي في `PublicLayout.tsx` يشير إلى الـ URL الحالي.

---

## 1.4 بنية إعادة التوجيه (Redirect Architecture)

**الحالة الحالية:**

- لا توجد redirects ظاهرة في `routes/web.php`
- كل مسار يُعيد Inertia response مباشرة

**المخاطر المحتملة:**

- `http://` vs `https://` redirect (يجب إجباره على مستوى الخادم)
- `www.` vs non-www (لا ينطبق على نطاق فرعي)
- Trailing slash consistency (غير مُعرَّف صراحةً)

**الخطورة:** منخفضة (افتراض أن الاستضافة تُطبّق HTTPS redirect)

---

## 1.5 عمق الزحف (Crawl Depth)

**بنية التنقل الحالية:**

```txt
الرئيسية (/)
├── /pillars
├── /services  
├── /about
├── /pricing
├── /contact
├── /faq
└── /docs/
    └── [49 صفحة على عمق 2-3]
```

**التقييم:** البنية ضحلة وصحية — لا صفحات يتيمة ظاهرة في التنقل الرئيسي.

**المخاطر:** صفحات التوثيق قد تكون يتيمة إذا كان التنقل الداخلي في الـ sidebar يعتمد على JavaScript فقط بدون روابط HTML قابلة للزحف.

**الخطورة:** متوسطة  
**التوصية:** التأكد من أن روابط sidebar التوثيق هي `<a href>` حقيقية وليست event handlers فقط.

---

## 1.6 تنفيذ JavaScript وتصيير SPA

هذا أكثر مشكلة تقنية تأثيراً على الفهرسة في الموقع.

### الهيكل الحالي

```txt
Laravel → Inertia.js → React (Client-Side Rendering)
```

### كيف يرى Googlebot الصفحة

**الطلب الأول (HTML):**

```html
<!DOCTYPE html>
<html lang="ar" dir="ltr">
<head>
  <title>QaydAPI</title>
  <!-- Cairo Font from Google Fonts -->
  <!-- Vite assets -->
</head>
<body>
  <div id="app" data-page='{"component":"Home","props":{"hero":{...},"footer":{...}}}'></div>
</body>
</html>
```

المحتوى المرئي في HTML الأولي = **صفر**.

**بعد تنفيذ JavaScript:** يظهر المحتوى الكامل.

### مشكلة إضافية: `dir="ltr"` في HTML للموقع العربي

```html
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="ltr">
```

الموقع عربي بالكامل تقريباً، لكن `dir` مضبوطة على `ltr` (اليسار لليمين). هذا خطأ صريح يُربك:

- محركات البحث في فهم اتجاه اللغة
- المتصفح في عرض النصوص العربية
- أدوات تحسين إمكانية الوصول

**الحل الفوري:**

```html
<html lang="ar" dir="rtl">
```

**الخطورة:** عالية (خطأ html lang + dir معاً)  
**الثقة:** 100% (مؤكد من الكود)

---

## 1.7 ملاحظات الأداء التقني

### وزن JavaScript

التطبيق يعتمد على حزمة Vite + React كاملة في الصفحات التسويقية. يُتوقع أن حجم الـ JavaScript bundle > 200KB (غير مضغوط)، مما يُبطّئ **First Contentful Paint (FCP)** و**Largest Contentful Paint (LCP)**.

### خطوط Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap">
```

تحميل 6 أوزان من Cairo قد يُضيف 150-300ms على الـ TTFB الفعلي للمستخدم.

**التوصية:**

- إضافة `font-display: swap`
- تحديد الأوزان المستخدمة فعلياً (غالباً 400، 600، 700 كافية)
- النظر في self-hosting الخط

### تقدير Core Web Vitals

| المقياس | التقدير | سبب التقدير |
| --- | --- | --- |
| LCP | بطيء (>2.5s) | SPA + external fonts + بدون SSR |
| CLS | جيد | بنية ثابتة معروفة |
| INP | جيد | تطبيق نظيف بدون تفاعل ثقيل |
| TTFB | مقبول-جيد | Laravel server response |

**الخطورة الإجمالية للأداء:** متوسطة-عالية للـ SEO، عالية لتجربة المستخدم

---

## 1.8 ملخص المرحلة الأولى

| المكوّن | الحالة | الأولوية |
| --- | --- | --- |
| robots.txt | موجود لكن ناقص | متوسطة |
| sitemap.xml | **غائب** | **حرجة** |
| Canonical tags | غائبة | متوسطة |
| HTML lang/dir | **خاطئ (ltr لموقع عربي)** | **عالية** |
| SSR/SSG | **غائب** | **عالية** |
| Crawl depth | جيد | منخفضة |
| Core Web Vitals | تقدير ضعيف | متوسطة |
| خطوط خارجية | تحتاج تحسين | منخفضة |
