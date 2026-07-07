@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'أهلاً بك في ' . ($applicant->school?->name ?? 'المؤسسة') . ' — تم قبول طلبك')
@section('preheader', 'يمكنك الآن تحميل تطبيق المعلم والبدء في إدارة الحلقات والطلاب.')

@section('header-badge', 'قبول المعلم')
@section('header-title', 'مرحباً بك في فريق التدريس')
@section('header-subtitle', 'المرحلة الأخيرة — تمت الموافقة على طلب انضمامك')

@section('status-type', 'success')
@section('status-bar', 'تم قبولك معلماً بنجاح')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Opening Basmala --}}
@include('emails.partials.components.basmala')

{{-- Greeting --}}
<p class="greeting" style="font-size:16px; font-weight:600; color:#0d1b2a; margin:0 0 8px; line-height:1.5; font-family:'Cairo', sans-serif;">الأستاذ/ة {{ $applicant->user?->name ?? 'المعلم الكريم' }}،</p>

{{-- Opening body --}}
<p class="body-text" style="font-size:14px; font-weight:400; color:#2d3748; line-height:1.85; margin:0 0 20px; font-family:'Cairo', sans-serif;">
    يسرنا أن نُبلغكم بأن طلب انضمامكم كمعلم في مؤسسة
    <strong>«{{ $applicant->school?->name ?? '—' }}»</strong>
    عبر منصة شفيع قد تمت الموافقة عليه رسمياً.
    نتشرف بانضمامكم إلى فريق التدريس ونتطلع لمسيرة علمية مثمرة معكم.
</p>

{{-- Enrollment details --}}
<div class="info-box" style="background-color:#f8f9fb; border:1px solid #e0e1dd; border-right:3px solid #1b263b; padding:18px 20px 16px; margin:0 0 20px;">
    <p class="info-box-title" style="font-size:10px; font-weight:700; color:#1b263b; margin:0 0 12px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">تفاصيل الانضمام</p>
    @include('emails.partials.components.data-table', [
        'rows' => [
            ['label' => 'اسم المعلم',         'value' => $applicant->user?->name   ?? '—'],
            ['label' => 'المؤسسة',             'value' => $applicant->school?->name ?? '—'],
            ['label' => 'البريد الإلكتروني',   'value' => $applicant->user?->email  ?? '—', 'dir' => 'ltr'],
            ['label' => 'تاريخ القبول',        'value' => ($approvedAt ?? now())->format('Y/m/d — H:i')],
        ]
    ])
</div>

{{-- Onboarding steps --}}
<p class="section-heading" style="font-size:10px; font-weight:700; color:#007aaa; margin:28px 0 12px; padding-bottom:8px; padding-right:10px; border-bottom:1px solid #e0e1dd; border-right:3px solid #00a0da; letter-spacing:0.08em; text-transform:uppercase; font-family:'Cairo', sans-serif;">خطواتك القادمة:</p>
<table class="step-list" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%; border:1px solid #e0e1dd; background-color:#f8f9fb; border-right:3px solid #00a0da; margin:0 0 24px;">
    <tr><td class="step-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; border-bottom:1px solid #eaecef; font-family:'Cairo', sans-serif;"><span class="step-number" style="display:inline-block; min-width:24px; color:#00a0da; font-weight:700; margin-left:6px; font-size:12px;">1.</span> قم بتحميل تطبيق المعلم على هاتفك</td></tr>
    <tr><td class="step-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; border-bottom:1px solid #eaecef; font-family:'Cairo', sans-serif;"><span class="step-number" style="display:inline-block; min-width:24px; color:#00a0da; font-weight:700; margin-left:6px; font-size:12px;">2.</span> سجّل الدخول باستخدام بريدك الإلكتروني وكلمة المرور التي أنشأتها</td></tr>
    <tr><td class="step-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; font-family:'Cairo', sans-serif;"><span class="step-number" style="display:inline-block; min-width:24px; color:#00a0da; font-weight:700; margin-left:6px; font-size:12px;">3.</span> استعرض الحلقات المتاحة وابدأ رحلة التدريس</td></tr>
</table>

{{-- Credentials notice — uses info-box--notice (amber) for security warnings --}}
<div class="info-box info-box--notice" style="background-color:#fef8ee; border:1px solid #f0d08a; border-right:3px solid #d4880a; padding:16px 18px; margin:0 0 20px; font-family:'Cairo', sans-serif;">
    <p class="info-box-title" style="font-size:10px; font-weight:700; color:#7a4d0a; margin:0 0 10px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">بيانات الدخول — احتفظ بها بسرية تامة</p>
    <p class="info-box-body" style="font-size:13px; color:#2d3748; line-height:1.85; margin:0; font-family:'Cairo', sans-serif;">
        البريد الإلكتروني: <strong dir="ltr" lang="en" style="font-family:Consolas,'Courier New',monospace; direction:ltr; unicode-bidi:embed;">{{ $applicant->user?->email ?? '—' }}</strong><br>
        كلمة المرور: التي أنشأتها أثناء التسجيل — لا تشاركها مع أحد.
    </p>
</div>

{{-- Primary action --}}
@php $appUrl = config('app.teacher_app_url', config('app.url')); @endphp
@include('emails.partials.cta-button', [
    'url'   => $appUrl,
    'label' => 'فتح تطبيق المعلم',
    'style' => 'primary',
])

{{-- Fallback URL --}}
<p class="fallback-url-hint" style="font-size:12px; color:#778da9; line-height:1.65; text-align:center; margin:-10px 0 8px; font-family:'Cairo', sans-serif;">أو انسخ الرابط أدناه في متصفحك:</p>
<p class="fallback-url" lang="en" xml:lang="en" style="font-family:Consolas,'Courier New',monospace; font-size:11px; color:#415a77; word-break:break-all; background-color:#f8f9fb; padding:10px 14px; border:1px solid #e0e1dd; text-align:left; margin:0 0 20px; direction:ltr; unicode-bidi:embed; display:block; line-height:1.7;">{{ $appUrl }}</p>

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature" style="margin:0; font-size:13px; color:#778da9; text-align:center; line-height:1.9; font-family:'Cairo', sans-serif;">
    جزاكم الله خيراً على جهدكم في نشر العلم.<br>
    فريق منصة <strong style="color:#007aaa; font-weight:700;">شفيع</strong>
</p>

{{-- Reference number --}}
<p class="reference-line" style="font-size:11px; color:#778da9; text-align:center; margin:16px 0 0; letter-spacing:0.03em; font-family:'Cairo', sans-serif;">
    رقم المرجع: <span class="reference-code" style="font-family:Consolas,'Courier New',monospace; font-size:11px; color:#415a77; direction:ltr; unicode-bidi:embed;">TCH-{{ str_pad($applicant->id, 6, '0', STR_PAD_LEFT) }}</span>
</p>

@endsection
