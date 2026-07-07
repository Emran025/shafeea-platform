@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'تم تسجيلك في حلقة «' . $halaqah->name . '»')
@section('preheader', 'بشراك! تم تسجيلك في حلقة ' . $halaqah->name . '. افتح التطبيق للاطلاع على التفاصيل.')

@section('header-badge', 'تسجيل في حلقة')
@section('header-title', 'انضممت إلى حلقة جديدة')
@section('header-subtitle', 'رحلتك مع كتاب الله تبدأ الآن')

@section('status-type', 'info')
@section('status-bar', 'تم تسجيلك في الحلقة بنجاح')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Opening Basmala --}}
@include('emails.partials.components.basmala')

{{-- Greeting --}}
<p class="greeting">{{ $enrollment->student->user->name }}،</p>

{{-- Opening body --}}
<p class="body-text">
    نبشرك بأنك قد سُجِّلت في حلقة <strong>«{{ $halaqah->name }}»</strong>
    التابعة لمؤسسة <strong>«{{ $halaqah->school->name }}»</strong>.
    نسأل الله أن تكون هذه بداية مباركة في مسيرة حفظك لكتاب الله الكريم.
</p>

{{-- Halaqah details --}}
<div class="info-box info-box--info">
    <p class="info-box-title">تفاصيل الحلقة</p>
    <table class="data-table" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td class="data-table__label">اسم الحلقة</td>
            <td class="data-table__value">{{ $halaqah->name }}</td>
        </tr>
        <tr>
            <td class="data-table__label">المؤسسة</td>
            <td class="data-table__value">{{ $halaqah->school->name }}</td>
        </tr>
        @if($halaqah->teacher)
        <tr>
            <td class="data-table__label">المعلم المشرف</td>
            <td class="data-table__value">{{ $halaqah->teacher->user->name }}</td>
        </tr>
        @endif
        @if($halaqah->schedules->isNotEmpty())
        <tr>
            <td class="data-table__label">مواعيد الحلقة</td>
            <td class="data-table__value">
                @foreach($halaqah->schedules->take(3) as $schedule)
                    {{ $schedule->day ?? '' }} {{ $schedule->start_time ?? '' }}<br>
                @endforeach
            </td>
        </tr>
        @endif
        <tr>
            <td class="data-table__label">تاريخ التسجيل</td>
            <td class="data-table__value">{{ now()->format('Y/m/d') }}</td>
        </tr>
    </table>
</div>

{{-- Primary action --}}
@include('emails.partials.cta-button', [
    'url'   => config('app.student_app_url', config('app.url')),
    'label' => 'عرض الحلقة في التطبيق',
    'style' => 'primary',
])

@include('emails.partials.components.divider')

{{-- Quranic verse --}}
@include('emails.partials.components.verse', ['text' => '﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾'])

{{-- Closing --}}
<p class="closing-signature">
    نسأل الله أن يجعل رحلتك مع كتابه رحلة بركة وعلم.<br>
    فريق منصة <strong>شفيع</strong>
</p>

@endsection
