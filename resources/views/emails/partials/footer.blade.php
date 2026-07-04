{{-- ===== FOOTER ===== --}}
<div class="email-footer">
    <p class="footer-logo-text">شَفيع</p>
    <div class="footer-links">
        <a href="{{ config('app.url') }}" class="footer-link">الموقع الرسمي</a>
        <span class="footer-separator">|</span>
        <a href="{{ config('app.url') }}/contact" class="footer-link">تواصل معنا</a>
        <span class="footer-separator">|</span>
        <a href="{{ config('app.url') }}/privacy" class="footer-link">سياسة الخصوصية</a>
    </div>
    <p class="footer-address">
        هذه رسالة تلقائية من منصة شفيع. يُرجى عدم الرد عليها مباشرة.<br>
        للدعم والاستفسار:
        <a href="mailto:{{ config('mail.from.address', 'support@shafeea.app') }}" style="color:#415a77; text-decoration:none;">
            {{ config('mail.from.address', 'support@shafeea.app') }}
        </a>
    </p>
    <p class="footer-copyright">
        &copy; {{ date('Y') }} منصة شفيع &mdash; جميع الحقوق محفوظة.
    </p>
</div>
{{-- /FOOTER --}}
