@extends('emails.layout.master')

@section('email-title', 'تحديث بخصوص طلب الانضمام في ' . ($applicant->school->name ?? 'المؤسسة'))
@section('preheader', 'لديك تحديث بخصوص طلب الانضمام في ' . ($applicant->school->name ?? 'المؤسسة') . '.')

@section('header-badge', 'تحديث الطلب')
@section('header-title', 'تحديث حول طلبك')
@section('header-subtitle', 'منصة شفيع لتعليم القرآن الكريم')

@section('status-type', 'warning')
@section('status-bar', 'يتطلب الطلب مراجعة إضافية')

@section('content')

    <p class="greeting">بسم الله الرحمن الرحيم</p>
    <p class="greeting">{{ $applicant->user->name }}،</p>

    <p class="body-text">
        شكراً لتسجيلك في منصة شفيع واهتمامك بالانضمام إلى
        <strong>"{{ $applicant->school->name }}"</strong>.
        نُقدّر ثقتك بنا ونعتز بكل خطوة تخطوها نحو حفظ القرآن الكريم.
    </p>

    <p class="body-text">
        بعد مراجعة طلبك بعناية، لم يتسنَّ لنا في المرحلة الحالية استكمال قبولك.
        نؤكد لك أن ذلك لا يعني رفضاً نهائياً، وأن بإمكانك دائماً التواصل معنا
        أو إعادة التقديم.
    </p>

    @if(!empty($rejectionReason))
    <div class="info-box" style="border-right-color: #e65100;">
        <p class="info-box-title" style="color:#e65100;">&#128196; ملاحظة المؤسسة</p>
        <p style="margin:0; font-size:14px; color:#374151; line-height:1.8; font-style:italic;">
            "{{ $rejectionReason }}"
        </p>
    </div>
    @endif

    <p style="font-size:15px; font-weight:700; color:#0d1b2a; margin:0 0 14px;">يمكنك:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#415a77; margin-left:10px;">&#128222;</span>
                التواصل مع المؤسسة مباشرة للاستفسار
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#415a77; margin-left:10px;">&#128196;</span>
                تحديث بياناتك وإعادة التقديم لاحقاً
            </td>
        </tr>
    </table>

    <div class="cta-wrapper">
        <a href="{{ config('app.url') . '/contact' }}" class="cta-button-ghost">
            تواصل مع فريق الدعم
        </a>
    </div>

    <hr class="divider">

    <p class="body-text" style="margin:0; font-size:13px; color:#9ca3af; text-align:center;">
        لا تيأس، فكل خطوة في طريق العلم مباركة.<br>
        فريق منصة <strong style="color:#415a77;">شفيع</strong>
    </p>

@endsection
