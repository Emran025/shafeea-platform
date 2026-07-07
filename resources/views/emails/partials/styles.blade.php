<style type="text/css">
    /* ===== RESET ===== */
    body,
    table,
    td,
    a {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
    }

    img {
        -ms-interpolation-mode: bicubic;
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
    }

    table {
        border-collapse: collapse !important;
    }

    a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
    }

    /* ===== BASE ===== */
    body {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        background-color: #f8fafc;
        font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
        direction: rtl;
    }

    /* ===== GOOGLE FONT IMPORT ===== */
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');

    /* ===== WRAPPER ===== */
    .email-wrapper {
        width: 100%;
        background-color: #f8fafc;
        padding: 48px 0;
    }

    .email-card {
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
        border: 1px solid rgba(226, 232, 240, 0.6);
    }

    /* ===== HEADER ===== */
    .email-header {
        background: #ffffff;
        padding: 40px 40px 20px;
        text-align: center;
    }

    .header-logo {
        margin-bottom: 24px;
        display: block;
    }

    .header-title {
        color: #0f172a;
        font-size: 26px;
        font-weight: 800;
        margin: 0 0 8px;
        line-height: 1.2;
        letter-spacing: -0.5px;
    }

    .header-subtitle {
        color: #64748b;
        font-size: 15px;
        font-weight: 400;
        margin: 0;
        line-height: 1.5;
    }

    /* ===== STATUS BAR ===== */
    .status-badge {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 32px;
    }

    .status-badge.success {
        background: #f0fdf4;
        color: #15803d;
        border: 1px solid #dcfce7;
    }

    .status-badge.info {
        background: #eff6ff;
        color: #1d4ed8;
        border: 1px solid #dbeafe;
    }

    /* ===== CONTENT AREA ===== */
    .email-body {
        padding: 0 48px 40px;
    }

    .greeting {
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 12px;
    }

    .body-text {
        font-size: 16px;
        font-weight: 400;
        color: #475569;
        line-height: 1.7;
        margin: 0 0 32px;
    }

    /* ===== INFO BOX ===== */
    .info-card {
        background: #f8fafc;
        border-radius: 5px;
        padding: 24px;
        margin: 0 0 32px;
        border: 1px solid #f1f5f9;
    }

    /* ===== CTA BUTTON ===== */
    .cta-wrapper {
        text-align: center;
        margin: 32px 0;
    }

    .cta-button {
        display: inline-block;
        background: #0f172a;
        color: #ffffff !important;
        text-decoration: none;
        font-size: 16px;
        font-weight: 700;
        padding: 16px 48px;
        border-radius: 4px;
        box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15);
        transition: all 0.3s ease;
    }

    /* ===== SECURITY NOTE ===== */
    .footer-note {
        font-size: 13px;
        color: #94a3b8;
        line-height: 1.6;
        text-align: center;
        margin: 40px 0 0;
    }

    /* ===== FOOTER ===== */
    .email-footer {
        padding: 32px 40px;
        text-align: center;
        background: #f8fafc;
        border-top: 1px solid #f1f5f9;
    }

    .footer-links {
        margin: 0 0 16px;
    }

    .footer-link {
        color: #64748b !important;
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
        margin: 0 12px;
    }

    .footer-copyright {
        font-size: 12px;
        color: #94a3b8;
        margin: 0;
    }

    /* ===== MOBILE ===== */
    @media screen and (max-width: 620px) {
        .email-wrapper {
            padding: 24px 0 !important;
        }

        .email-body {
            padding: 0 24px 32px !important;
        }

        .header-title {
            font-size: 22px !important;
        }

        .cta-button {
            display: block !important;
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 16px 24px !important;
        }
    }
</style>