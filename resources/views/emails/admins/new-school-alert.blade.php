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

{{-- Greeting --}}
<p class="greeting">تنبيه من النظام،</p>

{{-- Opening context --}}
<p class="body-text">
    تم استلام طلب انضمام جديد من مؤسسة تعليمية عبر منصة شفيع.
    يحتاج هذا الطلب إلى مراجعتك وإصدار القرار المناسب من خلال لوحة التحكم.
</p>

{{-- Application details --}}
<div class="info-box info-box--info">
    <p class="info-box-title">تفاصيل الطلب</p>
    <table class="data-table" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td class="data-table__label">اسم المؤسسة</td>
            <td class="data-table__value">{{ $school->name }}</td>
        </tr>
        <tr>
            <td class="data-table__label">مسؤول الحساب</td>
            <td class="data-table__value">{{ $school->admin?->user?->name ?? '—' }}</td>
        </tr>
        <tr>
            <td class="data-table__label">البريد الإلكتروني</td>
            <td class="data-table__value">{{ $school->admin?->user?->email ?? '—' }}</td>
        </tr>
        @if($school->country)
        <tr>
            <td class="data-table__label">البلد / المدينة</td>
            <td class="data-table__value">{{ $school->country }}{{ $school->city ? ' / ' . $school->city : '' }}</td>
        </tr>
        @endif
        <tr>
            <td class="data-table__label">رقم الهاتف</td>
            <td class="data-table__value">{{ $school->phone ?? '—' }}</td>
        </tr>
        <tr>
            <td class="data-table__label">تاريخ التقديم</td>
            <td class="data-table__value">{{ $school->created_at->format('Y/m/d H:i') }}</td>
        </tr>
    </table>
</div>

{{-- Primary action --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.url') . '/admin/schools/' . $school->id,
    'label' => 'مراجعة الطلب في لوحة التحكم',
    'style' => 'primary',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature">
    هذا التنبيه أُرسل تلقائياً عند تسجيل طلب انضمام مؤسسة جديدة.<br>
    منصة <strong>شفيع</strong> — النظام الإداري
</p>

@endsection
