@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'تحديث بخصوص طلب الانضمام في ' . ($applicant->school->name ?? 'المؤسسة'))
@section('preheader', 'لديك تحديث بخصوص طلب الانضمام في ' . ($applicant->school->name ?? 'المؤسسة') . '.')

@section('header-badge', 'تحديث الطلب')
@section('header-title', 'تحديث حول طلبك')
@section('header-subtitle', 'منصة شفيع لتعليم القرآن الكريم')

@section('status-type', 'warning')
@section('status-bar', 'يتطلب الطلب مراجعة إضافية')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Opening Basmala --}}
@include('emails.partials.components.basmala')

{{-- Greeting --}}
<p class="greeting">{{ $applicant->user->name }}،</p>

{{-- Opening body --}}
<p class="body-text">
    شكراً لتسجيلك في منصة شفيع واهتمامك بالانضمام إلى
    <strong>«{{ $applicant->school->name }}»</strong>.
    نُقدّر ثقتك بنا ونعتز بكل خطوة تخطوها نحو حفظ القرآن الكريم.
</p>

<p class="body-text">
    بعد مراجعة طلبك بعناية، لم يتسنَّ لنا في المرحلة الحالية استكمال قبولك.
    نؤكد لك أن ذلك لا يعني رفضاً نهائياً، وأن بإمكانك دائماً التواصل معنا
    أو إعادة التقديم في وقت لاحق.
</p>

{{-- Rejection reason (conditional) --}}
@if(!empty($rejectionReason))
<div class="info-box info-box--notice">
    <p class="info-box-title">ملاحظة المؤسسة</p>
    <p class="info-box-body info-box-body--quote">«{{ $rejectionReason }}»</p>
</div>
@endif

{{-- Options available --}}
<p class="section-heading">يمكنك:</p>
<table class="action-list" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td class="action-item"><span class="action-marker">—</span> التواصل مع المؤسسة مباشرة للاستفسار</td>
    </tr>
    <tr>
        <td class="action-item"><span class="action-marker">—</span> تحديث بياناتك وإعادة التقديم لاحقاً</td>
    </tr>
</table>

{{-- Action --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.url') . '/contact',
    'label' => 'تواصل مع فريق الدعم',
    'style' => 'ghost',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature">
    لا تيأس، فكل خطوة في طريق العلم مباركة.<br>
    فريق منصة <strong>شفيع</strong>
</p>

@endsection
