@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'بخصوص طلب انضمام ' . $school->name . ' إلى منصة شفيع')
@section('preheader', 'يمكنكم مراجعة الملاحظات والتواصل مع فريق الدعم لمعرفة المتطلبات الإضافية.')

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
<p class="greeting" style="font-size:16px; font-weight:600; color:#0d1b2a; margin:0 0 8px; line-height:1.5; font-family:'Cairo', sans-serif;">السيد/ة {{ $school->admin?->user?->name ?? 'مسؤول المؤسسة' }}،</p>

{{-- Opening body — inverted pyramid: decision first, then softening --}}
<p class="body-text" style="font-size:14px; font-weight:400; color:#2d3748; line-height:1.85; margin:0 0 20px; font-family:'Cairo', sans-serif;">
    شكراً لتقديم طلب انضمام مؤسستكم التعليمية <strong>«{{ $school->name }}»</strong>.
    بعد مراجعة الطلب والوثائق المقدمة بعناية، لم نتمكن في الوقت الحالي من
    إتمام عملية القبول. هذا القرار لا يعكس تقييماً سلبياً لمؤسستكم، ويمكنكم
    إعادة التقديم بعد استيفاء المتطلبات.
</p>

{{-- Rejection reason (conditional) --}}
@if(!empty($rejectionReason))
<div class="info-box info-box--notice" style="background-color:#fef8ee; border:1px solid #f0d08a; border-right:3px solid #d4880a; padding:18px 20px 16px; margin:0 0 20px;">
    <p class="info-box-title" style="font-size:10px; font-weight:700; color:#7a4d0a; margin:0 0 12px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">ملاحظة الفريق</p>
    <p class="info-box-body info-box-body--quote" style="font-size:14px; color:#415a77; line-height:1.8; margin:0; font-style:italic; border-right:2px solid #c0ccd8; padding-right:12px; font-family:'Cairo', sans-serif;">«{{ $rejectionReason }}»</p>
</div>
@endif

{{-- Next steps --}}
<p class="section-heading" style="font-size:10px; font-weight:700; color:#007aaa; margin:28px 0 12px; padding-bottom:8px; padding-right:10px; border-bottom:1px solid #e0e1dd; border-right:3px solid #00a0da; letter-spacing:0.08em; text-transform:uppercase; font-family:'Cairo', sans-serif;">الخطوات التالية:</p>
<table class="action-list" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%; border:1px solid #e0e1dd; background-color:#f8f9fb; border-right:3px solid #00a0da; margin:0 0 24px;">
    <tr><td class="action-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; border-bottom:1px solid #eaecef; font-family:'Cairo', sans-serif;"><span class="action-marker" style="display:inline-block; min-width:12px; color:#007aaa; font-weight:600; margin-left:6px;">—</span> مراجعة المعلومات والوثائق التي تم تقديمها</td></tr>
    <tr><td class="action-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; border-bottom:1px solid #eaecef; font-family:'Cairo', sans-serif;"><span class="action-marker" style="display:inline-block; min-width:12px; color:#007aaa; font-weight:600; margin-left:6px;">—</span> التواصل مع فريق الدعم لمعرفة المتطلبات الإضافية</td></tr>
    <tr><td class="action-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; font-family:'Cairo', sans-serif;"><span class="action-marker" style="display:inline-block; min-width:12px; color:#007aaa; font-weight:600; margin-left:6px;">—</span> إعادة تقديم الطلب بعد استيفاء المتطلبات</td></tr>
</table>

{{-- Secondary action — standard style for support contact --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.url') . '/contact',
    'label' => 'تواصل مع فريق الدعم',
    'style' => 'secondary',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature" style="margin:0; font-size:13px; color:#778da9; text-align:center; line-height:1.9; font-family:'Cairo', sans-serif;">
    نأمل أن تتمكنوا من استيفاء المتطلبات والعودة للتقديم مستقبلاً.<br>
    يشرفنا خدمتكم — فريق منصة <strong style="color:#007aaa; font-weight:700;">شفيع</strong>
</p>

{{-- Reference number --}}
<p class="reference-line" style="font-size:11px; color:#778da9; text-align:center; margin:16px 0 0; letter-spacing:0.03em; font-family:'Cairo', sans-serif;">
    رقم المرجع: <span class="reference-code" style="font-family:Consolas,'Courier New',monospace; font-size:11px; color:#415a77; direction:ltr; unicode-bidi:embed;">SCH-{{ str_pad($school->id, 6, '0', STR_PAD_LEFT) }}</span>
</p>

@endsection
