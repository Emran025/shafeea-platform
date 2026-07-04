@extends('emails.layout.master')

@section('email-title', 'بخصوص طلب انضمام ' . $school->name . ' إلى منصة شفيع')
@section('preheader', 'شكراً لتقديم طلب الانضمام. نود إبلاغكم بتحديث حول طلبكم.')

@section('header-badge', 'تحديث الطلب')
@section('header-title', 'تحديث حول طلب الانضمام')
@section('header-subtitle', 'منصة شفيع لتعليم القرآن الكريم')

@section('status-type', 'warning')
@section('status-bar', 'يتطلب الطلب مراجعة إضافية')

@section('content')

    <p class="greeting">بسم الله الرحمن الرحيم</p>
    <p class="greeting">السيد/ة {{ $school->admin?->user?->name ?? 'مسؤول المؤسسة' }}،</p>

    <p class="body-text">
        شكراً لتقديم طلب انضمام مؤسستكم التعليمية <strong>"{{ $school->name }}"</strong>
        إلى منصة شفيع، وعلى ثقتكم بنا.
    </p>

    <p class="body-text">
        بعد مراجعة الطلب والوثائق المقدمة بعناية، لم نتمكن في الوقت الحالي من
        إتمام عملية القبول. ندرك أن هذا قد لا يكون الخبر المتوقع، ونؤكد لكم أن
        هذا القرار لا يعكس تقييماً سلبياً لمؤسستكم.
    </p>

    {{-- Rejection Reason Box --}}
    @if(!empty($rejectionReason))
    <div class="info-box" style="border-right-color: #e65100;">
        <p class="info-box-title" style="color:#e65100;">&#128196; ملاحظة الفريق</p>
        <p style="margin:0; font-size:14px; color:#374151; line-height:1.8; font-style:italic;">
            "{{ $rejectionReason }}"
        </p>
    </div>
    @endif

    {{-- Next Steps --}}
    <p style="font-size:15px; font-weight:700; color:#0d1b2a; margin:0 0 14px;">الخطوات التالية:</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#415a77; margin-left:10px;">&#128338;</span>
                مراجعة المعلومات والوثائق التي تم تقديمها
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#415a77; margin-left:10px;">&#128222;</span>
                التواصل مع فريق الدعم لمعرفة المتطلبات الإضافية
            </td>
        </tr>
        <tr>
            <td style="padding:10px 0; font-size:14px; color:#374151; line-height:1.6;">
                <span style="color:#415a77; margin-left:10px;">&#128196;</span>
                إعادة تقديم الطلب بعد استيفاء المتطلبات
            </td>
        </tr>
    </table>

    {{-- CTA --}}
    <div class="cta-wrapper">
        <a href="{{ config('app.url') . '/contact' }}" class="cta-button-secondary">
            &#128222;&nbsp;&nbsp;تواصل مع فريق الدعم
        </a>
    </div>

    <hr class="divider">

    <p class="body-text" style="margin:0; font-size:13px; color:#9ca3af; text-align:center; line-height:1.8;">
        نأمل أن تتمكنوا من استيفاء المتطلبات والعودة للتقديم مستقبلاً.<br>
        يشرفنا خدمتكم — فريق منصة <strong style="color:#415a77;">شفيع</strong>
    </p>

@endsection
