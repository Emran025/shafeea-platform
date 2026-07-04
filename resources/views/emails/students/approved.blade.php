@extends('emails.layout.master')

@section('email-title', 'مرحباً ' . $applicant->user->name . ' — تم قبولك في ' . ($applicant->school->name ?? 'المؤسسة'))
@section('preheader', 'الحمد لله! تمت الموافقة على انضمامك وأصبح بإمكانك البدء في رحلة حفظ القرآن الكريم.')

@section('header-badge', 'قبول الطالب')
@section('header-title', 'أهلاً بك في رحلة الحفظ 📖')
@section('header-subtitle', 'تمت الموافقة على انضمامك رسمياً')

@section('status-type', 'success')
@section('status-bar', 'تم قبولك بنجاح — حسابك مفعّل الآن')

@section('content')

    <p class="greeting">بسم الله الرحمن الرحيم</p>
    <p class="greeting" style="font-size:18px;">{{ $applicant->user->name }}،</p>

    <p class="body-text">
        الحمد لله، تمت الموافقة على انضمامك إلى مؤسسة
        <strong>"{{ $applicant->school->name }}"</strong>
        على منصة شفيع. نسعد بانضمامك ونسأل الله أن يُعينك ويُبارك في مسيرتك.
    </p>

    {{-- Details Box --}}
    <div class="info-box">
        <p class="info-box-title">&#128203; تفاصيل الانضمام</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77; width:45%;">الاسم</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $applicant->user->name }}</td>
            </tr>
            <tr>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; font-weight:600; color:#415a77;">المؤسسة</td>
                <td style="padding:9px 0; border-bottom:1px solid #e0e1dd; font-size:13px; color:#0d1b2a; text-align:left;">{{ $applicant->school->name }}</td>
            </tr>
            <tr>
                <td style="padding:9px 0; font-size:13px; font-weight:600; color:#415a77;">تاريخ القبول</td>
                <td style="padding:9px 0; font-size:13px; color:#0d1b2a; text-align:left;">{{ now()->format('Y/m/d') }}</td>
            </tr>
        </table>
    </div>

    <p style="font-size:15px; font-weight:700; color:#0d1b2a; margin:0 0 14px;">ابدأ رحلتك الآن:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#1b263b; margin-left:10px; font-weight:700;">1.</span>
                قم بتحميل تطبيق الطالب من المتجر
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#1b263b; margin-left:10px; font-weight:700;">2.</span>
                سجّل الدخول باستخدام بريدك الإلكتروني وكلمة مرورك
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#1b263b; margin-left:10px; font-weight:700;">3.</span>
                اطّلع على الحلقات المتاحة وانضم إلى المجموعة المناسبة لك
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#1b263b; margin-left:10px; font-weight:700;">4.</span>
                تابع تقدمك يومياً وحافظ على استمراريتك
            </td>
        </tr>
    </table>

    {{-- CTA --}}
    <div class="cta-wrapper">
        <a href="{{ config('app.student_app_url', config('app.url')) }}" class="cta-button">
            &#128241;&nbsp;&nbsp;فتح تطبيق الطالب
        </a>
    </div>

    <hr class="divider">

    <p style="text-align:center; font-size:18px; margin:0 0 8px; color:#1b263b;">﴿ وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ﴾</p>
    <p class="body-text" style="margin:0; font-size:13px; color:#9ca3af; text-align:center;">
        نسأل الله أن يُيسر لك حفظ كتابه الكريم.<br>
        فريق منصة <strong style="color:#415a77;">شفيع</strong>
    </p>

@endsection
