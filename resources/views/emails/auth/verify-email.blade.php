@extends('emails.layout.master')

{{-- ═══════════════════════════════════════════════════════════════
     METADATA
     Section values are passed directly to the master layout.
     All dynamic bindings below are preserved exactly as received.
════════════════════════════════════════════════════════════════ --}}
@section('email-title', 'تأكيد حسابك — منصة شفيع')
@section('preheader', 'أهلاً بك في منصة شفيع، يرجى تأكيد بريدك الإلكتروني لتفعيل حسابك.')

@section('header-title', 'تأكيد البريد الإلكتروني')
@section('header-subtitle', 'إجراء مطلوب لإتمام تفعيل حسابك')

@section('status-type', 'info')
@section('status-bar', 'في انتظار تأكيد البريد الإلكتروني')

{{-- ═══════════════════════════════════════════════════════════════
     CONTENT
════════════════════════════════════════════════════════════════ --}}
@section('content')

{{-- Greeting --}}
<p class="greeting">مرحباً {{ $userName ?? 'بك' }}،</p>

{{-- Opening body --}}
<p class="body-text">
    نرحّب بانضمامك إلى <strong>منصة شفيع</strong>. لإتمام تفعيل حسابك،
    يرجى تأكيد عنوان بريدك الإلكتروني عبر الزر أدناه.
    <br><br>
    هذه الخطوة ضرورية لضمان أمان حسابك وحماية بياناتك الشخصية.
</p>

{{-- Primary action --}}
@include('emails.partials.cta-button', [
    'url'   => $verificationUrl,
    'label' => 'تأكيد البريد الإلكتروني',
    'style' => 'primary',
])

{{-- Validity notice --}}
<div class="info-card">
    <p class="info-card-text">
        هذا الرابط صالح لمدة <strong>60 دقيقة</strong> فقط.
        في حال انتهاء الصلاحية، يمكنك طلب رابط جديد من داخل التطبيق.
    </p>
</div>

{{-- Fallback URL for clients that block buttons --}}
<p class="fallback-url-hint">
    إذا واجهت مشكلة في النقر على الزر، انسخ الرابط أدناه والصقه في متصفحك:
</p>
<p class="fallback-url">{{ $verificationUrl }}</p>

{{-- Security disclaimer --}}
<p class="footer-note">
    إذا لم تقم بإنشاء حساب في منصة شفيع، يُرجى تجاهل هذه الرسالة.
    لن يُفعَّل أي حساب دون النقر على رابط التأكيد.
</p>

@endsection
