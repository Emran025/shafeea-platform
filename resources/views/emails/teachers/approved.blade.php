@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'أهلاً بك في ' . $applicant->school->name . ' — تم قبول طلبك')
@section('preheader', 'تمت الموافقة على انضمامك كمعلم في ' . ($applicant->school->name ?? 'المؤسسة') . '. يمكنك الآن البدء.')

@section('header-badge', 'قبول المعلم')
@section('header-title', 'مرحباً بك في فريق التدريس')
@section('header-subtitle', 'تمت الموافقة على طلب انضمامك')

@section('status-type', 'success')
@section('status-bar', 'تم قبولك معلماً بنجاح')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Opening Basmala --}}
@include('emails.partials.components.basmala')

{{-- Greeting --}}
<p class="greeting">الأستاذ/ة {{ $applicant->user->name }}،</p>

{{-- Opening body --}}
<p class="body-text">
    يسرنا أن نُبلغكم بأن طلب انضمامكم كمعلم في مؤسسة
    <strong>«{{ $applicant->school->name }}»</strong>
    عبر منصة شفيع قد تمت الموافقة عليه رسمياً.
    نتشرف بانضمامكم إلى فريق التدريس ونتطلع لمسيرة علمية مثمرة معكم.
</p>

{{-- Enrollment details --}}
<div class="info-box">
    <p class="info-box-title">تفاصيل الانضمام</p>
    <table class="data-table" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td class="data-table__label">اسم المعلم</td>
            <td class="data-table__value">{{ $applicant->user->name }}</td>
        </tr>
        <tr>
            <td class="data-table__label">المؤسسة</td>
            <td class="data-table__value">{{ $applicant->school->name }}</td>
        </tr>
        <tr>
            <td class="data-table__label">البريد الإلكتروني</td>
            <td class="data-table__value">{{ $applicant->user->email }}</td>
        </tr>
        <tr>
            <td class="data-table__label">تاريخ القبول</td>
            <td class="data-table__value">{{ now()->format('Y/m/d') }}</td>
        </tr>
    </table>
</div>

{{-- Onboarding steps --}}
<p class="section-heading">خطواتك القادمة:</p>
<table class="step-list" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td class="step-item"><span class="step-number">1.</span> قم بتحميل تطبيق المعلم على هاتفك</td>
    </tr>
    <tr>
        <td class="step-item"><span class="step-number">2.</span> سجّل الدخول باستخدام بريدك الإلكتروني وكلمة المرور التي أنشأتها</td>
    </tr>
    <tr>
        <td class="step-item"><span class="step-number">3.</span> استعرض الحلقات المتاحة وابدأ رحلة التدريس</td>
    </tr>
</table>

{{-- Credentials notice --}}
<div class="security-note">
    <strong>بيانات الدخول الخاصة بك:</strong>
    البريد الإلكتروني: <strong>{{ $applicant->user->email }}</strong> —
    وكلمة المرور هي التي أنشأتها أثناء التسجيل. لا تشاركها مع أحد.
</div>

{{-- Primary action --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.teacher_app_url', config('app.url')),
    'label' => 'فتح تطبيق المعلم',
    'style' => 'primary',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature">
    جزاكم الله خيراً على جهدكم في نشر العلم.<br>
    فريق منصة <strong>شفيع</strong>
</p>

@endsection
