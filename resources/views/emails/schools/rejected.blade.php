@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'بخصوص طلب انضمام ' . $school->name . ' إلى منصة شفيع')
@section('preheader', 'شكراً لتقديم طلب الانضمام. نود إبلاغكم بتحديث حول طلبكم.')

@section('header-badge', 'تحديث الطلب')
@section('header-title', 'تحديث حول طلب الانضمام')
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
<p class="greeting">السيد/ة {{ $school->admin?->user?->name ?? 'مسؤول المؤسسة' }}،</p>

{{-- Opening body --}}
<p class="body-text">
    شكراً لتقديم طلب انضمام مؤسستكم التعليمية <strong>«{{ $school->name }}»</strong>
    إلى منصة شفيع، وعلى ثقتكم الكريمة بنا.
</p>

<p class="body-text">
    بعد مراجعة الطلب والوثائق المقدمة بعناية، لم نتمكن في الوقت الحالي من
    إتمام عملية القبول. ندرك أن هذا قد لا يكون الخبر المتوقع، ونؤكد لكم أن
    هذا القرار لا يعكس تقييماً سلبياً لمؤسستكم أو كوادرها.
</p>

{{-- Rejection reason (conditional) --}}
@if(!empty($rejectionReason))
<div class="info-box info-box--notice">
    <p class="info-box-title">ملاحظة الفريق</p>
    <p class="info-box-body info-box-body--quote">«{{ $rejectionReason }}»</p>
</div>
@endif

{{-- Next steps --}}
<p class="section-heading">الخطوات التالية:</p>
<table class="action-list" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td class="action-item"><span class="action-marker">—</span> مراجعة المعلومات والوثائق التي تم تقديمها</td>
    </tr>
    <tr>
        <td class="action-item"><span class="action-marker">—</span> التواصل مع فريق الدعم لمعرفة المتطلبات الإضافية</td>
    </tr>
    <tr>
        <td class="action-item"><span class="action-marker">—</span> إعادة تقديم الطلب بعد استيفاء المتطلبات</td>
    </tr>
</table>

{{-- Secondary action --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.url') . '/contact',
    'label' => 'تواصل مع فريق الدعم',
    'style' => 'secondary',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature">
    نأمل أن تتمكنوا من استيفاء المتطلبات والعودة للتقديم مستقبلاً.<br>
    يشرفنا خدمتكم — فريق منصة <strong>شفيع</strong>
</p>

@endsection
