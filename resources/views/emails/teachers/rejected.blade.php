@extends('emails.layout.master')

@section('email-title', 'تحديث بخصوص طلبك في ' . ($applicant->school->name ?? 'المؤسسة'))
@section('preheader', 'تحديث حول طلب انضمامك في ' . ($applicant->school->name ?? 'المؤسسة') . ' عبر منصة شفيع.')

@section('header-badge', 'تحديث الطلب')
@section('header-title', 'تحديث حول طلب انضمامك')
@section('header-subtitle', 'منصة شفيع لتعليم القرآن الكريم')

@section('status-type', 'warning')
@section('status-bar', 'يتطلب الطلب مراجعة إضافية')

@section('content')

    <p class="greeting">بسم الله الرحمن الرحيم</p>
    <p class="greeting">الأستاذ/ة {{ $applicant->user->name }}،</p>

    <p class="body-text">
        شكراً لاهتمامك بالانضمام إلى <strong>"{{ $applicant->school->name }}"</strong>
        كمعلم عبر منصة شفيع. نقدّر وقتك والجهد الذي بذلته في إعداد طلبك.
    </p>

    <p class="body-text">
        بعد مراجعة الطلب بعناية، لم نتمكن في المرحلة الحالية من استكمال
        قبولك في هذه المؤسسة. نؤكد لك أن هذا لا يمنعك من التقدم لمؤسسات أخرى
        على المنصة.
    </p>

    @if(!empty($rejectionReason))
    <div class="info-box" style="border-right-color: #e65100;">
        <p class="info-box-title" style="color:#e65100;">&#128196; ملاحظة المؤسسة</p>
        <p style="margin:0; font-size:14px; color:#374151; line-height:1.8; font-style:italic;">
            "{{ $rejectionReason }}"
        </p>
    </div>
    @endif

    <p style="font-size:15px; font-weight:700; color:#0d1b2a; margin:0 0 14px;">ماذا يمكنك فعله الآن؟</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#415a77; margin-left:10px;">&#128269;</span>
                استعراض المؤسسات الأخرى المتاحة على المنصة
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#415a77; margin-left:10px;">&#128196;</span>
                مراجعة بياناتك وتحديث مؤهلاتك قبل التقديم مجدداً
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#415a77; margin-left:10px;">&#128222;</span>
                التواصل مع فريق الدعم إن احتجت مساعدة
            </td>
        </tr>
    </table>

    {{-- CTA --}}
    <div class="cta-wrapper">
        <a href="{{ config('app.url') }}" class="cta-button-secondary">
            &#128269;&nbsp;&nbsp;استعراض المؤسسات المتاحة
        </a>
    </div>

    <hr class="divider">

    <p class="body-text" style="margin:0; font-size:13px; color:#9ca3af; text-align:center;">
        نتمنى لك التوفيق في مسيرتك التعليمية.<br>
        فريق منصة <strong style="color:#415a77;">شفيع</strong>
    </p>

@endsection
