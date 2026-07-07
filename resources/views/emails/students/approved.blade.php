@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'مرحباً ' . ($applicant->user?->name ?? '') . ' — تم قبولك في ' . ($applicant->school?->name ?? 'المؤسسة'))
@section('preheader', 'يمكنك الآن تحميل التطبيق والبدء في رحلة حفظ القرآن الكريم — كل الخطوات بالداخل.')

@section('header-badge', 'قبول الطالب')
@section('header-title', 'تم قبول طلب الانضمام')
@section('header-subtitle', 'المرحلة 3 من 3 — تمت الموافقة على انضمامك رسمياً')

@section('status-type', 'success')
@section('status-bar', 'تم قبولك بنجاح — حسابك مفعّل الآن')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Opening Basmala --}}
@include('emails.partials.components.basmala')

{{-- Greeting --}}
<p class="greeting greeting--secondary" style="font-size:17px; font-weight:700; color:#0d1b2a; margin:0 0 16px; line-height:1.45; font-family:'Cairo', sans-serif;">{{ $applicant->user?->name ?? 'طالبنا الكريم' }}،</p>

{{-- Opening body --}}
<p class="body-text" style="font-size:14px; font-weight:400; color:#2d3748; line-height:1.85; margin:0 0 20px; font-family:'Cairo', sans-serif;">
    الحمد لله، تمت الموافقة على انضمامك إلى مؤسسة
    <strong>«{{ $applicant->school?->name ?? 'المؤسسة' }}»</strong>
    على منصة شفيع. نسعد بانضمامك ونسأل الله أن يُعينك ويُبارك في مسيرتك.
</p>

{{-- Enrollment details --}}
<div class="info-box" style="background-color:#f8f9fb; border:1px solid #e0e1dd; border-right:3px solid #1b263b; padding:18px 20px 16px; margin:0 0 20px;">
    <p class="info-box-title" style="font-size:10px; font-weight:700; color:#1b263b; margin:0 0 12px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">تفاصيل الانضمام</p>
    @include('emails.partials.components.data-table', [
        'rows' => [
            ['label' => 'الاسم',          'value' => $applicant->user?->name   ?? '—'],
            ['label' => 'المؤسسة',        'value' => $applicant->school?->name ?? '—'],
            ['label' => 'تاريخ القبول',   'value' => ($approvedAt ?? now())->format('Y/m/d — H:i')],
        ]
    ])
</div>

{{-- Onboarding steps --}}
<p class="section-heading" style="font-size:10px; font-weight:700; color:#007aaa; margin:28px 0 12px; padding-bottom:8px; padding-right:10px; border-bottom:1px solid #e0e1dd; border-right:3px solid #00a0da; letter-spacing:0.08em; text-transform:uppercase; font-family:'Cairo', sans-serif;">ابدأ رحلتك الآن:</p>
<table class="step-list" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%; border:1px solid #e0e1dd; background-color:#f8f9fb; border-right:3px solid #00a0da; margin:0 0 24px;">
    <tr><td class="step-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; border-bottom:1px solid #eaecef; font-family:'Cairo', sans-serif;"><span class="step-number" style="display:inline-block; min-width:24px; color:#00a0da; font-weight:700; margin-left:6px; font-size:12px;">1.</span> قم بتحميل تطبيق الطالب من المتجر</td></tr>
    <tr><td class="step-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; border-bottom:1px solid #eaecef; font-family:'Cairo', sans-serif;"><span class="step-number" style="display:inline-block; min-width:24px; color:#00a0da; font-weight:700; margin-left:6px; font-size:12px;">2.</span> سجّل الدخول باستخدام بريدك الإلكتروني وكلمة مرورك</td></tr>
    <tr><td class="step-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; border-bottom:1px solid #eaecef; font-family:'Cairo', sans-serif;"><span class="step-number" style="display:inline-block; min-width:24px; color:#00a0da; font-weight:700; margin-left:6px; font-size:12px;">3.</span> اطّلع على الحلقات المتاحة وانضم إلى المجموعة المناسبة لك</td></tr>
    <tr><td class="step-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; font-family:'Cairo', sans-serif;"><span class="step-number" style="display:inline-block; min-width:24px; color:#00a0da; font-weight:700; margin-left:6px; font-size:12px;">4.</span> تابع تقدمك يومياً وحافظ على استمراريتك</td></tr>
</table>

{{-- App store links (conditional on backend config) --}}
@if(config('app.ios_app_url') || config('app.android_app_url'))
<div style="text-align:center; margin:0 0 24px;">
    @if(config('app.ios_app_url'))
    @include('emails.partials.cta-button', ['url' => config('app.ios_app_url'), 'label' => 'تحميل من App Store', 'style' => 'ghost'])
    @endif
    @if(config('app.android_app_url'))
    @include('emails.partials.cta-button', ['url' => config('app.android_app_url'), 'label' => 'تحميل من Google Play', 'style' => 'ghost'])
    @endif
</div>
@endif

{{-- Primary action --}}
@php $appUrl = config('app.student_app_url', config('app.url')); @endphp
@include('emails.partials.cta-button', [
    'url'   => $appUrl,
    'label' => 'فتح تطبيق الطالب',
    'style' => 'primary',
])

{{-- Fallback URL --}}
<p class="fallback-url-hint" style="font-size:12px; color:#778da9; line-height:1.65; text-align:center; margin:-10px 0 8px; font-family:'Cairo', sans-serif;">أو انسخ الرابط أدناه في متصفحك:</p>
<p class="fallback-url" lang="en" xml:lang="en" style="font-family:Consolas,'Courier New',monospace; font-size:11px; color:#415a77; word-break:break-all; background-color:#f8f9fb; padding:10px 14px; border:1px solid #e0e1dd; text-align:left; margin:0 0 20px; direction:ltr; unicode-bidi:embed; display:block; line-height:1.7;">{{ $appUrl }}</p>

@include('emails.partials.components.divider')

{{-- Quranic verse --}}
@include('emails.partials.components.verse', ['text' => '﴿ وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ﴾'])

{{-- Closing --}}
<p class="closing-signature" style="margin:0; font-size:13px; color:#778da9; text-align:center; line-height:1.9; font-family:'Cairo', sans-serif;">
    نسأل الله أن يُيسر لك حفظ كتابه الكريم.<br>
    فريق منصة <strong style="color:#007aaa; font-weight:700;">شفيع</strong>
</p>

{{-- Reference number --}}
<p class="reference-line" style="font-size:11px; color:#778da9; text-align:center; margin:16px 0 0; letter-spacing:0.03em; font-family:'Cairo', sans-serif;">
    رقم المرجع: <span class="reference-code" style="font-family:Consolas,'Courier New',monospace; font-size:11px; color:#415a77; direction:ltr; unicode-bidi:embed;">STU-{{ str_pad($applicant->id, 6, '0', STR_PAD_LEFT) }}</span>
</p>

@endsection
