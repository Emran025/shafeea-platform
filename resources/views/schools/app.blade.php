@php
    $schoolData = [
        'name' => $school->name ?? 'منصة شفيع',
        'code' => $school_code ?? '',
        'logo' => asset($school->logo ?? 'schools/LogoWithText.svg'),
        'phone' => $school->phone ?? '',
        'country' => $school->country ?? '',
        'city' => $school->city ?? '',
        'address' => $school->address ?? ''
    ];
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $seo['title'] ?? ($school->name ?? 'منصة شفيع') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <meta name="description" content="{{ $seo['description'] ?? '' }}">
    <link rel="canonical" href="{{ $seo['canonical_url'] ?? '' }}">
    <meta property="og:title" content="{{ $seo['title'] ?? ($school->name ?? 'منصة شفيع') }}">
    <meta property="og:description" content="{{ $seo['description'] ?? '' }}">
    <meta property="og:image" content="{{ $seo['og_image'] ?? '' }}">
    @if(!empty($seo['json_ld']))
    <script type="application/ld+json">{!! $seo['json_ld'] !!}</script>
    @endif
    <meta name="school-data" content="{{ json_encode($schoolData) }}">
    <script>
        (function() {
            try {
                const theme = localStorage.getItem('school-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } catch (e) {}
        })();

        // Dynamic School Branding Object for React / JS frontend
        const metaSchoolData = document.querySelector('meta[name="school-data"]');
        window.__SCHOOL_DATA__ = metaSchoolData ? JSON.parse(metaSchoolData.getAttribute('content')) : {};
    </script>
    @viteReactRefresh
    @vite(['resources/css/schools/app.css', 'resources/js/schools/app.tsx'])
</head>

<body>
    <div id="app" data-school-code="{{ $school_code ?? '' }}"></div>
</body>

</html>