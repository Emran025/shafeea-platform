@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'طلب انضمام طالب جديد — ' . $applicant->user->name)
@section('preheader', 'وردنا طلب انضمام طالب جديد: ' . $applicant->user->name . '. يتطلب مراجعتك.')

@section('header-badge', 'تنبيه مؤسسة')
@section('header-title', 'طلب انضمام طالب جديد')
@section('header-subtitle', 'يتطلب مراجعتك وإصدار القرار المناسب')

@section('status-type', 'info')
@section('status-bar', 'طلب جديد في انتظار المراجعة')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Greeting --}}
<p class="greeting">تنبيه إداري،</p>

{{-- Opening context --}}
<p class="body-text">
    وردنا طلب انضمام من طالب جديد يرغب في الانضمام إلى مؤسستكم عبر منصة شفيع.
    يُرجى مراجعة الطلب واتخاذ القرار المناسب في أقرب وقت ممكن.
</p>

{{-- Applicant details --}}
<div class="info-box info-box--info">
    <p class="info-box-title">بيانات الطالب</p>
    <table class="data-table" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td class="data-table__label">الاسم</td>
            <td class="data-table__value">{{ $applicant->user->name }}</td>
        </tr>
        <tr>
            <td class="data-table__label">البريد الإلكتروني</td>
            <td class="data-table__value">{{ $applicant->user->email }}</td>
        </tr>
        @if($applicant->user->gender)
        <tr>
            <td class="data-table__label">الجنس</td>
            <td class="data-table__value">{{ $applicant->user->gender === 'male' ? 'ذكر' : 'أنثى' }}</td>
        </tr>
        @endif
        @if($applicant->memorization_level)
        <tr>
            <td class="data-table__label">مستوى الحفظ</td>
            <td class="data-table__value">{{ $applicant->memorization_level }}</td>
        </tr>
        @endif
        @if($applicant->school)
        <tr>
            <td class="data-table__label">المؤسسة المُتقدَّم إليها</td>
            <td class="data-table__value">{{ $applicant->school->name }}</td>
        </tr>
        @endif
        <tr>
            <td class="data-table__label">تاريخ التقديم</td>
            <td class="data-table__value">{{ optional($applicant->submitted_at)->format('Y/m/d H:i') ?? $applicant->created_at->format('Y/m/d H:i') }}</td>
        </tr>
    </table>
</div>

{{-- Primary action --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.url') . '/admin/applicants/' . $applicant->id,
    'label' => 'مراجعة الطلب الآن',
    'style' => 'primary',
])

@include('emails.partials.components.divider')

{{-- Closing --}}
<p class="closing-signature">
    هذا التنبيه أُرسل تلقائياً عند تقديم طلب انضمام طالب جديد.<br>
    منصة <strong>شفيع</strong>
</p>

@endsection
