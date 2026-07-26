{{-- ═══════════════════════════════════════════════════════════════════════
     SHAFEEA PLATFORM — INSTITUTIONAL EMAIL DESIGN SYSTEM v3
     ─────────────────────────────────────────────────────────────────────
     Palette (aligned with app.css brand tokens):
       Ink       #0d1b2a  — deepest text / structural anchors
       Navy      #1b263b  — institutional primary   (app: --primary light)
       Teal      #00a0da  — brand accent             (app: --primary dark / logo)
       TealText  #007aaa  — teal on white, WCAG AA
       Steel     #415a77  — secondary text           (app: --muted-foreground)
       Mist      #778da9  — tertiary / metadata
       Rule      #e0e1dd  — separator lines          (app: --border)
       Shell     #f2f3f1  — muted background         (app: --muted)
       Ice       #ecf7fd  — teal-tinted light bg
       Surface   #ffffff  — card surface
       Canvas    #eaecf0  — outer background
═══════════════════════════════════════════════════════════════════════ --}}

{{-- Google Fonts: @import as secondary/fallback (primary <link> is in master.blade.php) --}}
<style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
</style>

<style type="text/css">

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
        background-color: #eaecf0;
        color: #0d1b2a;
        font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
        direction: rtl;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
    }

    /* ===== OUTER WRAPPER ===== */
    .email-wrapper {
        width: 100%;
        background-color: #eaecf0;
        padding: 44px 16px;
    }

    /* ===== CARD CONTAINER ===== */
    .email-card {
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
        background-color: #ffffff;
        border: 1px solid #d4d8de;
        border-top: none; /* accent bars replace the top border */
    }

    /* ===== INSTITUTIONAL ACCENT BARS ===== */
    /* Note: these elements always use inline styles in email rendering.
       The CSS rules below serve as documentation and fallback for clients
       that honour <style> tags (Apple Mail, iOS Mail, Samsung Mail). */
    .email-accent-bar       { height:6px; background-color:#1b263b; font-size:0; line-height:0; }
    .email-accent-bar--teal { height:3px; background-color:#00a0da; font-size:0; line-height:0; }

    /* ===== LETTERHEAD / HEADER ===== */
    .email-header {
        padding: 28px 40px 26px;
        background-color: #ffffff;
        border-bottom: 1px solid #e0e1dd;
    }

    /* Lockup: wordmark row */
    .header-lockup {
        width: 100%;
        margin-bottom: 22px;
    }

    .header-lockup__mark {
        width: 56px;
        vertical-align: middle;
        padding-left: 16px;
    }

    /* Text-based monogram fallback (shown when image is off/unavailable) */
    .header-lockup__mark-inner {
        display: inline-block;
        width: 54px;
        height: 54px;
        line-height: 54px;
        background: linear-gradient(135deg, #1b263b 0%, #00a0da 100%);
        color: #ffffff;
        font-size: 22px;
        font-weight: 800;
        text-align: center;
        border-radius: 8px;
    }

    .header-lockup__text {
        vertical-align: middle;
        text-align: right;
    }

    .header-lockup__name {
        display: block;
        font-size: 17px;
        font-weight: 700;
        color: #1b263b;
        line-height: 1.3;
        letter-spacing: -0.02em;
    }

    .header-lockup__tagline {
        display: block;
        font-size: 11px;
        font-weight: 500;
        color: #007aaa;
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
        color: #005f87;
        background-color: #ecf7fd;
        border: 1px solid #7dc4e8;
        padding: 3px 14px 4px;
    }

    /* Document section: title + subtitle */
    .header-document {
        text-align: center;
        padding-top: 2px;
    }

    .header-title {
        color: #0d1b2a;
        font-size: 22px;
        font-weight: 700;
        margin: 0 0 6px;
        line-height: 1.3;
        letter-spacing: -0.02em;
    }

    .header-subtitle {
        color: #415a77;
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
        padding: 4px 18px 5px;
        font-size: 11px;
        font-weight: 600;
        line-height: 1.5;
        letter-spacing: 0.05em;
        border: 1px solid transparent;
    }

    .status-badge.success {
        background-color: #e6f7ee;
        color: #0a5c35;
        border-color: #7dcca0;
    }

    .status-badge.info {
        background-color: #ecf7fd;
        color: #005f87;
        border-color: #7dc4e8;
    }

    .status-badge.warning {
        background-color: #fef5e6;
        color: #7a4d0a;
        border-color: #f0c870;
    }

    /* ===== EMAIL BODY ===== */
    .email-body {
        padding: 36px 40px 40px;
    }

    /* ===== TYPOGRAPHY ===== */
    .greeting {
        font-size: 16px;
        font-weight: 600;
        color: #0d1b2a;
        margin: 0 0 8px;
        line-height: 1.5;
    }

    .greeting--secondary {
        font-size: 17px;
        font-weight: 700;
        color: #0d1b2a;
        margin: 0 0 16px;
        line-height: 1.45;
    }

    .body-text {
        font-size: 14px;
        font-weight: 400;
        color: #2d3748;
        line-height: 1.85;
        margin: 0 0 18px;
    }

    .body-text:last-child {
        margin-bottom: 0;
    }

    /* Section heading with teal RTL-start accent bar */
    .section-heading {
        font-size: 10px;
        font-weight: 700;
        color: #007aaa;
        margin: 28px 0 12px;
        padding-bottom: 8px;
        padding-right: 10px;
        border-bottom: 1px solid #e0e1dd;
        border-right: 3px solid #00a0da;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    /* ===== RULE / SEPARATOR ===== */
    .divider {
        border: none;
        border-top: 1px solid #e0e1dd;
        margin: 32px 0;
    }

    /* ===== INFO PANELS ===== */
    .info-box {
        background-color: #f8f9fb;
        border: 1px solid #e0e1dd;
        border-right: 3px solid #1b263b; /* RTL: start-side accent */
        padding: 18px 20px 16px;
        margin: 0 0 20px;
    }

    /* Semantic variants — each rule is fully self-contained (no cascade dependency on base .info-box).
       border shorthand resets all four sides; border-right then overrides the accent bar. */
    .info-box--info    { border: 1px solid #bde3f4; border-right: 3px solid #00a0da; background-color: #f5fbff; }
    .info-box--notice  { border: 1px solid #f0d08a; border-right: 3px solid #d4880a; background-color: #fef8ee; }
    .info-box--message { border: 1px solid #8dd4ac; border-right: 3px solid #1a8c5a; background-color: #f2fbf6; }
    .info-box--muted   { border: 1px solid #e0e1dd; border-right: 3px solid #778da9; background-color: #f8f9fb; }

    .info-box-title {
        font-size: 10px;
        font-weight: 700;
        color: #1b263b;
        margin: 0 0 12px;
        letter-spacing: 0.10em;
        text-transform: uppercase;
    }

    .info-box--info    .info-box-title { color: #005f87; }
    .info-box--notice  .info-box-title { color: #7a4d0a; }
    .info-box--message .info-box-title { color: #0a5c35; }
    .info-box--muted   .info-box-title { color: #415a77; }

    .info-box-body {
        font-size: 14px;
        color: #2d3748;
        line-height: 1.8;
        margin: 0;
    }

    .info-box-body--quote {
        font-style: italic;
        color: #415a77;
        border-right: 2px solid #c0ccd8;
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
        border-bottom: 1px solid #eaecef;
        line-height: 1.6;
    }

    .data-table__label {
        width: 42%;
        font-weight: 600;
        color: #415a77;
        letter-spacing: 0.01em;
    }

    .data-table__value {
        color: #0d1b2a;
        font-weight: 500;
        text-align: left; /* RTL: value sits at the logical end (visually left) */
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
        border: 1px solid #e0e1dd;
        background-color: #f8f9fb;
        border-right: 3px solid #00a0da; /* RTL: teal start-accent */
    }

    .step-item,
    .action-item {
        padding: 11px 16px;
        font-size: 13px;
        color: #2d3748;
        line-height: 1.7;
        border-bottom: 1px solid #eaecef;
    }

    .step-item:last-child,
    .action-item:last-child {
        border-bottom: none;
    }

    .step-number {
        display: inline-block;
        min-width: 24px;
        color: #00a0da;
        font-weight: 700;
        margin-left: 6px;
        font-size: 12px;
    }

    .action-marker {
        display: inline-block;
        min-width: 12px;
        color: #007aaa;
        font-weight: 600;
        margin-left: 6px;
        font-size: 11px;
    }

    /* ===== CALL-TO-ACTION ===== */
    .cta-wrapper {
        text-align: center;
        margin: 30px 0;
    }

    .cta-button,
    .cta-button-secondary,
    .cta-button-ghost {
        display: inline-block;
        text-decoration: none;
        font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
        font-size: 14px;
        font-weight: 700;
        padding: 14px 40px 15px;
        line-height: 1.4;
        letter-spacing: 0.01em;
        border-width: 1px;
        border-style: solid;
    }

    /* Primary: brand teal — confident, modern action */
    .cta-button {
        background-color: #00a0da;
        color: #ffffff !important;
        border-color: #00a0da;
    }

    /* Secondary: navy outline — formal complement */
    .cta-button-secondary {
        background-color: #ffffff;
        color: #1b263b !important;
        border-color: #1b263b;
    }

    /* Ghost: subtle — secondary navigation */
    .cta-button-ghost {
        background-color: #ffffff;
        color: #415a77 !important;
        border-color: #c0ccd8;
    }

    /* .security-note removed — use info-box info-box--notice instead.
       The amber accent and warm background are already provided by info-box--notice. */

    /* ===== INLINE INFO CARD ===== */
    .info-card {
        background-color: #f5fbff;
        border: 1px solid #bde3f4;
        padding: 14px 16px;
        margin: 0 0 20px;
    }

    .info-card-text {
        margin: 0;
        font-size: 13px;
        color: #005f87;
        text-align: center;
        line-height: 1.75;
    }

    /* ===== FALLBACK URL ===== */
    .fallback-url-hint {
        font-size: 12px;
        color: #778da9;
        line-height: 1.65;
        text-align: center;
        margin: 0 0 8px;
    }

    .fallback-url {
        font-family: Consolas, 'Courier New', monospace;
        font-size: 11px;
        color: #415a77;
        word-break: break-all;
        background-color: #f8f9fb;
        padding: 10px 14px;
        border: 1px solid #e0e1dd;
        text-align: left;
        margin: 0 0 20px;
        direction: ltr;
        unicode-bidi: embed;
        display: block;
        line-height: 1.7;
    }

    /* ===== REFERENCE NUMBER ===== */
    .reference-line {
        font-size: 11px;
        color: #778da9;
        text-align: center;
        margin: 0 0 12px;
        letter-spacing: 0.03em;
    }

    .reference-code {
        font-family: Consolas, 'Courier New', monospace;
        font-size: 11px;
        color: #415a77;
        direction: ltr;
        unicode-bidi: embed;
        display: inline;
    }

    /* ===== FOOTER NOTE (in-body) ===== */
    .footer-note {
        font-size: 12px;
        color: #778da9;
        line-height: 1.75;
        text-align: center;
        margin: 28px 0 0;
        border-top: 1px solid #eaecef;
        padding-top: 20px;
    }

    /* ===== CLOSING SIGNATURE ===== */
    .closing-signature {
        margin: 0;
        font-size: 13px;
        color: #778da9;
        text-align: center;
        line-height: 1.9;
    }

    .closing-signature strong {
        color: #007aaa;
        font-weight: 700;
    }

    /* ===== QURANIC VERSE BLOCK ===== */
    .verse-block {
        text-align: center;
        margin: 0 0 20px;
        padding: 20px 28px;
        background-color: #f5fbff;
        border-top: 1px solid #bde3f4;
        border-bottom: 1px solid #bde3f4;
    }

    .verse {
        font-family: 'Amiri', 'Traditional Arabic', 'Cairo', serif;
        font-size: 20px;
        margin: 0;
        color: #1b263b;
        line-height: 2.0;
        font-weight: 400;
    }

    /* ===== BASMALA ===== */
    .greeting.basmala-line {
        font-family: 'Amiri', 'Traditional Arabic', serif;
        font-size: 17px;
        color: #007aaa;
        font-weight: 400;
        letter-spacing: 0.01em;
        margin-bottom: 20px;
        border-bottom: 1px solid #e0e1dd;
        padding-bottom: 16px;
        text-align: center;
    }

    /* ===== FOOTER ===== */
    .email-footer {
        padding: 0 40px 28px;
        text-align: center;
        background-color: #f2f3f1;
        border-top: 1px solid #e0e1dd;
    }

    .footer-rule {
        height: 1px;
        background-color: #d4d8de;
        margin: 0 0 20px;
        font-size: 0;
        line-height: 0;
    }

    .footer-org {
        font-size: 13px;
        font-weight: 700;
        color: #1b263b;
        margin: 22px 0 3px;
        letter-spacing: 0.01em;
    }

    .footer-org-tagline {
        font-size: 10px;
        color: #778da9;
        margin: 0 0 16px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    .footer-links {
        margin: 0 0 14px;
    }

    .footer-link {
        color: #415a77 !important;
        text-decoration: none;
        font-size: 11px;
        font-weight: 500;
        margin: 0 6px;
        letter-spacing: 0.01em;
    }

    .footer-link-sep {
        color: #c0ccd8;
        font-size: 11px;
        margin: 0 2px;
    }

    .footer-copyright {
        font-size: 10px;
        color: #778da9;
        margin: 0;
        letter-spacing: 0.02em;
    }

    .footer-disclaimer {
        font-size: 10px;
        color: #a0aabb;
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
            text-align: right !important;
        }

        .info-box {
            padding: 14px 14px !important;
        }

        .verse-block {
            padding: 14px 16px !important;
        }

        .verse {
            font-size: 17px !important;
        }

        .step-item,
        .action-item {
            padding: 10px 12px !important;
        }

        .email-header {
            padding-top: 20px !important;
            padding-bottom: 18px !important;
        }
    }
</style>
