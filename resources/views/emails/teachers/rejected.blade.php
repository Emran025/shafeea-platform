@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'تحديث بخصوص طلبك في ' . ($applicant->school->name ?? 'المؤسسة'))
@section('preheader', 'تحديث حول طلب انضمامك في ' . ($applicant->school->name ?? 'المؤسسة') . ' عبر منصة شفيع.')

@section('header-badge', 'تحديث الطلب')
@section('header-title', 'تحديث حول طلب انضمامك')
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
<p class="greeting">الأستاذ/ة {{ $applicant->user->name }}،</p>

{{-- Opening body --}}
<p class="body-text">
    شكراً لاهتمامك بالانضمام إلى <strong>«{{ $applicant->school->name }}»</strong>
    كمعلم عبر منصة شفيع. نقدّر وقتك والجهد الذي بذلته في إعداد طلبك.
</p>

<p class="body-text">
    بعد مراجعة الطلب بعناية، لم نتمكن في المرحلة الحالية من استكمال
    قبولك في هذه المؤسسة. نؤكد لك أن هذا لا يمنعك من التقدم لمؤسسات
    أخرى على المنصة.
</p>

{{-- Rejection reason (conditional) --}}
@if(!empty($rejectionReason))
<div class="info-box info-box--notice">
    <p class="info-box-title">ملاحظة المؤسسة</p>
    <p class="info-box-body info-box-body--quote">«{{ $rejectionReason }}»</p>
</div>
@endif

{{-- Options available --}}
<p class="section-heading">ماذا يمكنك فعله الآن؟</p>
<table class="action-list" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td class="action-item"><span class="action-marker">—</span> استعراض المؤسسات الأخرى المتاحة على المنصة</td>
    </tr>
    <tr>
        <td class="action-item"><span class="action-marker">—</span> مراجعة بياناتك وتحديث مؤهلاتك قبل التقديم مجدداً</td>
    </tr>
    <tr>
        <td class="action-item"><span class="action-marker">—</span> التواصل مع فريق الدعم إن احتجت مساعدة</td>
    </tr>
</table>

{{-- Secondary action --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.url'),
    'label' => 'استعراض المؤسسات المتاحة',
    'style' => 'secondary',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature">
    نتمنى لك التوفيق في مسيرتك التعليمية.<br>
    فريق منصة <strong>شفيع</strong>
</p>

@endsection
