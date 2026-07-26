<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Per-School Search Engine Identification & Meta Tags -->
    <title>{{ $seo['title'] ?? ($school->name . ' - منصة شفيع') }}</title>
    <meta name="description" content="{{ $seo['description'] ?? 'البوابة الإلكترونية الرسمية' }}">
    <link rel="canonical" href="{{ $seo['canonical_url'] ?? url('/school/' . $school_code) }}">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Social Media Identification -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="{{ $seo['title'] ?? $school->name }}">
    <meta property="og:description" content="{{ $seo['description'] ?? '' }}">
    <meta property="og:url" content="{{ $seo['canonical_url'] ?? '' }}">
    <meta property="og:image" content="{{ $seo['og_image'] ?? asset($school->logo) }}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $seo['title'] ?? $school->name }}">
    <meta name="twitter:description" content="{{ $seo['description'] ?? '' }}">
    <meta name="twitter:image" content="{{ $seo['og_image'] ?? asset($school->logo) }}">

    <!-- Favicon per school -->
    <link rel="icon" type="image/x-icon" href="{{ url('/school/' . $school_code . '/assets/favicon.ico') }}">

    <!-- Structured JSON-LD Data for Search Engines -->
    @if(isset($seo['json_ld']))
    <script type="application/ld+json">
        {!! $seo['json_ld'] !!}
    </script>
    @endif

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap" rel="stylesheet">

    <!-- Base Styling -->
    <style>
        :root {
            --primary-color: #0d9488;
            --primary-hover: #0f766e;
            --bg-color: #0f172a;
            --card-bg: #1e293b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent: #38bdf8;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Cairo', sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .header {
            background: rgba(30, 41, 59, 0.8);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1.25rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 50;
        }

        .brand-container {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .school-logo {
            width: 52px;
            height: 52px;
            object-fit: contain;
            border-radius: 12px;
            background: #ffffff;
            padding: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .school-title-group h1 {
            font-size: 1.35rem;
            font-weight: 700;
            color: var(--text-main);
        }

        .school-code-badge {
            display: inline-block;
            background: rgba(56, 189, 248, 0.15);
            color: var(--accent);
            padding: 2px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .nav-links {
            display: flex;
            gap: 1rem;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.4rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s ease;
        }

        .btn-primary {
            background: var(--primary-color);
            color: white;
        }

        .btn-primary:hover {
            background: var(--primary-hover);
            transform: translateY(-1px);
        }

        .btn-outline {
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--text-main);
        }

        .btn-outline:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .hero {
            padding: 4rem 2rem;
            text-align: center;
            max-width: 1000px;
            margin: 0 auto;
        }

        .hero h2 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
            /* -webkit-background-clip: text; */
            -webkit-text-fill-color: transparent;
        }

        .hero p {
            font-size: 1.15rem;
            color: var(--text-muted);
            margin-bottom: 2rem;
            line-height: 1.8;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }

        .feature-card {
            background: var(--card-bg);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 1.8rem;
            transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .feature-card:hover {
            transform: translateY(-4px);
            border-color: rgba(56, 189, 248, 0.3);
        }

        .feature-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: var(--accent);
        }

        .feature-card h3 {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .feature-card p {
            color: var(--text-muted);
            font-size: 0.95rem;
            line-height: 1.6;
        }

        .footer {
            margin-top: auto;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding: 1.5rem;
            text-align: center;
            color: var(--text-muted);
            font-size: 0.9rem;
        }
    </style>
</head>

<body>

    <!-- Header Section -->
    <header class="header">
        <div class="brand-container">
            <img src="{{ url('/school/' . $school_code . '/assets/LogoWithText.svg') }}" alt="{{ $school->name }}" class="school-logo" onerror="this.src='/schools/LogoWithText.svg'">
            <div class="school-title-group">
                <h1>{{ $school->name ?? 'مدرسة شفيع المتميزة' }}</h1>
                <span class="school-code-badge">رمز المدرسة: {{ $school_code }}</span>
            </div>
        </div>

        <div class="nav-links">
            <a href="{{ url('/school/' . $school_code . '/page/dashboard') }}" class="btn btn-outline">لوحة التحكّم</a>
            <a href="{{ url('/school/' . $school_code . '/page/login') }}" class="btn btn-primary">تسجيل الدخول</a>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <h2>مرحباً بكم في البوابة الإلكترونية لـ {{ $school->name ?? 'المدرسة' }}</h2>
        <p>نظام إداري وتعليمي متكامل يقدم أحدث الحلول الرقمية متابعة الحلقات والطلاب، المعلمين، والتقارير المالية والدراسية بكل سهولة وسلاسة.</p>
        <div>
            <a href="{{ url('/school/' . $school_code . '/page/services') }}" class="btn btn-primary">استكشاف الخدمات</a>
            <a href="{{ url('/school/' . $school_code . '/sitemap.xml') }}" target="_blank" class="btn btn-outline">خريطة الموقع Sitemap</a>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-grid">
        <div class="feature-card">
            <div class="feature-icon">📚</div>
            <h3>إدارة الحلقات والدروس</h3>
            <p>متابعة جداول الحلقات القرآنية والتعليمية وتنسيق الحضور والغياب اليومي للطلاب.</p>
        </div>

        <div class="feature-card">
            <div class="feature-icon">👨‍🏫</div>
            <h3>شؤون المعلمين</h3>
            <p>إدارة الكادر التعليمي، متابعة الأداء، وتعيين المحاضرات والمهام التعليمية.</p>
        </div>

        <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>التقارير والإحصائيات</h3>
            <p>تقارير تفصيلية ولوحات بيانية مباشرة حول مستوى التقدّم والإنجازات.</p>
        </div>

        <div class="feature-card">
            <div class="feature-icon">💳</div>
            <h3>النظام المالي والاشتراكات</h3>
            <p>إدارة المدفوعات، الاشتراكات، والفواتير الخاصة بالمدرسة بكل أمان وشفافية.</p>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <p>&copy; {{ date('Y') }} {{ $school->name ?? 'منصة شفيع' }}. جميع الحقوق محفوظة | مشغّل بواسطة منصة شفيع التعليمية</p>
    </footer>

</body>

</html>