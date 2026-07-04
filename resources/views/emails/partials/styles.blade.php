<style type="text/css">
    /* ===== RESET ===== */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }

    /* ===== BASE ===== */
    body {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        background-color: #f0f2f5;
        font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
        direction: rtl;
    }

    /* ===== GOOGLE FONT IMPORT ===== */
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap');

    /* ===== WRAPPER ===== */
    .email-wrapper {
        width: 100%;
        background-color: #f0f2f5;
        padding: 40px 16px;
    }

    .email-card {
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(13, 27, 42, 0.10), 0 1px 4px rgba(13, 27, 42, 0.06);
    }

    /* ===== HEADER ===== */
    .email-header {
        background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 55%, #415a77 100%);
        padding: 0;
        text-align: center;
    }

    .header-pattern {
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        padding: 40px 32px 36px;
    }

    .header-badge {
        display: inline-block;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50px;
        padding: 6px 18px;
        margin-bottom: 20px;
    }

    .header-badge span {
        color: rgba(255, 255, 255, 0.85);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 1.5px;
        text-transform: uppercase;
    }

    .header-logo {
        margin-bottom: 16px;
        display: block;
    }

    .header-title {
        color: #ffffff;
        font-size: 24px;
        font-weight: 800;
        margin: 0 0 10px;
        line-height: 1.3;
        letter-spacing: -0.3px;
    }

    .header-subtitle {
        color: rgba(255, 255, 255, 0.72);
        font-size: 14px;
        font-weight: 400;
        margin: 0;
        line-height: 1.6;
    }

    /* ===== STATUS BAR ===== */
    .status-bar {
        padding: 14px 32px;
        text-align: center;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.3px;
    }
    .status-bar.success { background: #e8f5e9; color: #1b5e20; border-bottom: 2px solid #4caf50; }
    .status-bar.warning { background: #fff3e0; color: #e65100; border-bottom: 2px solid #ff9800; }
    .status-bar.info    { background: #e3f2fd; color: #0d47a1; border-bottom: 2px solid #2196f3; }
    .status-bar.neutral { background: #f5f5f5;  color: #424242; border-bottom: 2px solid #bdbdbd; }

    .status-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-left: 8px;
        vertical-align: middle;
    }
    .status-bar.success .status-dot { background: #4caf50; }
    .status-bar.warning .status-dot { background: #ff9800; }
    .status-bar.info .status-dot    { background: #2196f3; }
    .status-bar.neutral .status-dot { background: #9e9e9e; }

    /* ===== CONTENT AREA ===== */
    .email-body { padding: 40px 40px 32px; }

    .greeting {
        font-size: 17px;
        font-weight: 700;
        color: #0d1b2a;
        margin: 0 0 8px;
    }

    .body-text {
        font-size: 15px;
        font-weight: 400;
        color: #374151;
        line-height: 1.8;
        margin: 0 0 24px;
    }

    /* ===== INFO BOX ===== */
    .info-box {
        background: #f8fafc;
        border-radius: 10px;
        border: 1px solid #e0e1dd;
        border-right: 4px solid #1b263b;
        padding: 20px;
        margin: 0 0 28px;
    }

    .info-box-title {
        font-size: 11px;
        font-weight: 700;
        color: #778da9;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        margin: 0 0 12px;
    }

    /* ===== DIVIDER ===== */
    .divider {
        border: none;
        border-top: 1px solid #e0e1dd;
        margin: 28px 0;
    }

    /* ===== CTA BUTTON ===== */
    .cta-wrapper { text-align: center; margin: 0 0 28px; }

    .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #1b263b, #415a77);
        color: #ffffff !important;
        text-decoration: none;
        font-size: 15px;
        font-weight: 700;
        padding: 14px 36px;
        border-radius: 8px;
        letter-spacing: 0.3px;
        box-shadow: 0 4px 12px rgba(27, 38, 59, 0.35);
    }

    .cta-button-secondary {
        display: inline-block;
        background: transparent;
        color: #1b263b !important;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
        padding: 12px 30px;
        border-radius: 8px;
        border: 2px solid #1b263b;
        letter-spacing: 0.3px;
    }

    .cta-button-ghost {
        display: inline-block;
        color: #415a77 !important;
        text-decoration: none;
        font-size: 13px;
        font-weight: 600;
        padding: 8px 0;
        border-bottom: 1px solid #415a77;
    }

    /* ===== SECURITY NOTE ===== */
    .security-note {
        background: #fefce8;
        border: 1px solid #fde047;
        border-radius: 8px;
        padding: 14px 16px;
        margin: 0 0 24px;
        font-size: 13px;
        color: #713f12;
        line-height: 1.6;
    }

    /* ===== FOOTER ===== */
    .email-footer {
        background: #f8fafc;
        border-top: 1px solid #e0e1dd;
        padding: 28px 40px;
        text-align: center;
        border-radius: 0 0 16px 16px;
    }

    .footer-logo-text {
        font-size: 16px;
        font-weight: 800;
        color: #1b263b;
        letter-spacing: -0.5px;
        margin: 0 0 12px;
    }

    .footer-links { margin: 0 0 14px; }

    .footer-link {
        color: #415a77 !important;
        text-decoration: none;
        font-size: 12px;
        font-weight: 500;
        margin: 0 10px;
    }

    .footer-separator { color: #c0c4cc; }

    .footer-address {
        font-size: 12px;
        color: #9ca3af;
        line-height: 1.6;
        margin: 0 0 12px;
    }

    .footer-copyright {
        font-size: 11px;
        color: #b0b8c8;
        margin: 0;
    }

    /* ===== PREHEADER ===== */
    .preheader {
        display: none;
        font-size: 1px;
        color: #f0f2f5;
        line-height: 1px;
        max-height: 0px;
        max-width: 0px;
        opacity: 0;
        overflow: hidden;
    }

    /* ===== MOBILE ===== */
    @media screen and (max-width: 620px) {
        .email-wrapper  { padding: 20px 8px !important; }
        .email-body     { padding: 28px 20px 24px !important; }
        .email-footer   { padding: 20px !important; }
        .header-pattern { padding: 28px 20px !important; }
        .header-title   { font-size: 20px !important; }
        .cta-button, .cta-button-secondary {
            display: block !important;
            width: 100% !important;
            box-sizing: border-box !important;
            text-align: center !important;
            padding: 14px 20px !important;
        }
    }
</style>
