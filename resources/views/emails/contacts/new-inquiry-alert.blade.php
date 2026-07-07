@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'استفسار جديد — ' . $ticket->subject)
@section('preheader', 'وردنا استفسار جديد من ' . $ticket->name . '. يتطلب مراجعتك والرد عليه.')

@section('header-badge', 'تنبيه تواصل')
@section('header-title', 'استفسار جديد من زائر')
@section('header-subtitle', 'يتطلب مراجعتك والرد عليه')

@section('status-type', 'info')
@section('status-bar', 'رسالة جديدة في انتظار المراجعة')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Greeting --}}
<p class="greeting">تنبيه من النظام،</p>

{{-- Opening context --}}
<p class="body-text">
    وردنا استفسار جديد عبر صفحة التواصل في المنصة.
    يُرجى مراجعة التفاصيل أدناه والرد على صاحب الاستفسار من خلال لوحة التحكم.
</p>

{{-- Sender details --}}
<div class="info-box info-box--info">
    <p class="info-box-title">تفاصيل الاستفسار</p>
    <table class="data-table" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td class="data-table__label">الاسم</td>
            <td class="data-table__value">{{ $ticket->name }}</td>
        </tr>
        <tr>
            <td class="data-table__label">البريد الإلكتروني</td>
            <td class="data-table__value">{{ $ticket->email }}</td>
        </tr>
        @if($ticket->phone)
        <tr>
            <td class="data-table__label">رقم الهاتف</td>
            <td class="data-table__value">{{ $ticket->phone }}</td>
        </tr>
        @endif
        @if($ticket->organization)
        <tr>
            <td class="data-table__label">الجهة / المؤسسة</td>
            <td class="data-table__value">{{ $ticket->organization }}</td>
        </tr>
        @endif
        <tr>
            <td class="data-table__label">الموضوع</td>
            <td class="data-table__value">{{ $ticket->subject }}</td>
        </tr>
        <tr>
            <td class="data-table__label">تاريخ الإرسال</td>
            <td class="data-table__value">{{ $ticket->created_at->format('Y/m/d H:i') }}</td>
        </tr>
    </table>
</div>

{{-- Message body --}}
<div class="info-box info-box--message">
    <p class="info-box-title">نص الرسالة</p>
    <p class="info-box-body">{{ $ticket->body }}</p>
</div>

{{-- Primary action --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.url') . '/admin/inquiries',
    'label' => 'مراجعة الاستفسار في لوحة التحكم',
    'style' => 'primary',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature">
    هذا التنبيه أُرسل تلقائياً عند استلام استفسار جديد عبر صفحة التواصل.<br>
    منصة <strong>شفيع</strong> — النظام الإداري
</p>

@endsection
