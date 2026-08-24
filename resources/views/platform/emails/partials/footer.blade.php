{{-- Structure: institutional document footer --}}
<footer class="email-footer" style="padding:0 40px 28px; text-align:center; background-color:#f2f3f1; border-top:1px solid #e0e1dd; font-family:'Cairo', sans-serif;">
    <div class="footer-rule" style="height:1px; background-color:#d4d8de; margin:0 0 20px; font-size:0; line-height:0;" aria-hidden="true"></div>

    <p class="footer-org" style="font-size:13px; font-weight:700; color:#1b263b; margin:22px 0 3px; font-family:'Cairo', sans-serif;">منصة شفيع</p>
    <p class="footer-org-tagline" style="font-size:10px; color:#778da9; margin:0 0 16px; text-transform:uppercase; letter-spacing:0.04em; font-family:'Cairo', sans-serif;">منصة تعليم القرآن الكريم</p>

    <nav class="footer-links" style="margin:0 0 14px;" aria-label="روابط المنصة">
        <a href="{{ config('app.url') }}" class="footer-link" style="color:#415a77 !important; text-decoration:none; font-size:11px; font-weight:500; margin:0 6px; font-family:'Cairo', sans-serif;">الموقع الرسمي</a>
        <span class="footer-link-sep" style="color:#c0ccd8; font-size:11px; margin:0 2px;" aria-hidden="true">|</span>
        <a href="{{ config('app.url') }}/privacy" class="footer-link" style="color:#415a77 !important; text-decoration:none; font-size:11px; font-weight:500; margin:0 6px; font-family:'Cairo', sans-serif;">سياسة الخصوصية</a>
        <span class="footer-link-sep" style="color:#c0ccd8; font-size:11px; margin:0 2px;" aria-hidden="true">|</span>
        <a href="{{ config('app.url') }}/contact" class="footer-link" style="color:#415a77 !important; text-decoration:none; font-size:11px; font-weight:500; margin:0 6px; font-family:'Cairo', sans-serif;">تواصل معنا</a>
    </nav>

    <p class="footer-copyright" style="font-size:10px; color:#778da9; margin:0; font-family:'Cairo', sans-serif;">
        &copy; {{ date('Y') }} منصة شفيع. جميع الحقوق محفوظة.
    </p>
    <p class="footer-disclaimer" style="font-size:10px; color:#a0aabb; margin:6px 0 0; font-family:'Cairo', sans-serif;">
        هذه رسالة آلية صادرة عن النظام — يرجى عدم الرد عليها مباشرة.
    </p>
</footer>
