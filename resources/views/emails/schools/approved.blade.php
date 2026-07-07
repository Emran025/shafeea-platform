@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'مبروك! تم قبول ' . $school->name . ' في منصة شفيع')
@section('preheader', 'يسعدنا إبلاغكم بأن منصة شفيع قد وافقت رسمياً على انضمام مؤسستكم التعليمية.')

@section('header-badge', 'قرار القبول')
@section('header-title', 'تمت الموافقة على انضمامكم')
@section('header-subtitle', 'منصة شفيع لتعليم القرآن الكريم')

@section('status-type', 'success')
@section('status-bar', 'تم قبول المؤسسة بنجاح وتفعيل الحساب')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Opening Basmala --}}
@include('emails.partials.components.basmala')

{{-- Greeting --}}
<p class="greeting">السيد/ة {{ $school->admin?->user?->name ?? 'مسؤول المؤسسة' }}،</p>

{{-- Opening body --}}
<p class="body-text">
    يسعدنا إبلاغكم بأن منصة <strong>شفيع</strong> قد وافقت رسمياً على انضمام
    مؤسستكم التعليمية <strong>«{{ $school->name }}»</strong> إلى المنصة،
    وذلك بعد مراجعة وثائقكم والتحقق من استيفاء جميع شروط الانضمام.
</p>

{{-- Institution details --}}
<div class="info-box">
    <p class="info-box-title">تفاصيل المؤسسة</p>
    <table class="data-table" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td class="data-table__label">اسم المؤسسة</td>
            <td class="data-table__value">{{ $school->name }}</td>
        </tr>
        @if($school->country)
        <tr>
            <td class="data-table__label">البلد / المدينة</td>
            <td class="data-table__value">{{ $school->country }}{{ $school->city ? ' / ' . $school->city : '' }}</td>
        </tr>
        @endif
        <tr>
            <td class="data-table__label">تاريخ الانضمام</td>
            <td class="data-table__value">{{ now()->format('Y/m/d') }}</td>
        </tr>
    </table>
</div>

{{-- Available actions heading --}}
<p class="section-heading">يمكنكم الآن:</p>
<table class="action-list" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td class="action-item"><span class="action-marker">—</span> تسجيل دخول المعلمين وإدارة طلبات انضمامهم</td>
    </tr>
    <tr>
        <td class="action-item"><span class="action-marker">—</span> إنشاء الحلقات التعليمية وإضافة الطلاب</td>
    </tr>
    <tr>
        <td class="action-item"><span class="action-marker">—</span> متابعة تقدم الطلاب وإدارة جلسات الحفظ</td>
    </tr>
    <tr>
        <td class="action-item"><span class="action-marker">—</span> الوصول إلى لوحة التحكم الخاصة بمؤسستكم</td>
    </tr>
</table>

{{-- Primary action --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.url') . '/admin',
    'label' => 'الدخول إلى لوحة التحكم',
    'style' => 'primary',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature">
    نتطلع إلى شراكة علمية مثمرة مع مؤسستكم الكريمة.<br>
    فريق منصة <strong>شفيع</strong>
</p>

@endsection
