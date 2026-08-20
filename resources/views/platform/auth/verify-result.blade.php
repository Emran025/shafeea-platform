<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $success ? 'تم التأكيد بنجاح' : 'عذراً، حدث خطأ' }} — منصة شفيع</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --navy:        #1b263b;
            --teal:        #00a0da;
            --teal-dark:   #007aaa;
            --success:     #0a5c35;
            --success-bg:  #e6f7ee;
            --success-bd:  #7dcca0;
            --error:       #7a2020;
            --error-bg:    #fdf0f0;
            --error-bd:    #e8a8a8;
            --bg:          #eaecf0;
            --surface:     #ffffff;
            --border:      #e0e1dd;
            --text:        #0d1b2a;
            --text-muted:  #415a77;
            --text-subtle: #778da9;
        }

        *, *::before, *::after { box-sizing: border-box; }

        body {
            margin: 0;
            min-height: 100vh;
            padding: 24px 16px;
            font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1.6;
        }

        .page-card {
            width: 100%;
            max-width: 480px;
            background-color: var(--surface);
            border: 1px solid var(--border);
            border-top: none;
            overflow: hidden;
        }

        /* Brand accent bars — mirrors email design */
        .page-card::before {
            content: '';
            display: block;
            height: 6px;
            background-color: var(--navy);
        }

        .page-card::after {
            content: '';
            display: block;
            height: 3px;
            background-color: var(--teal);
            margin-top: 0;
            order: -1;
        }

        .page-card-inner {
            padding: 44px 40px 40px;
            text-align: center;
        }

        /* Logo / monogram mark */
        .brand-mark {
            display: inline-block;
            width: 54px;
            height: 54px;
            line-height: 54px;
            margin-bottom: 28px;
            background: linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%);
            color: #ffffff;
            font-size: 22px;
            font-weight: 800;
            border-radius: 8px;
        }

        .status-indicator {
            width: 60px;
            height: 60px;
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid transparent;
        }

        .status-indicator--success {
            background-color: var(--success-bg);
            color: var(--success);
            border-color: var(--success-bd);
        }

        .status-indicator--error {
            background-color: var(--error-bg);
            color: var(--error);
            border-color: var(--error-bd);
        }

        .status-indicator svg {
            width: 30px;
            height: 30px;
        }

        .page-title {
            margin: 0 0 12px;
            font-size: 22px;
            font-weight: 700;
            color: var(--navy);
            line-height: 1.35;
        }

        .page-message {
            margin: 0 0 32px;
            font-size: 15px;
            color: var(--text-muted);
            line-height: 1.75;
        }

        .page-action {
            display: block;
            width: 100%;
            padding: 14px 24px;
            background-color: var(--teal);
            color: #ffffff;
            text-decoration: none;
            font-size: 15px;
            font-weight: 700;
            border: 1px solid var(--teal);
            line-height: 1.4;
            transition: background-color 0.15s ease;
        }

        .page-action:hover {
            background-color: var(--teal-dark);
            border-color: var(--teal-dark);
        }

        .page-footer {
            margin-top: 28px;
            padding-top: 20px;
            border-top: 1px solid var(--border);
            font-size: 12px;
            color: var(--text-subtle);
        }

        @media (max-width: 480px) {
            .page-card-inner {
                padding: 32px 24px 28px;
            }
            .page-title {
                font-size: 19px;
            }
        }
    </style>
</head>
<body>
    <main class="page-card">
        {{-- Teal accent bar rendered via CSS ::after on .page-card --}}
        <div class="page-card-inner">
        {{-- Wordmark lockup: logo + organisation name --}}
            <table class="header-lockup" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%; margin-bottom:22px;">
                <tr>
                    {{-- Logo column (RTL: appears on the right / visual start) --}}
                    <td class="header-lockup__mark" style="width:60px; vertical-align:middle; padding-left:16px;">
                        <a href="{{ config('app.url') }}" style="text-decoration:none;" aria-label="منصة شفيع — الصفحة الرئيسية">
                            <!--[if mso]>
                            <img src="{{ rtrim(config('app.url'), '/') }}/logo.png" width="56" height="56" alt="منصة شفيع" style="display:block; border:0;">
                            <![endif]-->
                            <!--[if !mso]><!-->
                            <img src="{{ rtrim(config('app.url'), '/') }}/logo.png" width="56" height="56" alt="منصة شفيع" style="display:block; border:0; width:56px; height:56px;"
                                onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
                            <span class="header-lockup__mark-inner" style="display:none; width:54px; height:54px; line-height:54px; background:linear-gradient(135deg,#1b263b 0%,#00a0da 100%); color:#ffffff; font-size:22px; font-weight:800; text-align:center; border-radius:8px; font-family:'Cairo',sans-serif;">ش</span>
                            <!--<![endif]-->
                        </a>
                    </td>

                    {{-- Wordmark column --}}
                    <td class="header-lockup__text" style="vertical-align:middle; text-align:right; font-family:'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;">
                        <span class="header-lockup__name" style="display:block; font-size:17px; font-weight:700; color:#1b263b; line-height:1.3; font-family:'Cairo', sans-serif;">منصة شفيع</span>
                        <span class="header-lockup__tagline" style="display:block; font-size:11px; font-weight:500; color:#007aaa; line-height:1.4; margin-top:3px; font-family:'Cairo', sans-serif;">منصة تعليم القرآن الكريم</span>
                    </td>
                </tr>
            </table>
            {{-- Status icon --}}
            <div class="status-indicator {{ $success ? 'status-indicator--success' : 'status-indicator--error' }}" aria-hidden="true">
                @if($success)
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                @else
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                @endif
            </div>

            {{-- Content --}}
            <h1 class="page-title">{{ $title }}</h1>
            <p class="page-message">{{ $message }}</p>

            {{-- Primary action — falls back to app.url if frontend_url is unset --}}
            <a href="{{ config('app.url') }}" class="page-action">
                {{ $success ? 'العودة إلى التطبيق' : 'العودة إلى الصفحة الرئيسية' }}
            </a>

            <p class="page-footer">منصة شفيع — رفيقك في رحلة القرآن</p>
        </div>
    </main>
</body>
</html>
