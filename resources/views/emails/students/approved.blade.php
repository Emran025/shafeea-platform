@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'مرحباً ' . $applicant->user->name . ' — تم قبولك في ' . ($applicant->school->name ?? 'المؤسسة'))
@section('preheader', 'الحمد لله! تمت الموافقة على انضمامك وأصبح بإمكانك البدء في رحلة حفظ القرآن الكريم.')

@section('header-badge', 'قبول الطالب')
@section('header-title', 'تم قبول طلب الانضمام')
@section('header-subtitle', 'تمت الموافقة على انضمامك رسمياً')

@section('status-type', 'success')
@section('status-bar', 'تم قبولك بنجاح — حسابك مفعّل الآن')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Opening Basmala --}}
@include('emails.partials.components.basmala')

{{-- Greeting --}}
<p class="greeting greeting--secondary">{{ $applicant->user->name }}،</p>

{{-- Opening body --}}
<p class="body-text">
    الحمد لله، تمت الموافقة على انضمامك إلى مؤسسة
    <strong>«{{ $applicant->school->name }}»</strong>
    على منصة شفيع. نسعد بانضمامك ونسأل الله أن يُعينك ويُبارك في مسيرتك.
</p>

{{-- Enrollment details --}}
<div class="info-box">
    <p class="info-box-title">تفاصيل الانضمام</p>
    <table class="data-table" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td class="data-table__label">الاسم</td>
            <td class="data-table__value">{{ $applicant->user->name }}</td>
        </tr>
        <tr>
            <td class="data-table__label">المؤسسة</td>
            <td class="data-table__value">{{ $applicant->school->name }}</td>
        </tr>
        <tr>
            <td class="data-table__label">تاريخ القبول</td>
            <td class="data-table__value">{{ now()->format('Y/m/d') }}</td>
        </tr>
    </table>
</div>

{{-- Onboarding steps --}}
<p class="section-heading">ابدأ رحلتك الآن:</p>
<table class="step-list" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td class="step-item"><span class="step-number">1.</span> قم بتحميل تطبيق الطالب من المتجر</td>
    </tr>
    <tr>
        <td class="step-item"><span class="step-number">2.</span> سجّل الدخول باستخدام بريدك الإلكتروني وكلمة مرورك</td>
    </tr>
    <tr>
        <td class="step-item"><span class="step-number">3.</span> اطّلع على الحلقات المتاحة وانضم إلى المجموعة المناسبة لك</td>
    </tr>
    <tr>
        <td class="step-item"><span class="step-number">4.</span> تابع تقدمك يومياً وحافظ على استمراريتك</td>
    </tr>
</table>

{{-- Primary action --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.student_app_url', config('app.url')),
    'label' => 'فتح تطبيق الطالب',
    'style' => 'primary',
])

@include('emails.partials.components.divider')

{{-- Quranic verse --}}
@include('emails.partials.components.verse', ['text' => '﴿ وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ﴾'])

{{-- Closing --}}
<p class="closing-signature">
    نسأل الله أن يُيسر لك حفظ كتابه الكريم.<br>
    فريق منصة <strong>شفيع</strong>
</p>

@endsection
