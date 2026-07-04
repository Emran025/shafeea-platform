@extends('emails.layout.master')

@section('email-title', 'طلب انضمام طالب جديد — ' . $applicant->user->name)
@section('preheader', 'وردنا طلب انضمام طالب جديد: ' . $applicant->user->name . '. يتطلب مراجعتك.')

@section('header-badge', 'تنبيه مؤسسة')
@section('header-title', 'طلب انضمام طالب جديد 🎓')
@section('header-subtitle', 'يتطلب مراجعتك وإصدار القرار')

@section('status-type', 'info')
@section('status-bar', 'طلب جديد في انتظار المراجعة')

@section('content')

    <p class="greeting">تنبيه إداري،</p>

    <p class="body-text">
        وردنا طلب انضمام من طالب جديد يرغب في الانضمام إلى مؤسستكم عبر منصة شفيع.
        يُرجى مراجعة الطلب واتخاذ القرار المناسب.
    </p>

    {{-- Student Details Box --}}
    <div class="info-box" style="border-right-color: #2196f3;">
        <p class="info-box-title" style="color:#0d47a1;">&#128203; بيانات الطالب</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77; width:40%;">الاسم</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $applicant->user->name }}</td>
            </tr>
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">البريد الإلكتروني</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $applicant->user->email }}</td>
            </tr>
            @if($applicant->user->gender)
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">الجنس</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $applicant->user->gender === 'male' ? 'ذكر' : 'أنثى' }}</td>
            </tr>
            @endif
            @if($applicant->memorization_level)
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">مستوى الحفظ</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $applicant->memorization_level }}</td>
            </tr>
            @endif
            @if($applicant->school)
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">المؤسسة المُتقدَّم إليها</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $applicant->school->name }}</td>
            </tr>
            @endif
            <tr>
                <td style="padding:9px 0; font-size:13px; font-weight:600; color:#415a77;">تاريخ التقديم</td>
                <td style="padding:9px 0; font-size:13px; color:#0d1b2a; text-align:left;">{{ optional($applicant->submitted_at)->format('Y/m/d H:i') ?? $applicant->created_at->format('Y/m/d H:i') }}</td>
            </tr>
        </table>
    </div>

    <div class="cta-wrapper">
        <a href="{{ config('app.url') . '/admin/applicants/' . $applicant->id }}" class="cta-button">
            &#128274;&nbsp;&nbsp;مراجعة الطلب الآن
        </a>
    </div>

    <hr class="divider">

    <p class="body-text" style="margin:0; font-size:12px; color:#9ca3af; text-align:center;">
        هذا التنبيه أُرسل تلقائياً عند تقديم طلب انضمام طالب جديد.<br>
        منصة <strong style="color:#415a77;">شفيع</strong>
    </p>

@endsection
