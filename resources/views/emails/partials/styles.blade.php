{{-- Visual presentation layer — Shafeea institutional design system v2 --}}
<style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Amiri:ital@0;1&display=swap');

    /* ===================================================================
       SHAFEEA PLATFORM — INSTITUTIONAL EMAIL DESIGN SYSTEM
       Palette
         Ink         #0d1520  — primary text / structural anchors
         Navy        #14243a  — institutional authority
         Brass       #7a5c2e  — letterhead accent (restrained)
         Brass-Lt    #a07840  — secondary accent
         Steel       #4a5568  — secondary text
         Mist        #6b7a8d  — tertiary / metadata
         Rule        #d4d9e0  — separator lines
         Shell       #f0f2f5  — muted background
         Surface     #ffffff  — card surface
         Canvas      #e4e8ed  — outer background
    =================================================================== */

    /* ===== RESET ===== */
    body, table, td, a {
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
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
    }

    td {
        mso-line-height-rule: exactly;
    }

    a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
    }

    /* ===== PREHEADER ===== */
    .preheader {
        display: none !important;
        visibility: hidden;
        mso-hide: all;
        font-size: 1px;
        line-height: 1px;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
    }

    /* ===== BASE ===== */
    body {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        background-color: #e4e8ed;
        color: #0d1520;
        font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
        direction: rtl;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
    }

    /* ===== OUTER WRAPPER ===== */
    .email-wrapper {
        width: 100%;
        background-color: #e4e8ed;
        padding: 44px 16px;
    }

    /* ===== CARD CONTAINER ===== */
    .email-card {
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
        background-color: #ffffff;
        border: 1px solid #c8ced7;
        border-top: none; /* accent bar replaces top border */
    }

    /* ===== INSTITUTIONAL ACCENT BAR ===== */
    /* Three-layer accent: primary navy, brass rule, thin cap */
    .email-accent-bar {
        height: 4px;
        background-color: #14243a;
        font-size: 0;
        line-height: 0;
    }

    .email-accent-bar--brass {
        height: 2px;
        background-color: #7a5c2e;
        font-size: 0;
        line-height: 0;
    }

    /* ===== LETTERHEAD / HEADER ===== */
    .email-header {
        padding: 28px 40px 24px;
        background-color: #ffffff;
        border-bottom: 1px solid #d4d9e0;
    }

    /* Lockup: wordmark row */
    .header-lockup {
        width: 100%;
        margin-bottom: 20px;
    }

    .header-lockup__mark {
        width: 48px;
        vertical-align: middle;
        padding-left: 14px; /* RTL: space between mark and text */
    }

    .header-lockup__mark-inner {
        display: inline-block;
        width: 46px;
        height: 46px;
        line-height: 46px;
        background-color: #14243a;
        color: #ffffff;
        font-size: 20px;
        font-weight: 700;
        text-align: center;
        letter-spacing: -0.02em;
    }

    .header-lockup__text {
        vertical-align: middle;
        text-align: right;
    }

    .header-lockup__name {
        display: block;
        font-size: 17px;
        font-weight: 700;
        color: #14243a;
        line-height: 1.3;
        letter-spacing: -0.02em;
    }

    .header-lockup__tagline {
        display: block;
        font-size: 11px;
        font-weight: 500;
        color: #7a5c2e;
        line-height: 1.4;
        margin-top: 3px;
        letter-spacing: 0.04em;
    }

    /* Badge: document category label above title */
    .header-badge-row {
        text-align: center;
        margin-bottom: 10px;
    }

    .header-badge {
        display: inline-block;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #7a5c2e;
        background-color: #f7f3ec;
        border: 1px solid #ddd0bb;
        padding: 3px 12px 4px;
    }

    /* Document section: title + subtitle */
    .header-document {
        text-align: center;
        padding-top: 2px;
    }

    .header-title {
        color: #0d1520;
        font-size: 22px;
        font-weight: 700;
        margin: 0 0 6px;
        line-height: 1.3;
        letter-spacing: -0.02em;
    }

    .header-subtitle {
        color: #6b7a8d;
        font-size: 13px;
        font-weight: 400;
        margin: 0;
        line-height: 1.55;
    }

    /* Status indicator */
    .status-bar-wrap {
        margin-top: 16px;
        text-align: center;
    }

    .status-badge {
        display: inline-block;
        padding: 4px 16px 5px;
        font-size: 11px;
        font-weight: 600;
        line-height: 1.5;
        letter-spacing: 0.05em;
        border: 1px solid transparent;
    }

    .status-badge.success {
        background-color: #edf5ef;
        color: #1a4d32;
        border-color: #b8d9bd;
    }

    .status-badge.info {
        background-color: #edf2f9;
        color: #1a3d6e;
        border-color: #b8cce8;
    }

    .status-badge.warning {
        background-color: #faf4ea;
        color: #6a430e;
        border-color: #e0c99a;
    }

    /* ===== EMAIL BODY ===== */
    .email-body {
        padding: 36px 40px 40px;
    }

    /* ===== TYPOGRAPHY ===== */
    .greeting {
        font-size: 16px;
        font-weight: 600;
        color: #0d1520;
        margin: 0 0 8px;
        line-height: 1.5;
    }

    .greeting--secondary {
        font-size: 17px;
        font-weight: 700;
        color: #0d1520;
        margin: 0 0 16px;
        line-height: 1.45;
    }

    .body-text {
        font-size: 14px;
        font-weight: 400;
        color: #3a4150;
        line-height: 1.85;
        margin: 0 0 20px;
    }

    .body-text:last-child {
        margin-bottom: 0;
    }

    .section-heading {
        font-size: 11px;
        font-weight: 700;
        color: #6b7a8d;
        margin: 28px 0 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #d4d9e0;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    /* ===== RULE / SEPARATOR ===== */
    .divider {
        border: none;
        border-top: 1px solid #d4d9e0;
        margin: 32px 0;
    }

    /* ===== INFO PANELS ===== */
    .info-box {
        background-color: #f8f9fb;
        border: 1px solid #d4d9e0;
        border-right: 3px solid #14243a; /* RTL: start-side accent */
        padding: 18px 20px 16px;
        margin: 0 0 20px;
    }

    /* Semantic variants */
    .info-box--info    { border-right-color: #1e4a8a; background-color: #f4f8fd; border-color: #c4d8f0; }
    .info-box--notice  { border-right-color: #7a5c2e; background-color: #faf6f0; border-color: #ddd0bb; }
    .info-box--message { border-right-color: #1e5c38; background-color: #f3faf5; border-color: #bcd9c7; }
    .info-box--muted   { border-right-color: #8a9299; background-color: #f8f9fb; border-color: #d4d9e0; }

    .info-box-title {
        font-size: 10px;
        font-weight: 700;
        color: #14243a;
        margin: 0 0 12px;
        letter-spacing: 0.10em;
        text-transform: uppercase;
    }

    .info-box--info    .info-box-title { color: #1e4a8a; }
    .info-box--notice  .info-box-title { color: #7a5c2e; }
    .info-box--message .info-box-title { color: #1e5c38; }
    .info-box--muted   .info-box-title { color: #6b7a8d; }

    .info-box-body {
        font-size: 14px;
        color: #3a4150;
        line-height: 1.8;
        margin: 0;
    }

    .info-box-body--quote {
        font-style: italic;
        color: #4a5568;
        border-right: 2px solid #c8ced7;
        padding-right: 12px;
        margin-right: 0;
    }

    .info-box + .info-box {
        margin-top: 14px;
    }

    /* ===== DATA TABLE ===== */
    .data-table {
        width: 100%;
    }

    .data-table__label,
    .data-table__value {
        padding: 10px 0;
        font-size: 13px;
        vertical-align: top;
        border-bottom: 1px solid #e8ecf0;
        line-height: 1.6;
    }

    .data-table__label {
        width: 40%;
        font-weight: 600;
        color: #6b7a8d;
        letter-spacing: 0.01em;
    }

    .data-table__value {
        color: #0d1520;
        font-weight: 500;
        text-align: left; /* LTR: value is always end-aligned in RTL docs */
    }

    .data-table tr:first-child .data-table__label,
    .data-table tr:first-child .data-table__value {
        padding-top: 0;
    }

    .data-table tr:last-child .data-table__label,
    .data-table tr:last-child .data-table__value {
        border-bottom: none;
        padding-bottom: 0;
    }

    /* ===== STRUCTURED LISTS ===== */
    .step-list,
    .action-list {
        width: 100%;
        margin: 0 0 24px;
        border: 1px solid #d4d9e0;
        background-color: #f8f9fb;
    }

    .step-item,
    .action-item {
        padding: 11px 16px;
        font-size: 13px;
        color: #3a4150;
        line-height: 1.7;
        border-bottom: 1px solid #e8ecf0;
    }

    .step-item:last-child,
    .action-item:last-child {
        border-bottom: none;
    }

    .step-number {
        display: inline-block;
        min-width: 22px;
        color: #7a5c2e;
        font-weight: 700;
        margin-left: 6px;
        font-size: 12px;
    }

    .action-marker {
        display: inline-block;
        min-width: 12px;
        color: #6b7a8d;
        font-weight: 600;
        margin-left: 6px;
        font-size: 11px;
    }

    /* ===== CALL-TO-ACTION ===== */
    .cta-wrapper {
        text-align: center;
        margin: 28px 0;
    }

    .cta-button,
    .cta-button-secondary,
    .cta-button-ghost {
        display: inline-block;
        text-decoration: none;
        font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
        font-size: 14px;
        font-weight: 600;
        padding: 13px 36px 14px;
        line-height: 1.4;
        letter-spacing: 0.01em;
        border-width: 1px;
        border-style: solid;
    }

    .cta-button {
        background-color: #14243a;
        color: #ffffff !important;
        border-color: #14243a;
    }

    .cta-button-secondary {
        background-color: #ffffff;
        color: #14243a !important;
        border-color: #14243a;
    }

    .cta-button-ghost {
        background-color: #ffffff;
        color: #4a5568 !important;
        border-color: #c8ced7;
    }

    /* ===== SECURITY NOTICES ===== */
    .security-note {
        background-color: #faf6f0;
        border: 1px solid #ddd0bb;
        border-right: 3px solid #7a5c2e;
        padding: 14px 16px;
        font-size: 13px;
        color: #3a4150;
        line-height: 1.8;
        margin: 0 0 20px;
    }

    /* ===== INLINE INFO CARD ===== */
    .info-card {
        background-color: #f8f9fb;
        border: 1px solid #d4d9e0;
        padding: 14px 16px;
        margin: 0 0 20px;
    }

    .info-card-text {
        margin: 0;
        font-size: 13px;
        color: #6b7a8d;
        text-align: center;
        line-height: 1.75;
    }

    /* ===== FALLBACK URL ===== */
    .fallback-url-hint {
        font-size: 12px;
        color: #8a9299;
        line-height: 1.65;
        text-align: center;
        margin: 0 0 8px;
    }

    .fallback-url {
        font-family: Consolas, 'Courier New', monospace;
        font-size: 11px;
        color: #4a5568;
        word-break: break-all;
        background-color: #f8f9fb;
        padding: 10px 14px;
        border: 1px solid #d4d9e0;
        text-align: left;
        margin: 0 0 20px;
        direction: ltr;
        display: block;
        line-height: 1.7;
    }

    /* ===== FOOTER NOTE (in-body) ===== */
    .footer-note {
        font-size: 12px;
        color: #8a9299;
        line-height: 1.75;
        text-align: center;
        margin: 28px 0 0;
        border-top: 1px solid #e8ecf0;
        padding-top: 20px;
    }

    /* ===== CLOSING SIGNATURE ===== */
    .closing-signature {
        margin: 0;
        font-size: 13px;
        color: #8a9299;
        text-align: center;
        line-height: 1.9;
    }

    .closing-signature strong {
        color: #4a5568;
        font-weight: 700;
    }

    /* ===== QURANIC VERSE BLOCK ===== */
    .verse-block {
        text-align: center;
        margin: 0 0 20px;
        padding: 18px 24px;
        background-color: #f8f9fb;
        border-top: 1px solid #d4d9e0;
        border-bottom: 1px solid #d4d9e0;
    }

    .verse {
        font-family: 'Amiri', 'Traditional Arabic', 'Cairo', serif;
        font-size: 19px;
        margin: 0;
        color: #14243a;
        line-height: 1.9;
        font-weight: 400;
    }

    /* ===== BASMALA ===== */
    .greeting.basmala-line {
        font-family: 'Amiri', 'Traditional Arabic', serif;
        font-size: 16px;
        color: #7a5c2e;
        font-weight: 400;
        letter-spacing: 0.01em;
        margin-bottom: 18px;
        border-bottom: 1px solid #e8ecf0;
        padding-bottom: 14px;
    }

    /* ===== FOOTER ===== */
    .email-footer {
        padding: 0 40px 28px;
        text-align: center;
        background-color: #f0f2f5;
        border-top: 1px solid #d4d9e0;
    }

    .footer-rule {
        height: 1px;
        background-color: #c8ced7;
        margin: 0 0 20px;
        font-size: 0;
        line-height: 0;
    }

    .footer-org {
        font-size: 13px;
        font-weight: 700;
        color: #14243a;
        margin: 22px 0 3px;
        letter-spacing: 0.01em;
    }

    .footer-org-tagline {
        font-size: 10px;
        color: #8a9299;
        margin: 0 0 16px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    .footer-links {
        margin: 0 0 14px;
    }

    .footer-link {
        color: #6b7a8d !important;
        text-decoration: none;
        font-size: 11px;
        font-weight: 500;
        margin: 0 6px;
        letter-spacing: 0.01em;
    }

    .footer-link-sep {
        color: #c8ced7;
        font-size: 11px;
        margin: 0 2px;
    }

    .footer-copyright {
        font-size: 10px;
        color: #8a9299;
        margin: 0;
        letter-spacing: 0.02em;
    }

    .footer-disclaimer {
        font-size: 10px;
        color: #adb5bd;
        margin: 6px 0 0;
        letter-spacing: 0.01em;
    }

    /* ===== RESPONSIVE — MOBILE ===== */
    @media screen and (max-width: 620px) {
        .email-wrapper {
            padding: 16px 8px !important;
        }

        .email-header,
        .email-body,
        .email-footer {
            padding-right: 20px !important;
            padding-left: 20px !important;
        }

        .header-title {
            font-size: 18px !important;
        }

        .header-lockup__name {
            font-size: 15px !important;
        }

        .cta-button,
        .cta-button-secondary,
        .cta-button-ghost {
            display: block !important;
            width: 100% !important;
            box-sizing: border-box !important;
            text-align: center !important;
        }

        .data-table__label,
        .data-table__value {
            display: block;
            width: 100% !important;
        }

        .data-table__label {
            padding-bottom: 2px;
            border-bottom: none;
        }

        .data-table__value {
            padding-top: 0;
            padding-bottom: 10px;
        }
    }
</style>
