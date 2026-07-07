{{-- Structure: institutional document footer --}}
<footer class="email-footer">
    <div class="footer-rule" aria-hidden="true"></div>

    <p class="footer-org">منصة شفيع</p>
    <p class="footer-org-tagline">نظام إدارة تعليم القرآن الكريم</p>

    <nav class="footer-links" aria-label="روابط المنصة">
        <a href="{{ config('app.url') }}" class="footer-link">الموقع الرسمي</a>
        <span class="footer-link-sep" aria-hidden="true">|</span>
        <a href="{{ config('app.url') }}/privacy" class="footer-link">سياسة الخصوصية</a>
        <span class="footer-link-sep" aria-hidden="true">|</span>
        <a href="{{ config('app.url') }}/contact" class="footer-link">تواصل معنا</a>
    </nav>

    <p class="footer-copyright">
        &copy; {{ date('Y') }} منصة شفيع. جميع الحقوق محفوظة.
    </p>
    <p class="footer-disclaimer">
        هذه رسالة آلية صادرة عن النظام — يرجى عدم الرد عليها مباشرة.
    </p>
</footer>
