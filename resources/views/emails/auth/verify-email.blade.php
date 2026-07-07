@extends('emails.layout.master')

@section('email-title', 'تأكيد حسابك — منصة شفيع')
@section('preheader', 'أهلاً بك في منصة شفيع، يرجى تأكيد بريدك الإلكتروني لتفعيل حسابك.')

@section('content')

<div class="greeting">مرحباً {{ $userName ?? 'بك' }} 👋</div>

<p class="body-text">
    سعداء جداً بانضمامك إلى <strong>منصة شفيع</strong>. نحن هنا لنرافقك في رحلتك التعليمية ونوفر لك أفضل الأدوات والخبرات.
    <br><br>
    للبدء، يرجى تأكيد هويتك من خلال النقر على الزر أدناه. هذه الخطوة ضرورية لضمان أمان حسابك وحماية بياناتك.
</p>

<div class="cta-wrapper">
    <a href="{{ $verificationUrl }}" class="cta-button">
        تأكيد البريد الإلكتروني
    </a>
</div>

<div class="info-card">
    <p style="margin: 0; font-size: 14px; color: #64748b; text-align: center;">
        هذا الرابط صالح لمدة <strong>60 دقيقة</strong> فقط. إذا انتهت الصلاحية، يمكنك طلب رابط جديد من خلال التطبيق.
    </p>
</div>

<p style="font-size: 12px; color: #94a3b8; line-height: 1.6; text-align: center; margin: 0 0 10px 0;">
    إذا واجهت مشكلة في النقر على الزر، يمكنك نسخ الرابط أدناه ولصقه في متصفحك:
</p>
<p style="font-family: monospace; font-size: 11px; color: #64748b; word-break: break-all; background: #f8fafc; padding: 12px; border-radius: 8px; text-align: left; border: 1px solid #f1f5f9; margin-bottom: 20px;">
    {{ $verificationUrl }}
</p>

<p class="footer-note">
    إذا لم تقم بإنشاء حساب في منصة شفيع، يرجى تجاهل هذا البريد الإلكتروني.
</p>

@endsection
