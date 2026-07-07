@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'تم تسجيلك في حلقة «' . ($halaqah->name ?? '') . '»')
@section('preheader', 'المعلم المشرف، مواعيد الحلقة، وخطوات البدء — كل التفاصيل بالداخل.')

@section('header-badge', 'تسجيل في حلقة')
@section('header-title', 'انضممت إلى حلقة جديدة')
@section('header-subtitle', 'رحلتك مع كتاب الله تبدأ الآن')

@section('status-type', 'success')
@section('status-bar', 'تم تسجيلك في الحلقة بنجاح')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Opening Basmala --}}
@include('emails.partials.components.basmala')

{{-- Greeting --}}
<p class="greeting" style="font-size:16px; font-weight:600; color:#0d1b2a; margin:0 0 8px; line-height:1.5; font-family:'Cairo', sans-serif;">{{ $enrollment->student?->user?->name ?? 'طالبنا الكريم' }}،</p>

{{-- Opening body --}}
<p class="body-text" style="font-size:14px; font-weight:400; color:#2d3748; line-height:1.85; margin:0 0 20px; font-family:'Cairo', sans-serif;">
    نبشرك بأنك قد سُجِّلت في حلقة <strong>«{{ $halaqah->name ?? '—' }}»</strong>
    التابعة لمؤسسة <strong>«{{ $halaqah->school?->name ?? '—' }}»</strong>.
    نسأل الله أن تكون هذه بداية مباركة في مسيرة حفظك لكتاب الله الكريم.
</p>

{{-- Halaqah details — using data-table component with formatted schedule --}}
@php
    $dayNames = [
        'sunday' => 'الأحد', 'monday' => 'الاثنين', 'tuesday' => 'الثلاثاء',
        'wednesday' => 'الأربعاء', 'thursday' => 'الخميس',
        'friday' => 'الجمعة', 'saturday' => 'السبت',
    ];

    $scheduleLines = collect($halaqah->schedules ?? [])->take(3)->map(function($s) use ($dayNames) {
        // e() escapes any DB-sourced text before it is joined with trusted <br> markup
        $day  = e($dayNames[strtolower($s->day ?? '')] ?? ($s->day ?? ''));
        $time = $s->start_time ? e(\Carbon\Carbon::parse($s->start_time)->format('h:i A')) : '';
        return trim($day . ($time ? ' — ' . $time : ''));
    })->filter()->implode('<br>');

    // scheduleLines is safe HTML: user-controlled fragments are HTML-escaped via e(),
    // only the literal '<br>' separator is unescaped. Pass 'raw' => true so the component
    // renders it with {!! !!} instead of {{ }}.
    $scheduleValue = $scheduleLines ?: 'سيتم إبلاغك بالمواعيد قريباً';
    $scheduleIsRaw = (bool) $scheduleLines;
@endphp

<div class="info-box info-box--info" style="background-color:#f5fbff; border:1px solid #bde3f4; border-right:3px solid #00a0da; padding:18px 20px 16px; margin:0 0 20px;">
    <p class="info-box-title" style="font-size:10px; font-weight:700; color:#005f87; margin:0 0 12px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">تفاصيل الحلقة</p>
    @include('emails.partials.components.data-table', [
        'rows' => array_filter([
            ['label' => 'اسم الحلقة',        'value' => $halaqah->name          ?? '—'],
            ['label' => 'المؤسسة',            'value' => $halaqah->school?->name ?? '—'],
            $halaqah->teacher ? ['label' => 'المعلم المشرف', 'value' => $halaqah->teacher?->user?->name ?? '—'] : null,
            ['label' => 'مواعيد الحلقة',     'value' => $scheduleValue, 'raw' => $scheduleIsRaw],
            ['label' => 'تاريخ التسجيل',     'value' => ($enrolledAt ?? now())->format('Y/m/d — H:i')],
        ])
    ])
</div>

{{-- Primary action --}}
@php $appUrl = config('app.student_app_url', config('app.url')); @endphp
@include('emails.partials.cta-button', [
    'url'   => $appUrl,
    'label' => 'عرض الحلقة في التطبيق',
    'style' => 'primary',
])

{{-- Fallback URL --}}
<p class="fallback-url-hint" style="font-size:12px; color:#778da9; line-height:1.65; text-align:center; margin:-10px 0 8px; font-family:'Cairo', sans-serif;">أو انسخ الرابط أدناه في متصفحك:</p>
<p class="fallback-url" lang="en" xml:lang="en" style="font-family:Consolas,'Courier New',monospace; font-size:11px; color:#415a77; word-break:break-all; background-color:#f8f9fb; padding:10px 14px; border:1px solid #e0e1dd; text-align:left; margin:0 0 20px; direction:ltr; unicode-bidi:embed; display:block; line-height:1.7;">{{ $appUrl }}</p>

@include('emails.partials.components.divider')

{{-- Quranic verse --}}
@include('emails.partials.components.verse', ['text' => '﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾'])

{{-- Closing --}}
<p class="closing-signature" style="margin:0; font-size:13px; color:#778da9; text-align:center; line-height:1.9; font-family:'Cairo', sans-serif;">
    نسأل الله أن يجعل رحلتك مع كتابه رحلة بركة وعلم.<br>
    فريق منصة <strong style="color:#007aaa; font-weight:700;">شفيع</strong>
</p>

{{-- Reference number --}}
<p class="reference-line" style="font-size:11px; color:#778da9; text-align:center; margin:16px 0 0; letter-spacing:0.03em; font-family:'Cairo', sans-serif;">
    رقم المرجع: <span class="reference-code" style="font-family:Consolas,'Courier New',monospace; font-size:11px; color:#415a77; direction:ltr; unicode-bidi:embed;">ENR-{{ str_pad($enrollment->id, 6, '0', STR_PAD_LEFT) }}</span>
</p>

@endsection
