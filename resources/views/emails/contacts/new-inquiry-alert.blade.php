@extends('emails.layout.master')

@section('email-title', 'استفسار جديد — ' . $ticket->subject)
@section('preheader', 'وردنا استفسار جديد من ' . $ticket->name . '. يتطلب مراجعتك والرد عليه.')

@section('header-badge', 'تنبيه تواصل')
@section('header-title', 'استفسار جديد من زائر')
@section('header-subtitle', 'يتطلب مراجعتك والرد عليه')

@section('status-type', 'info')
@section('status-bar', 'رسالة جديدة في انتظار المراجعة')

@section('content')

    <p class="greeting">تنبيه من النظام،</p>

    <p class="body-text">
        وردنا استفسار جديد عبر صفحة التواصل في المنصة.
        يُرجى مراجعة التفاصيل أدناه والرد على صاحب الاستفسار من خلال لوحة التحكم.
    </p>

    {{-- Ticket Details Box --}}
    <div class="info-box" style="border-right-color: #2196f3;">
        <p class="info-box-title" style="color:#0d47a1;">&#128203; تفاصيل الاستفسار</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77; width:40%;">الاسم</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $ticket->name }}</td>
            </tr>
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">البريد الإلكتروني</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $ticket->email }}</td>
            </tr>
            @if($ticket->phone)
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">رقم الهاتف</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $ticket->phone }}</td>
            </tr>
            @endif
            @if($ticket->organization)
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">الجهة / المؤسسة</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $ticket->organization }}</td>
            </tr>
            @endif
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">الموضوع</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $ticket->subject }}</td>
            </tr>
            <tr>
                <td style="padding:9px 0; font-size:13px; font-weight:600; color:#415a77;">تاريخ الإرسال</td>
                <td style="padding:9px 0; font-size:13px; color:#0d1b2a; text-align:left;">{{ $ticket->created_at->format('Y/m/d H:i') }}</td>
            </tr>
        </table>
    </div>

    {{-- Message Body --}}
    <div class="info-box" style="border-right-color: #4caf50; margin-top:16px;">
        <p class="info-box-title" style="color:#1b5e20;">&#128221; نص الرسالة</p>
        <p style="font-size:13px; color:#0d1b2a; line-height:1.8; margin:0;">{{ $ticket->body }}</p>
    </div>

    {{-- CTA --}}
    <div class="cta-wrapper">
        <a href="{{ config('app.url') . '/admin/inquiries' }}" class="cta-button">
            &#128274;&nbsp;&nbsp;مراجعة الاستفسار في لوحة التحكم
        </a>
    </div>

    <hr class="divider">

    <p class="body-text" style="margin:0; font-size:12px; color:#9ca3af; text-align:center; line-height:1.8;">
        هذا التنبيه أُرسل تلقائياً عند استلام استفسار جديد عبر صفحة التواصل.<br>
        منصة <strong style="color:#415a77;">شفيع</strong> — النظام الإداري
    </p>

@endsection
