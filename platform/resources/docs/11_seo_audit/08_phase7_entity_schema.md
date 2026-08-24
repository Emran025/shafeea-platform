# المرحلة 7 — تحليل الكيانات وبيانات Schema

## 7.1 سؤال أساسي: هل تعرف جوجل مَن هو قيد؟

**الجواب القصير: لا.**

لكي يفهم Google (وأنظمة البحث بالذكاء الاصطناعي) "قيد" كـ كيان مُحدَّد، يحتاج إلى إجابات واضحة على:

| السؤال | هل يُجيب عليه الموقع؟ |
|---|---|
| مَن تملك المنتج (الشركة)؟ | جزئياً (ACCSYSTEM مذكورة) |
| ما اسم المنتج الدقيق؟ | جزئياً ("قيد" في النصوص) |
| ما المشكلة التي يحلها؟ | نعم (في النصوص الداخلية) |
| مَن جمهوره المستهدف؟ | غير واضح |
| ما الذي يُميّزه عن المنافسين؟ | جزئياً |
| أين يمكن تحميله؟ | غير واضح (Play Store موجود؟) |
| ما نماذج التسعير؟ | في /pricing |

---

## 7.2 غياب JSON-LD Schema

**الحالة:** لا يوجد أي JSON-LD في الموقع.  
**الأثر:** جوجل لا يستطيع ربط محتوى الموقع بـ Knowledge Graph بدون structured data.

### Schema المطلوبة فوراً

#### 1. SoftwareApplication Schema (الأعلى أولوية)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "قيد",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Android, iOS",
  "description": "نظام محاسبة بقيد مزدوج مشفر من طرف إلى طرف للأفراد",
  "offers": {
    "@type": "Offer",
    "price": "...",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "ACCSYSTEM"
  },
  "inLanguage": ["ar", "en"],
  "featureList": [
    "تشفير E2EE",
    "Local-First Architecture",
    "Double-Entry Accounting",
    "Offline Support",
    "Bilateral Mediation"
  ]
}
```

#### 2. Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ACCSYSTEM",
  "url": "https://qayd.accsystemerp.com",
  "logo": "...",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "..."
  },
  "sameAs": [
    "https://play.google.com/store/apps/..."
  ]
}
```

#### 3. FAQPage Schema (لصفحة /faq)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "ما هو قيد؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "قيد هو تطبيق محاسبة شخصية يعمل بنظام القيد المزدوج..."
      }
    }
  ]
}
```

#### 4. WebSite Schema (للـ sitelinks search box المستقبلي)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "قيد",
  "url": "https://qayd.accsystemerp.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://qayd.accsystemerp.com/docs?q={search_term}",
    "query-input": "required name=search_term"
  }
}
```

---

## 7.3 مشاكل اتساق الكيان

### مشكلة 1: اسم التطبيق غير موحّد

في الكود المصدري:
- `config('app.name')` = **"QaydAPI"** (في app.blade.php)
- العنوان في Home.tsx = **"Home"**
- OG title = **"قيد (qayd) — التحكم المالي الكامل"**
- الـ app description = **"قيد"**
- Play Store = **"Qayd Business"** / **"Qayd"**

**المشكلة:** جوجل يرى ثلاثة أسماء مختلفة للكيان ذاته: "QaydAPI"، "قيد"، "Qayd". هذا يُضعف بناء الكيان في Knowledge Graph.

**الحل:** توحيد اسم التطبيق عبر كل نقطة تماس:
- `app.name` في config = "قيد | Qayd"
- Page title format = "قيد (qayd) — [وصف الصفحة]"
- OG title = "قيد (qayd) — [شعار]"

### مشكلة 2: `<html dir="ltr">` لموقع عربي

كما أُشير في المرحلة الأولى — هذا يُرسل إشارة متضاربة لجوجل:
- اللغة في الـ content: عربية
- اتجاه الـ HTML: LTR

**الحل:** `<html lang="ar" dir="rtl">`

### مشكلة 3: غياب الربط بـ Google Play

`google1ba3cc4c115ac1d9.html` موجود (تحقق Search Console)، لكن:
- لا يوجد رابط صريح لصفحة Google Play في الموقع
- لا يوجد `sameAs` يربط الموقع بحضور التطبيق الرقمي

---

## 7.4 تقييم جاهزية Knowledge Graph

| العنصر | الحالة | الثغرة |
|---|---|---|
| اسم الكيان موحّد | ✗ ضعيف | 3 أسماء مختلفة |
| وصف واضح للمنتج | جزئي | موجود في النصوص لكن بلا schema |
| ربط بمنصات التحميل | ✗ غائب | لا يوجد sameAs لـ Play Store |
| صفحة Wikipedia/Wikidata | ✗ غائب | طبيعي لشركة ناشئة |
| ذكر في مصادر خارجية | ✗ غائب | لا backlinks، لا mentions |
| Schema.org markup | ✗ غائب | لا JSON-LD على الإطلاق |

**درجة جاهزية Knowledge Graph:** 8/100

---

## 7.5 خطوات بناء سلطة الكيان

```
المرحلة 1 (فورية):
□ إضافة JSON-LD SoftwareApplication على الرئيسية
□ إضافة JSON-LD Organization
□ إضافة JSON-LD FAQPage على /faq
□ توحيد اسم التطبيق عبر الكود

المرحلة 2 (1-3 أشهر):
□ إنشاء صفحة Crunchbase للشركة
□ التواجد في Product Hunt
□ الحصول على mentions في مواقع تقنية عربية
□ توحيد الحضور في App Store وGoogle Play

المرحلة 3 (3-6 أشهر):
□ تقديم للـ App directories العربية
□ مقابلات في بودكاست التقنية العربية
□ توثيق المنتج في مستودع GitHub عام
```
