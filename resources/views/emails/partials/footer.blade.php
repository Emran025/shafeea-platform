{{-- ===== FOOTER ===== --}}
<div class="email-footer">
    <div class="footer-links">
        <a href="{{ config('app.url') }}" class="footer-link">الموقع الرسمي</a>
        <a href="{{ config('app.url') }}/privacy" class="footer-link">سياسة الخصوصية</a>
        <a href="{{ config('app.url') }}/contact" class="footer-link">تواصل معنا</a>
    </div>
    
    <p class="footer-copyright">
        &copy; {{ date('Y') }} منصة شفيع. جميع الحقوق محفوظة.
    </p>
    <p style="font-size: 11px; color: #cbd5e1; margin-top: 8px;">
        هذه رسالة تلقائية، يرجى عدم الرد عليها.
    </p>
</div>
{{-- /FOOTER --}}
