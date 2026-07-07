@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'مبروك! تم قبول ' . $school->name . ' في منصة شفيع')
@section('preheader', 'يمكنكم الآن الدخول إلى لوحة التحكم، تسجيل المعلمين، وإنشاء الحلقات التعليمية.')

@section('header-badge', 'قرار القبول')
@section('header-title', 'تمت الموافقة على انضمامكم')
@section('header-subtitle', 'المرحلة الأخيرة — حسابكم مفعّل ولوحة التحكم جاهزة')

@section('status-type', 'success')
@section('status-bar', 'تم قبول المؤسسة بنجاح وتفعيل الحساب')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Opening Basmala --}}
@include('emails.partials.components.basmala')

{{-- Greeting --}}
<p class="greeting" style="font-size:16px; font-weight:600; color:#0d1b2a; margin:0 0 8px; line-height:1.5; font-family:'Cairo', sans-serif;">السيد/ة {{ $school->admin?->user?->name ?? 'مسؤول المؤسسة' }}،</p>

{{-- Opening body --}}
<p class="body-text" style="font-size:14px; font-weight:400; color:#2d3748; line-height:1.85; margin:0 0 20px; font-family:'Cairo', sans-serif;">
    يسعدنا إبلاغكم بأن منصة <strong>شفيع</strong> قد وافقت رسمياً على انضمام
    مؤسستكم التعليمية <strong>«{{ $school->name }}»</strong> إلى المنصة،
    وذلك بعد مراجعة وثائقكم والتحقق من استيفاء جميع شروط الانضمام.
</p>

{{-- Institution details — using reusable data-table component --}}
<div class="info-box" style="background-color:#f8f9fb; border:1px solid #e0e1dd; border-right:3px solid #1b263b; padding:18px 20px 16px; margin:0 0 20px;">
    <p class="info-box-title" style="font-size:10px; font-weight:700; color:#1b263b; margin:0 0 12px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">تفاصيل المؤسسة</p>
    @include('emails.partials.components.data-table', [
        'rows' => array_filter([
            ['label' => 'اسم المؤسسة',          'value' => $school->name],
            ['label' => 'مسؤول الحساب',          'value' => $school->admin?->user?->name ?? '—'],
            ['label' => 'البريد الإلكتروني',      'value' => $school->admin?->user?->email ?? '—', 'dir' => 'ltr'],
            $school->country ? ['label' => 'البلد / المدينة', 'value' => $school->country . ($school->city ? ' / ' . $school->city : '')] : null,
            ['label' => 'تاريخ القبول',           'value' => ($approvedAt ?? now())->format('Y/m/d — H:i')],
        ])
    ])
</div>

{{-- Available actions heading --}}
<p class="section-heading" style="font-size:10px; font-weight:700; color:#007aaa; margin:28px 0 12px; padding-bottom:8px; padding-right:10px; border-bottom:1px solid #e0e1dd; border-right:3px solid #00a0da; letter-spacing:0.08em; text-transform:uppercase; font-family:'Cairo', sans-serif;">يمكنكم الآن:</p>
<table class="action-list" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%; border:1px solid #e0e1dd; background-color:#f8f9fb; border-right:3px solid #00a0da; margin:0 0 24px;">
    <tr><td class="action-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; border-bottom:1px solid #eaecef; font-family:'Cairo', sans-serif;"><span class="action-marker" style="display:inline-block; min-width:12px; color:#007aaa; font-weight:600; margin-left:6px;">—</span> تسجيل دخول المعلمين وإدارة طلبات انضمامهم</td></tr>
    <tr><td class="action-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; border-bottom:1px solid #eaecef; font-family:'Cairo', sans-serif;"><span class="action-marker" style="display:inline-block; min-width:12px; color:#007aaa; font-weight:600; margin-left:6px;">—</span> إنشاء الحلقات التعليمية وإضافة الطلاب</td></tr>
    <tr><td class="action-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; border-bottom:1px solid #eaecef; font-family:'Cairo', sans-serif;"><span class="action-marker" style="display:inline-block; min-width:12px; color:#007aaa; font-weight:600; margin-left:6px;">—</span> متابعة تقدم الطلاب وإدارة جلسات الحفظ</td></tr>
    <tr><td class="action-item" style="padding:11px 16px; font-size:13px; color:#2d3748; line-height:1.7; font-family:'Cairo', sans-serif;"><span class="action-marker" style="display:inline-block; min-width:12px; color:#007aaa; font-weight:600; margin-left:6px;">—</span> الوصول إلى لوحة التحكم الخاصة بمؤسستكم</td></tr>
</table>

{{-- Primary action --}}
@php $dashboardUrl = config('app.admin_dashboard_url', config('app.url') . '/admin'); @endphp
@include('emails.partials.cta-button', [
    'url'   => $dashboardUrl,
    'label' => 'الدخول إلى لوحة التحكم',
    'style' => 'primary',
])

{{-- Fallback URL --}}
<p class="fallback-url-hint" style="font-size:12px; color:#778da9; line-height:1.65; text-align:center; margin:-10px 0 8px; font-family:'Cairo', sans-serif;">أو انسخ الرابط أدناه في متصفحك:</p>
<p class="fallback-url" lang="en" xml:lang="en" style="font-family:Consolas,'Courier New',monospace; font-size:11px; color:#415a77; word-break:break-all; background-color:#f8f9fb; padding:10px 14px; border:1px solid #e0e1dd; text-align:left; margin:0 0 20px; direction:ltr; unicode-bidi:embed; display:block; line-height:1.7;">{{ $dashboardUrl }}</p>

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature" style="margin:0; font-size:13px; color:#778da9; text-align:center; line-height:1.9; font-family:'Cairo', sans-serif;">
    نتطلع إلى شراكة علمية مثمرة مع مؤسستكم الكريمة.<br>
    فريق منصة <strong style="color:#007aaa; font-weight:700;">شفيع</strong>
</p>

{{-- Reference number --}}
<p class="reference-line" style="font-size:11px; color:#778da9; text-align:center; margin:16px 0 0; letter-spacing:0.03em; font-family:'Cairo', sans-serif;">
    رقم المرجع: <span class="reference-code" style="font-family:Consolas,'Courier New',monospace; font-size:11px; color:#415a77; direction:ltr; unicode-bidi:embed;">SCH-{{ str_pad($school->id, 6, '0', STR_PAD_LEFT) }}</span>
</p>

@endsection
