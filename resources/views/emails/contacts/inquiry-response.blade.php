@extends('emails.layout.master')

@section('email-title', 'ردًّا على استفسارك — ' . $ticket->subject)
@section('preheader', 'تم الرد على استفسارك المُقدَّم إلى منصة شفيع. يُرجى الاطلاع على الرد.')

@section('header-badge', 'رد على استفسار')
@section('header-title', 'تم الرد على استفسارك')
@section('header-subtitle', 'منصة شفيع — قسم التواصل والدعم')

@section('status-type', 'success')
@section('status-bar', 'تمّت الإجابة على استفسارك')

@section('content')

    <p class="greeting">عزيزي {{ $ticket->name }}،</p>

    <p class="body-text">
        شكراً لتواصلك مع منصة شفيع. يسعدنا إبلاغك بأننا اطلعنا على استفسارك وقمنا بإعداد رد مناسب.
    </p>

    {{-- Original inquiry --}}
    <div class="info-box" style="border-right-color: #9e9e9e;">
        <p class="info-box-title" style="color:#424242;">&#128172; استفسارك الأصلي</p>
        <p style="font-size:13px; color:#555; font-style:italic; line-height:1.8; margin:0;">{{ $ticket->body }}</p>
    </div>

    {{-- Response --}}
    <div class="info-box" style="border-right-color: #4caf50; margin-top:16px;">
        <p class="info-box-title" style="color:#1b5e20;">&#9989; ردّنا على استفسارك</p>
        <p style="font-size:14px; color:#0d1b2a; line-height:1.9; margin:0;">{{ $responseMessage }}</p>
    </div>

    <p class="body-text" style="margin-top:20px;">
        إن كان لديك أي استفسار إضافي، لا تتردد في التواصل معنا مجدداً عبر صفحة التواصل في المنصة.
    </p>

    {{-- CTA --}}
    <div class="cta-wrapper">
        <a href="{{ config('app.url') . '/contact' }}" class="cta-button">
            &#9993;&nbsp;&nbsp;إرسال استفسار جديد
        </a>
    </div>

    <hr class="divider">

    <p class="body-text" style="margin:0; font-size:12px; color:#9ca3af; text-align:center; line-height:1.8;">
        هذه رسالة تلقائية رداً على استفسارك المُقدَّم في {{ $ticket->created_at->format('Y/m/d') }}.<br>
        منصة <strong style="color:#415a77;">شفيع</strong>
    </p>

@endsection
