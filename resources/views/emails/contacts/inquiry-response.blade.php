@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'ردًّا على استفسارك — ' . $ticket->subject)
@section('preheader', 'تم الرد على استفسارك المُقدَّم إلى منصة شفيع. يُرجى الاطلاع على الرد.')

@section('header-badge', 'رد على استفسار')
@section('header-title', 'تم الرد على استفسارك')
@section('header-subtitle', 'منصة شفيع — قسم التواصل والدعم')

@section('status-type', 'success')
@section('status-bar', 'تمّت الإجابة على استفسارك')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Greeting --}}
<p class="greeting">عزيزي {{ $ticket->name }}،</p>

{{-- Opening body --}}
<p class="body-text">
    شكراً لتواصلك مع منصة شفيع. يسعدنا إبلاغك بأننا اطلعنا على استفسارك
    وقمنا بإعداد رد مناسب لك.
</p>

{{-- Original inquiry (muted display) --}}
<div class="info-box info-box--muted">
    <p class="info-box-title">استفسارك الأصلي</p>
    <p class="info-box-body info-box-body--quote">{{ $ticket->body }}</p>
</div>

{{-- Response (highlighted display) --}}
<div class="info-box info-box--message">
    <p class="info-box-title">ردّنا على استفسارك</p>
    <p class="info-box-body">{{ $responseMessage }}</p>
</div>

{{-- Follow-up invitation --}}
<p class="body-text">
    إن كان لديك أي استفسار إضافي، لا تتردد في التواصل معنا مجدداً
    عبر صفحة التواصل في المنصة.
</p>

{{-- Action --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.url') . '/contact',
    'label' => 'إرسال استفسار جديد',
    'style' => 'primary',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature">
    هذه رسالة تلقائية رداً على استفسارك المُقدَّم في {{ $ticket->created_at->format('Y/m/d') }}.<br>
    منصة <strong>شفيع</strong>
</p>

@endsection
