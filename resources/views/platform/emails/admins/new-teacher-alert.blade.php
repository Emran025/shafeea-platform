@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'طلب انضمام معلم جديد — ' . ($applicant->user?->name ?? ''))
@section('preheader', 'وردنا طلب انضمام معلم جديد: ' . ($applicant->user?->name ?? '') . '. يتطلب مراجعتك.')

@section('header-badge', 'تنبيه إداري')
@section('header-title', 'طلب انضمام معلم جديد')
@section('header-subtitle', 'يتطلب مراجعتك وإصدار القرار المناسب')

@section('status-type', 'info')
@section('status-bar', 'طلب جديد في انتظار المراجعة')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Greeting --}}
<p class="greeting" style="font-size:16px; font-weight:600; color:#0d1b2a; margin:0 0 8px; line-height:1.5; font-family:'Cairo', sans-serif;">تنبيه إداري،</p>

{{-- Opening context --}}
<p class="body-text" style="font-size:14px; font-weight:400; color:#2d3748; line-height:1.85; margin:0 0 20px; font-family:'Cairo', sans-serif;">
    وردنا طلب انضمام من معلم جديد يرغب في الانضمام إلى مؤسستكم عبر منصة شفيع.
    يُرجى مراجعة الطلب واتخاذ القرار المناسب في أقرب وقت ممكن.
</p>

{{-- Applicant details --}}
<div class="info-box info-box--info" style="background-color:#f5fbff; border:1px solid #bde3f4; border-right:3px solid #00a0da; padding:18px 20px 16px; margin:0 0 20px;">
    <p class="info-box-title" style="font-size:10px; font-weight:700; color:#005f87; margin:0 0 12px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">بيانات المعلم</p>
    @include('emails.partials.components.data-table', [
        'rows' => array_filter([
            ['label' => 'الاسم',              'value' => $applicant->user?->name  ?? '—'],
            ['label' => 'البريد الإلكتروني',  'value' => $applicant->user?->email ?? '—', 'dir' => 'ltr'],
            !empty($applicant->user?->phone)          ? ['label' => 'رقم الهاتف',   'value' => $applicant->user->phone, 'dir' => 'ltr'] : null,
            !empty($applicant->qualifications)        ? ['label' => 'المؤهلات',     'value' => \Illuminate\Support\Str::limit($applicant->qualifications, 80)] : null,
            !empty($applicant->memorization_level)    ? ['label' => 'مستوى الحفظ', 'value' => $applicant->memorization_level] : null,
            ['label' => 'تاريخ التقديم', 'value' => ($applicant->submitted_at ?? $applicant->created_at)?->format('Y/m/d H:i') ?? 'غير محدد'],
        ])
    ])
</div>

{{-- Primary action --}}
@php $reviewUrl = config('app.admin_dashboard_url', config('app.url') . '/admin') . '/applicants/' . $applicant->id; @endphp
@include('emails.partials.cta-button', [
    'url'   => $reviewUrl,
    'label' => 'مراجعة الطلب الآن',
    'style' => 'primary',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature" style="margin:0; font-size:13px; color:#778da9; text-align:center; line-height:1.9; font-family:'Cairo', sans-serif;">
    هذا التنبيه أُرسل تلقائياً عند تقديم طلب انضمام معلم جديد.<br>
    منصة <strong style="color:#007aaa; font-weight:700;">شفيع</strong> — النظام الإداري
</p>

@endsection
