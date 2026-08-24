@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'تأكيد حسابك — منصة شفيع')
@section('preheader', 'يرجى تأكيد بريدك الإلكتروني لتفعيل حسابك — الرابط صالح لمدة 60 دقيقة فقط.')

@section('header-title', 'تأكيد البريد الإلكتروني')
@section('header-subtitle', 'إجراء مطلوب لإتمام تفعيل حسابك')

@section('status-type', 'info')
@section('status-bar', 'في انتظار تأكيد البريد الإلكتروني')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Greeting --}}
<p class="greeting" style="font-size:16px; font-weight:600; color:#0d1b2a; margin:0 0 8px; line-height:1.5; font-family:'Cairo', sans-serif;">مرحباً {{ $userName ?? 'بك' }}،</p>

{{-- Opening body — split into two separate paragraphs (no <br><br>) --}}
<p class="body-text" style="font-size:14px; font-weight:400; color:#2d3748; line-height:1.85; margin:0 0 14px; font-family:'Cairo', sans-serif;">
    نرحّب بانضمامك إلى <strong>منصة شفيع</strong>. لإتمام تفعيل حسابك،
    يرجى تأكيد عنوان بريدك الإلكتروني عبر الزر أدناه.
</p>
<p class="body-text" style="font-size:14px; font-weight:400; color:#2d3748; line-height:1.85; margin:0 0 20px; font-family:'Cairo', sans-serif;">
    هذه الخطوة ضرورية لضمان أمان حسابك وحماية بياناتك الشخصية.
</p>

{{-- Primary action --}}
@include('emails.partials.cta-button', [
    'url'   => $verificationUrl,
    'label' => 'تأكيد البريد الإلكتروني',
    'style' => 'primary',
])

{{-- Validity notice --}}
<div class="info-card" style="background-color:#f5fbff; border:1px solid #bde3f4; padding:14px 16px; margin:0 0 20px;">
    <p class="info-card-text" style="margin:0; font-size:13px; color:#005f87; text-align:center; line-height:1.75; font-family:'Cairo', sans-serif;">
        هذا الرابط صالح لمدة <strong>60 دقيقة</strong> فقط.
        في حال انتهاء الصلاحية، يمكنك طلب رابط جديد من داخل التطبيق.
    </p>
</div>

{{-- Security disclaimer --}}
<p class="footer-note" style="font-size:12px; color:#778da9; line-height:1.75; text-align:center; margin:28px 0 0; border-top:1px solid #eaecef; padding-top:20px; font-family:'Cairo', sans-serif;">
    إذا لم تقم بإنشاء حساب في منصة شفيع، يُرجى تجاهل هذه الرسالة.
    لن يُفعَّل أي حساب دون النقر على رابط التأكيد.
</p>

@endsection
