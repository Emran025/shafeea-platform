@extends('emails.layout.master')

@section('email-title', 'مبروك! تم قبول ' . $school->name . ' في منصة شفيع')
@section('preheader', 'يسعدنا إبلاغكم بأن منصة شفيع قد وافقت رسمياً على انضمام مؤسستكم التعليمية.')

@section('header-badge', 'قرار القبول')
@section('header-title', 'تمت الموافقة على انضمامكم')
@section('header-subtitle', 'منصة شفيع لتعليم القرآن الكريم')

@section('status-type', 'success')
@section('status-bar', 'تم قبول المؤسسة بنجاح وتفعيل الحساب')

@section('content')

    {{-- Greeting --}}
    <p class="greeting">بسم الله الرحمن الرحيم</p>
    <p class="greeting">السيد/ة {{ $school->admin?->user?->name ?? 'مسؤول المؤسسة' }}،</p>

    <p class="body-text">
        يسعدنا إبلاغكم بأن منصة <strong>شفيع</strong> قد وافقت رسمياً على انضمام مؤسستكم التعليمية
        <strong>"{{ $school->name }}"</strong> إلى المنصة، وذلك بعد مراجعة وثائقكم والتحقق من
        استيفاء جميع شروط الانضمام.
    </p>

    {{-- School Info Box --}}
    <div class="info-box">
        <p class="info-box-title">&#128203; تفاصيل المؤسسة</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77; width:45%;">اسم المؤسسة</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $school->name }}</td>
            </tr>
            @if($school->country)
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">البلد / المدينة</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $school->country }}{{ $school->city ? ' / ' . $school->city : '' }}</td>
            </tr>
            @endif
            <tr>
                <td style="padding:9px 0; font-size:13px; font-weight:600; color:#415a77;">تاريخ الانضمام</td>
                <td style="padding:9px 0; font-size:13px; color:#0d1b2a; text-align:left;">{{ now()->format('Y/m/d') }}</td>
            </tr>
        </table>
    </div>

    {{-- What's next --}}
    <p style="font-size:15px; font-weight:700; color:#0d1b2a; margin:0 0 14px;">يمكنكم الآن:</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#1b263b; margin-left:10px; font-size:16px;">&#10003;</span>
                تسجيل دخول المعلمين وإدارة طلبات انضمامهم
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#1b263b; margin-left:10px; font-size:16px;">&#10003;</span>
                إنشاء الحلقات التعليمية وإضافة الطلاب
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#1b263b; margin-left:10px; font-size:16px;">&#10003;</span>
                متابعة تقدم الطلاب وإدارة جلسات الحفظ
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#1b263b; margin-left:10px; font-size:16px;">&#10003;</span>
                الوصول إلى لوحة التحكم الخاصة بمؤسستكم
            </td>
        </tr>
    </table>

    {{-- CTA --}}
    <div class="cta-wrapper">
        <a href="{{ config('app.url') . '/admin' }}" class="cta-button">
            &#128274;&nbsp;&nbsp;الدخول إلى لوحة التحكم
        </a>
    </div>

    <hr class="divider">

    <p class="body-text" style="margin:0; font-size:14px; color:#778da9; text-align:center;">
        نتطلع إلى شراكة علمية مثمرة مع مؤسستكم الكريمة.<br>
        فريق منصة <strong>شفيع</strong>
    </p>

@endsection
