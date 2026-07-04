@extends('emails.layout.master')

@section('email-title', 'تم تسجيلك في حلقة "' . $halaqah->name . '"')
@section('preheader', 'بشراك! تم تسجيلك في حلقة ' . $halaqah->name . '. افتح التطبيق للاطلاع على التفاصيل.')

@section('header-badge', 'تسجيل في حلقة')
@section('header-title', 'انضممت إلى حلقة جديدة')
@section('header-subtitle', 'رحلتك مع كتاب الله تبدأ الآن')

@section('status-type', 'info')
@section('status-bar', 'تم تسجيلك في الحلقة بنجاح')

@section('content')

    <p class="greeting">بسم الله الرحمن الرحيم</p>
    <p class="greeting">{{ $enrollment->student->user->name }}،</p>

    <p class="body-text">
        نبشرك بأنك قد سُجِّلت في حلقة <strong>"{{ $halaqah->name }}"</strong>
        التابعة لمؤسسة <strong>"{{ $halaqah->school->name }}"</strong>.
        نسأل الله أن تكون هذه بداية مباركة في مسيرة حفظك لكتاب الله الكريم.
    </p>

    {{-- Halaqah Details Box --}}
    <div class="info-box" style="border-right-color: #2196f3;">
        <p class="info-box-title" style="color:#0d47a1;">&#128203; تفاصيل الحلقة</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77; width:40%;">اسم الحلقة</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $halaqah->name }}</td>
            </tr>
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">المؤسسة</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $halaqah->school->name }}</td>
            </tr>
            @if($halaqah->teacher)
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">المعلم المشرف</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $halaqah->teacher->user->name }}</td>
            </tr>
            @endif
            @if($halaqah->schedules->isNotEmpty())
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">مواعيد الحلقة</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">
                    @foreach($halaqah->schedules->take(3) as $schedule)
                        {{ $schedule->day ?? '' }} {{ $schedule->start_time ?? '' }}<br>
                    @endforeach
                </td>
            </tr>
            @endif
            <tr>
                <td style="padding:9px 0; font-size:13px; font-weight:600; color:#415a77;">تاريخ التسجيل</td>
                <td style="padding:9px 0; font-size:13px; color:#0d1b2a; text-align:left;">{{ now()->format('Y/m/d') }}</td>
            </tr>
        </table>
    </div>

    {{-- CTA --}}
    <div class="cta-wrapper">
        <a href="{{ config('app.student_app_url', config('app.url')) }}" class="cta-button">
            &#128241;&nbsp;&nbsp;عرض الحلقة في التطبيق
        </a>
    </div>

    <hr class="divider">

    <p style="text-align:center; font-size:17px; margin:0 0 8px; color:#1b263b;">﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾</p>
    <p class="body-text" style="margin:0; font-size:13px; color:#9ca3af; text-align:center;">
        نسأل الله أن يجعل رحلتك مع كتابه رحلة بركة وعلم.<br>
        فريق منصة <strong style="color:#415a77;">شفيع</strong>
    </p>

@endsection
