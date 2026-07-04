@extends('emails.layout.master')

@section('email-title', 'أهلاً بك في ' . $applicant->school->name . ' — تم قبول طلبك')
@section('preheader', 'تمت الموافقة على انضمامك كمعلم في ' . ($applicant->school->name ?? 'المؤسسة') . '. يمكنك الآن البدء.')

@section('header-badge', 'قبول المعلم')
@section('header-title', 'مرحباً بك في فريق التدريس')
@section('header-subtitle', 'تمت الموافقة على طلب انضمامك')

@section('status-type', 'success')
@section('status-bar', 'تم قبولك معلماً بنجاح')

@section('content')

    <p class="greeting">بسم الله الرحمن الرحيم</p>
    <p class="greeting">الأستاذ/ة {{ $applicant->user->name }}،</p>

    <p class="body-text">
        يسرنا أن نُبلغكم بأن طلب انضمامكم كمعلم في مؤسسة
        <strong>"{{ $applicant->school->name }}"</strong>
        عبر منصة شفيع قد تمت الموافقة عليه رسمياً.
        نتشرف بانضمامكم إلى فريق التدريس ونتطلع لمسيرة علمية مثمرة معكم.
    </p>

    {{-- Details Box --}}
    <div class="info-box">
        <p class="info-box-title">&#128203; تفاصيل الانضمام</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77; width:45%;">اسم المعلم</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $applicant->user->name }}</td>
            </tr>
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">المؤسسة</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $applicant->school->name }}</td>
            </tr>
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">البريد الإلكتروني</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $applicant->user->email }}</td>
            </tr>
            <tr>
                <td style="padding:9px 0; font-size:13px; font-weight:600; color:#415a77;">تاريخ القبول</td>
                <td style="padding:9px 0; font-size:13px; color:#0d1b2a; text-align:left;">{{ now()->format('Y/m/d') }}</td>
            </tr>
        </table>
    </div>

    {{-- Steps --}}
    <p style="font-size:15px; font-weight:700; color:#0d1b2a; margin:0 0 14px;">خطواتك القادمة:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#1b263b; margin-left:10px; font-weight:700;">1.</span>
                قم بتحميل تطبيق المعلم على هاتفك
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#1b263b; margin-left:10px; font-weight:700;">2.</span>
                سجّل الدخول باستخدام بريدك الإلكتروني وكلمة المرور التي أنشأتها
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#1b263b; margin-left:10px; font-weight:700;">3.</span>
                استعرض الحلقات المتاحة وابدأ رحلة التدريس
            </td>
        </tr>
    </table>

    {{-- Security Note --}}
    <div class="security-note">
        &#128274;&nbsp; <strong>بيانات الدخول الخاصة بك:</strong>
        البريد الإلكتروني: <strong>{{ $applicant->user->email }}</strong> — وكلمة المرور هي التي أنشأتها أثناء التسجيل.
        لا تشاركها مع أحد.
    </div>

    {{-- CTA --}}
    <div class="cta-wrapper">
        <a href="{{ config('app.teacher_app_url', config('app.url')) }}" class="cta-button">
            &#128241;&nbsp;&nbsp;فتح تطبيق المعلم
        </a>
    </div>

    <hr class="divider">

    <p class="body-text" style="margin:0; font-size:13px; color:#9ca3af; text-align:center;">
        جزاكم الله خيراً على جهدكم في نشر العلم.<br>
        فريق منصة <strong style="color:#415a77;">شفيع</strong>
    </p>

@endsection
