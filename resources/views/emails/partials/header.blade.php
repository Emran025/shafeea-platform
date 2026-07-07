{{-- ===== HEADER ===== --}}
<div class="email-header">
    {{-- Logo Mark SVG --}}
    <div class="header-logo">
        <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
            <rect width="48" height="48" rx="16" fill="#0f172a"/>
            <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Cairo, sans-serif" font-size="24" font-weight="900" fill="white">ش</text>
        </svg>
    </div>

    <h1 class="header-title">@yield('header-title', 'منصة شفيع')</h1>
    
    @hasSection('header-subtitle')
        <p class="header-subtitle">@yield('header-subtitle')</p>
    @endif

    @hasSection('status-bar')
        <div style="margin-top: 24px;">
            <span class="status-badge @yield('status-type', 'info')">
                @yield('status-bar')
            </span>
        </div>
    @endif
</div>
{{-- /HEADER --}}
