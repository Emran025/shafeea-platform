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
<p class="greeting" style="font-size:16px; font-weight:600; color:#0d1b2a; margin:0 0 8px; line-height:1.5; font-family:'Cairo', sans-serif;">تنبيه إداري،</p>

{{-- Opening context --}}
<p class="body-text" style="font-size:14px; font-weight:400; color:#2d3748; line-height:1.85; margin:0 0 20px; font-family:'Cairo', sans-serif;">
    وردنا استفسار جديد عبر صفحة التواصل في المنصة.
    يُرجى مراجعة التفاصيل أدناه والرد على صاحب الاستفسار من خلال لوحة التحكم.
</p>

{{-- Sender details --}}
<div class="info-box info-box--info" style="background-color:#f5fbff; border:1px solid #bde3f4; border-right:3px solid #00a0da; padding:18px 20px 16px; margin:0 0 14px;">
    <p class="info-box-title" style="font-size:10px; font-weight:700; color:#005f87; margin:0 0 12px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">تفاصيل الاستفسار</p>
    @include('emails.partials.components.data-table', [
        'rows' => array_filter([
            ['label' => 'الاسم',              'value' => $ticket->name],
            ['label' => 'البريد الإلكتروني',  'value' => $ticket->email, 'dir' => 'ltr'],
            !empty($ticket->phone)        ? ['label' => 'رقم الهاتف',      'value' => $ticket->phone, 'dir' => 'ltr']        : null,
            !empty($ticket->organization) ? ['label' => 'الجهة / المؤسسة', 'value' => $ticket->organization] : null,
            ['label' => 'الموضوع',            'value' => $ticket->subject],
            ['label' => 'تاريخ الإرسال',      'value' => $ticket->created_at->format('Y/m/d H:i')],
        ])
    ])
</div>

{{-- Message body --}}
<div class="info-box info-box--message" style="background-color:#f2fbf6; border:1px solid #8dd4ac; border-right:3px solid #1a8c5a; padding:18px 20px 16px; margin:0 0 20px;">
    <p class="info-box-title" style="font-size:10px; font-weight:700; color:#0a5c35; margin:0 0 12px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">نص الرسالة</p>
    <p class="info-box-body" style="font-size:14px; color:#2d3748; line-height:1.8; margin:0; font-family:'Cairo', sans-serif;">{{ $ticket->body }}</p>
</div>

{{-- Primary action --}}
@php $reviewUrl = config('app.admin_dashboard_url', config('app.url') . '/admin') . '/inquiries/' . $ticket->id; @endphp
@include('emails.partials.cta-button', [
    'url'   => $reviewUrl,
    'label' => 'مراجعة الاستفسار في لوحة التحكم',
    'style' => 'primary',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature" style="margin:0; font-size:13px; color:#778da9; text-align:center; line-height:1.9; font-family:'Cairo', sans-serif;">
    هذا التنبيه أُرسل تلقائياً عند استلام استفسار جديد عبر صفحة التواصل.<br>
    منصة <strong style="color:#007aaa; font-weight:700;">شفيع</strong> — النظام الإداري
</p>

{{-- Reference number --}}
<p class="reference-line" style="font-size:11px; color:#778da9; text-align:center; margin:16px 0 0; letter-spacing:0.03em; font-family:'Cairo', sans-serif;">
    رقم التذكرة: <span class="reference-code" style="font-family:Consolas,'Courier New',monospace; font-size:11px; color:#415a77; direction:ltr; unicode-bidi:embed;">TKT-{{ str_pad($ticket->id, 5, '0', STR_PAD_LEFT) }}</span>
</p>

@endsection
