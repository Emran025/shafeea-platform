{{-- ===== HEADER ===== --}}
<div class="email-header">
    <div class="header-pattern">

        @hasSection('header-badge')
        <div class="header-badge">
            <span>@yield('header-badge')</span>
        </div>
        <br>
        @endif

        {{-- Logo Mark SVG (inline for email client compatibility) --}}
        <div class="header-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
                <rect width="48" height="48" rx="12" fill="rgba(255,255,255,0.12)"/>
                <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Cairo, sans-serif" font-size="22" font-weight="800" fill="white">ش</text>
            </svg>
        </div>

        <h1 class="header-title">@yield('header-title', 'منصة شفيع')</h1>
        @hasSection('header-subtitle')
        <p class="header-subtitle">@yield('header-subtitle')</p>
        @endif

    </div>

    {{-- ===== STATUS BAR ===== --}}
    @hasSection('status-bar')
    <div class="status-bar @yield('status-type', 'neutral')">
        <span class="status-dot"></span>
        @yield('status-bar')
    </div>
    @endif
</div>
{{-- /HEADER --}}
