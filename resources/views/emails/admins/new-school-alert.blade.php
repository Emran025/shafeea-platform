@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'طلب انضمام مدرسة جديدة — ' . $school->name)
@section('preheader', 'وردنا طلب انضمام جديد من مؤسسة ' . $school->name . '. يتطلب مراجعتك وإصدار القرار.')

@section('header-badge', 'تنبيه إداري')
@section('header-title', 'طلب انضمام مؤسسة جديدة')
@section('header-subtitle', 'يتطلب مراجعتك وإصدار القرار المناسب')

@section('status-type', 'info')
@section('status-bar', 'طلب جديد في انتظار المراجعة')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Greeting — standardised across all admin alerts --}}
<p class="greeting" style="font-size:16px; font-weight:600; color:#0d1b2a; margin:0 0 8px; line-height:1.5; font-family:'Cairo', sans-serif;">تنبيه إداري،</p>

{{-- Opening context --}}
<p class="body-text" style="font-size:14px; font-weight:400; color:#2d3748; line-height:1.85; margin:0 0 20px; font-family:'Cairo', sans-serif;">
    تم استلام طلب انضمام جديد من مؤسسة تعليمية عبر منصة شفيع.
    يحتاج هذا الطلب إلى مراجعتك وإصدار القرار المناسب من خلال لوحة التحكم.
</p>

{{-- Application details --}}
<div class="info-box info-box--info" style="background-color:#f5fbff; border:1px solid #bde3f4; border-right:3px solid #00a0da; padding:18px 20px 16px; margin:0 0 20px;">
    <p class="info-box-title" style="font-size:10px; font-weight:700; color:#005f87; margin:0 0 12px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">تفاصيل الطلب</p>
    @include('emails.partials.components.data-table', [
        'rows' => array_filter([
            ['label' => 'اسم المؤسسة',     'value' => $school->name],
            ['label' => 'مسؤول الحساب',    'value' => $school->admin?->user?->name  ?? '—'],
            ['label' => 'البريد الإلكتروني','value' => $school->admin?->user?->email ?? '—', 'dir' => 'ltr'],
            $school->country ? ['label' => 'البلد / المدينة', 'value' => $school->country . ($school->city ? ' / ' . $school->city : '')] : null,
            $school->phone   ? ['label' => 'رقم الهاتف',      'value' => $school->phone]  : null,
            ['label' => 'تاريخ التقديم',   'value' => $school->created_at->format('Y/m/d H:i')],
        ])
    ])
</div>

{{-- Primary action --}}
@php $reviewUrl = config('app.admin_dashboard_url', config('app.url') . '/admin') . '/schools/' . $school->id; @endphp
@include('emails.partials.cta-button', [
    'url'   => $reviewUrl,
    'label' => 'مراجعة الطلب في لوحة التحكم',
    'style' => 'primary',
])

{{-- Fallback URL --}}
<p class="fallback-url-hint" style="font-size:12px; color:#778da9; line-height:1.65; text-align:center; margin:-10px 0 8px; font-family:'Cairo', sans-serif;">أو انسخ الرابط أدناه في متصفحك:</p>
<p class="fallback-url" lang="en" xml:lang="en" style="font-family:Consolas,'Courier New',monospace; font-size:11px; color:#415a77; word-break:break-all; background-color:#f8f9fb; padding:10px 14px; border:1px solid #e0e1dd; text-align:left; margin:0 0 20px; direction:ltr; unicode-bidi:embed; display:block; line-height:1.7;">{{ $reviewUrl }}</p>

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature" style="margin:0; font-size:13px; color:#778da9; text-align:center; line-height:1.9; font-family:'Cairo', sans-serif;">
    هذا التنبيه أُرسل تلقائياً عند تسجيل طلب انضمام مؤسسة جديدة.<br>
    منصة <strong style="color:#007aaa; font-weight:700;">شفيع</strong> — النظام الإداري
</p>

@endsection
