{{-- Structure: institutional letterhead header --}}
<header class="email-header">

    {{-- Wordmark lockup: logotype + organisation name --}}
    <table class="header-lockup" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td class="header-lockup__mark">
                <span class="header-lockup__mark-inner" aria-hidden="true">ش</span>
            </td>
            <td class="header-lockup__text">
                <span class="header-lockup__name">منصة شفيع</span>
                <span class="header-lockup__tagline">منصة تعليم القرآن الكريم</span>
            </td>
        </tr>
    </table>

    {{-- Document title block --}}
    <div class="header-document">

        @hasSection('header-badge')
            <div class="header-badge-row">
                <span class="header-badge">@yield('header-badge')</span>
            </div>
        @endhasSection

        <h1 class="header-title">@yield('header-title', 'منصة شفيع')</h1>

        @hasSection('header-subtitle')
            <p class="header-subtitle">@yield('header-subtitle')</p>
        @endhasSection

        @hasSection('status-bar')
            <div class="status-bar-wrap">
                <span class="status-badge @yield('status-type', 'info')">
                    @yield('status-bar')
                </span>
            </div>
        @endhasSection

    </div>
</header>
