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

{{-- Greeting — gender-neutral Arabic opener --}}
<p class="greeting" style="font-size:16px; font-weight:600; color:#0d1b2a; margin:0 0 8px; line-height:1.5; font-family:'Cairo', sans-serif;">تحية طيبة، {{ $ticket->name }}،</p>

{{-- Opening body --}}
<p class="body-text" style="font-size:14px; font-weight:400; color:#2d3748; line-height:1.85; margin:0 0 20px; font-family:'Cairo', sans-serif;">
    شكراً لتواصلك مع منصة شفيع. يسعدنا إبلاغك بأننا اطلعنا على استفسارك
    وقمنا بإعداد رد مناسب لك.
</p>

{{-- Original inquiry subject + body --}}
<div class="info-box info-box--muted" style="background-color:#f8f9fb; border:1px solid #e0e1dd; border-right:3px solid #778da9; padding:18px 20px 16px; margin:0 0 14px;">
    <p class="info-box-title" style="font-size:10px; font-weight:700; color:#415a77; margin:0 0 12px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">{{ $ticket->subject }}</p>
    <p class="info-box-body info-box-body--quote" style="font-size:14px; color:#415a77; line-height:1.8; margin:0; font-style:italic; border-right:2px solid #c0ccd8; padding-right:12px; font-family:'Cairo', sans-serif;">{{ $ticket->body }}</p>
</div>

{{-- Response --}}
<div class="info-box info-box--message" style="background-color:#f2fbf6; border:1px solid #8dd4ac; border-right:3px solid #1a8c5a; padding:18px 20px 16px; margin:0 0 20px;">
    <p class="info-box-title" style="font-size:10px; font-weight:700; color:#0a5c35; margin:0 0 12px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">ردّنا على استفسارك</p>
    <p class="info-box-body" style="font-size:14px; color:#2d3748; line-height:1.8; margin:0; font-family:'Cairo', sans-serif;">{{ $responseMessage }}</p>
</div>

{{-- Follow-up invitation --}}
<p class="body-text" style="font-size:14px; font-weight:400; color:#2d3748; line-height:1.85; margin:0 0 20px; font-family:'Cairo', sans-serif;">
    إن كان لديك أي استفسار إضافي حول هذه المسألة، لا تتردد في التواصل معنا مجدداً.
</p>

{{-- CTA: visit platform, not "send new inquiry" --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.url'),
    'label' => 'زيارة منصة شفيع',
    'style' => 'primary',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature" style="margin:0; font-size:13px; color:#778da9; text-align:center; line-height:1.9; font-family:'Cairo', sans-serif;">
    هذه رسالة تلقائية رداً على استفسارك المُقدَّم في {{ $ticket->created_at->format('Y/m/d') }}.<br>
    منصة <strong style="color:#007aaa; font-weight:700;">شفيع</strong>
</p>

{{-- Reference number --}}
<p class="reference-line" style="font-size:11px; color:#778da9; text-align:center; margin:16px 0 0; letter-spacing:0.03em; font-family:'Cairo', sans-serif;">
    رقم التذكرة: <span class="reference-code" style="font-family:Consolas,'Courier New',monospace; font-size:11px; color:#415a77; direction:ltr; unicode-bidi:embed;">TKT-{{ str_pad($ticket->id, 5, '0', STR_PAD_LEFT) }}</span>
</p>

@endsection
