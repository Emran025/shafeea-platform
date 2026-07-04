@extends('emails.layout.master')

@section('email-title', 'طلب انضمام مدرسة جديدة — ' . $school->name)
@section('preheader', 'وردنا طلب انضمام جديد من مؤسسة ' . $school->name . '. يتطلب مراجعتك وإصدار القرار.')

@section('header-badge', 'تنبيه إداري')
@section('header-title', 'طلب انضمام مؤسسة جديدة')
@section('header-subtitle', 'يتطلب مراجعتك وإصدار القرار')

@section('status-type', 'info')
@section('status-bar', 'طلب جديد في انتظار المراجعة')

@section('content')

    <p class="greeting">تنبيه من النظام،</p>

    <p class="body-text">
        تم استلام طلب انضمام جديد من مؤسسة تعليمية، ويحتاج هذا الطلب إلى
        مراجعتك وإصدار القرار المناسب من خلال لوحة التحكم.
    </p>

    {{-- School Details Box --}}
    <div class="info-box" style="border-right-color: #2196f3;">
        <p class="info-box-title" style="color:#0d47a1;">&#128203; تفاصيل الطلب</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77; width:40%;">اسم المؤسسة</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $school->name }}</td>
            </tr>
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">مسؤول الحساب</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $school->admin?->user?->name ?? '—' }}</td>
            </tr>
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">البريد الإلكتروني</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $school->admin?->user?->email ?? '—' }}</td>
            </tr>
            @if($school->country)
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">البلد / المدينة</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $school->country }}{{ $school->city ? ' / ' . $school->city : '' }}</td>
            </tr>
            @endif
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">رقم الهاتف</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $school->phone ?? '—' }}</td>
            </tr>
            <tr>
                <td style="padding:9px 0; font-size:13px; font-weight:600; color:#415a77;">تاريخ التقديم</td>
                <td style="padding:9px 0; font-size:13px; color:#0d1b2a; text-align:left;">{{ $school->created_at->format('Y/m/d H:i') }}</td>
            </tr>
        </table>
    </div>

    {{-- CTA --}}
    <div class="cta-wrapper">
        <a href="{{ config('app.url') . '/admin/schools/' . $school->id }}" class="cta-button">
            &#128274;&nbsp;&nbsp;مراجعة الطلب في لوحة التحكم
        </a>
    </div>

    <hr class="divider">

    <p class="body-text" style="margin:0; font-size:12px; color:#9ca3af; text-align:center; line-height:1.8;">
        هذا التنبيه أُرسل تلقائياً عند تسجيل طلب انضمام جديد.<br>
        منصة <strong style="color:#415a77;">شفيع</strong> — النظام الإداري
    </p>

@endsection
