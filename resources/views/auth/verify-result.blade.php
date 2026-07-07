<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $success ? 'تم التأكيد بنجاح' : 'عذراً، حدث خطأ' }} — منصة شفيع</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet">

    {{-- Presentation --}}
    <style>
        :root {
            --color-primary: #1a2332;
            --color-success: #1f5c33;
            --color-success-bg: #edf5ef;
            --color-error: #8b2e2e;
            --color-error-bg: #faf0f0;
            --color-bg: #eef0f2;
            --color-surface: #ffffff;
            --color-border: #d8dde3;
            --color-text: #2b3035;
            --color-text-muted: #5c6670;
            --color-text-subtle: #8a9299;
        }

        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            padding: 24px 16px;
            font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
            background-color: var(--color-bg);
            color: var(--color-text);
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1.6;
        }

        .page-card {
            width: 100%;
            max-width: 480px;
            background-color: var(--color-surface);
            border: 1px solid var(--color-border);
            padding: 48px 40px 40px;
            text-align: center;
        }

        .brand-mark {
            display: inline-block;
            width: 40px;
            height: 40px;
            line-height: 40px;
            margin-bottom: 28px;
            background-color: var(--color-primary);
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
        }

        .status-indicator {
            width: 56px;
            height: 56px;
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid transparent;
        }

        .status-indicator--success {
            background-color: var(--color-success-bg);
            color: var(--color-success);
            border-color: #c8dfd0;
        }

        .status-indicator--error {
            background-color: var(--color-error-bg);
            color: var(--color-error);
            border-color: #e8c8c8;
        }

        .status-indicator svg {
            width: 28px;
            height: 28px;
        }

        .page-title {
            margin: 0 0 12px;
            font-size: 22px;
            font-weight: 600;
            color: var(--color-primary);
            line-height: 1.35;
        }

        .page-message {
            margin: 0 0 32px;
            font-size: 15px;
            color: var(--color-text-muted);
            line-height: 1.75;
        }

        .page-action {
            display: block;
            width: 100%;
            padding: 13px 24px;
            background-color: var(--color-primary);
            color: #ffffff;
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
            border: 1px solid var(--color-primary);
            line-height: 1.4;
        }

        .page-action:hover {
            background-color: #141b26;
            border-color: #141b26;
        }

        .page-footer {
            margin-top: 28px;
            padding-top: 20px;
            border-top: 1px solid var(--color-border);
            font-size: 13px;
            color: var(--color-text-subtle);
        }

        @media (max-width: 480px) {
            .page-card {
                padding: 36px 24px 32px;
            }

            .page-title {
                font-size: 19px;
            }
        }
    </style>
</head>
<body>

    {{-- Structure --}}
    <main class="page-card">
        <span class="brand-mark" aria-hidden="true">ش</span>

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

        <a href="{{ config('app.frontend_url', '#') }}" class="page-action">
            {{ $success ? 'العودة إلى التطبيق' : 'حاول مرة أخرى' }}
        </a>

        <p class="page-footer">منصة شفيع — رفيقك في رحلة القرآن</p>
    </main>

</body>
</html>
