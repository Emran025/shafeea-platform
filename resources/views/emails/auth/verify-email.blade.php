@extends('emails.layout.master')

@section('email-title', 'تأكيد بريدك الإلكتروني — منصة شفيع')

@section('preheader', 'انقر على الرابط أدناه لتأكيد بريدك الإلكتروني والبدء في استخدام منصة شفيع')

@section('content')

<h1 style="font-family: 'Cairo', Arial, sans-serif; font-size: 22px; font-weight: 700; color: #1e293b; margin: 0 0 16px 0; text-align: right;">
    مرحباً {{ $userName ?? 'بك' }} 👋
</h1>

<p style="font-family: 'Cairo', Arial, sans-serif; font-size: 15px; color: #475569; line-height: 1.8; margin: 0 0 20px 0; text-align: right;">
    شكراً لانضمامك إلى <strong>منصة شفيع</strong>. قبل أن تبدأ، نحتاج منك تأكيد عنوان بريدك الإلكتروني لضمان أمان حسابك.
</p>

<p style="font-family: 'Cairo', Arial, sans-serif; font-size: 15px; color: #475569; line-height: 1.8; margin: 0 0 28px 0; text-align: right;">
    انقر على الزر أدناه لتفعيل حسابك. الرابط صالح لمدة <strong>60 دقيقة</strong>.
</p>

{{-- CTA Button --}}
<div style="text-align: center; margin: 0 0 28px 0;">
    <a href="{{ $verificationUrl }}"
       style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; font-family: 'Cairo', Arial, sans-serif; font-size: 16px; font-weight: 700; text-decoration: none; padding: 14px 40px; border-radius: 10px; box-shadow: 0 4px 14px rgba(14,165,233,0.35);">
        تأكيد البريد الإلكتروني
    </a>
</div>

{{-- Fallback link --}}
<p style="font-family: 'Cairo', Arial, sans-serif; font-size: 12px; color: #94a3b8; line-height: 1.6; text-align: right; margin: 0 0 10px 0;">
    إذا لم يعمل الزر، انسخ الرابط التالي والصقه في متصفحك:
</p>
<p style="font-family: monospace; font-size: 11px; color: #64748b; word-break: break-all; background: #f1f5f9; padding: 10px; border-radius: 6px; text-align: left; margin: 0 0 20px 0;">
    {{ $verificationUrl }}
</p>

<p style="font-family: 'Cairo', Arial, sans-serif; font-size: 13px; color: #94a3b8; line-height: 1.6; text-align: right; margin: 0;">
    إذا لم تقم بإنشاء حساب على منصة شفيع، يمكنك تجاهل هذه الرسالة بأمان.
</p>

@endsection
