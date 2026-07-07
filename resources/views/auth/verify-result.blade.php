<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $success ? 'تم التأكيد بنجاح' : 'عذراً، حدث خطأ' }} — منصة شفيع</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #0f172a;
            --success: #10b981;
            --error: #ef4444;
            --bg: #f8fafc;
            --text: #1e293b;
            --text-light: #64748b;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Cairo', sans-serif;
            background-color: var(--bg);
            color: var(--text);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
            overflow: hidden;
        }

        .container {
            max-width: 480px;
            width: 100%;
            background: #ffffff;
            padding: 60px 40px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
            position: relative;
            z-index: 1;
            animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
            from {
                transform: translateY(30px);
                opacity: 0;
            }

            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .icon-wrapper {
            width: 100px;
            height: 100px;
            margin: 0 auto 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            position: relative;
        }

        .icon-wrapper.success {
            background-color: #ecfdf5;
            color: var(--success);
        }

        .icon-wrapper.error {
            background-color: #fef2f2;
            color: var(--error);
        }

        .icon-wrapper svg {
            width: 48px;
            height: 48px;
            animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
            animation-delay: 0.3s;
        }

        @keyframes scaleIn {
            from {
                transform: scale(0);
                opacity: 0;
            }

            to {
                transform: scale(1);
                opacity: 1;
            }
        }

        h1 {
            font-size: 28px;
            font-weight: 900;
            margin-bottom: 16px;
            color: var(--primary);
        }

        p {
            font-size: 16px;
            color: var(--text-light);
            line-height: 1.6;
            margin-bottom: 40px;
        }

        .btn {
            display: inline-block;
            background-color: var(--primary);
            color: #ffffff;
            text-decoration: none;
            padding: 18px 40px;
            border-radius: 5px;
            font-weight: 700;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15);
            width: 100%;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(15, 23, 42, 0.2);
        }

        /* Decorative elements */
        .bg-shapes {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
        }

        .shape {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.4;
        }

        .shape-1 {
            top: -10%;
            right: -5%;
            width: 400px;
            height: 400px;
            background: #dbeafe;
        }

        .shape-2 {
            bottom: -10%;
            left: -5%;
            width: 400px;
            height: 400px;
            background: #f1f5f9;
        }

        @media (max-width: 480px) {
            .container {
                padding: 40px 24px;
            }

            h1 {
                font-size: 24px;
            }
        }
    </style>
</head>

<body>
    <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
    </div>

    <div class="container">
        <div class="icon-wrapper {{ $success ? 'success' : 'error' }}">
            @if($success)
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            @else
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            @endif
        </div>

        <h1>{{ $title }}</h1>
        <p>{{ $message }}</p>

        <a href="{{ config('app.frontend_url', '#') }}" class="btn">
            {{ $success ? 'العودة إلى التطبيق' : 'حاول مرة أخرى' }}
        </a>

        <div style="margin-top: 24px; font-size: 13px; color: var(--text-light);">
            منصة شفيع — رفيقك في رحلة القرآن
        </div>
    </div>
</body>

</html>