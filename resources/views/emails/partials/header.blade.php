{{-- Structure: institutional letterhead header --}}
<header class="email-header" style="padding:28px 40px 26px; background-color:#ffffff; border-bottom:1px solid #e0e1dd;">

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

    {{-- Document title block --}}
    <div class="header-document" style="text-align:center; padding-top:2px; font-family:'Cairo', sans-serif;">

        @hasSection('header-badge')
            <div class="header-badge-row" style="text-align:center; margin-bottom:10px;">
                <span class="header-badge" style="display:inline-block; font-size:10px; font-weight:700; color:#005f87; background-color:#ecf7fd; border:1px solid #7dc4e8; padding:3px 14px 4px; letter-spacing:0.10em; text-transform:uppercase; font-family:'Cairo', sans-serif;">@yield('header-badge')</span>
            </div>
        @endif

        <h1 class="header-title" style="color:#0d1b2a; font-size:22px; font-weight:700; margin:0 0 6px; line-height:1.3; font-family:'Cairo', sans-serif;">@yield('header-title', 'منصة شفيع')</h1>

        @hasSection('header-subtitle')
            <p class="header-subtitle" style="color:#415a77; font-size:13px; font-weight:400; margin:0; line-height:1.55; font-family:'Cairo', sans-serif;">@yield('header-subtitle')</p>
        @endif

        @hasSection('status-bar')
            @php
                $statusType = trim($__env->yieldContent('status-type', 'info'));
                $statusConfig = match($statusType) {
                    'success' => ['border' => '1px solid #7dcca0', 'bg' => '#e6f7ee', 'color' => '#0a5c35'],
                    'warning' => ['border' => '1px solid #f0c870', 'bg' => '#fef5e6', 'color' => '#7a4d0a'],
                    default   => ['border' => '1px solid #7dc4e8', 'bg' => '#ecf7fd', 'color' => '#005f87'],
                };
            @endphp
            <div class="status-bar-wrap" style="margin-top:16px; text-align:center;">
                <span class="status-badge {{ $statusType }}" @style([
                    'display' => 'inline-block',
                    'padding' => '4px 18px 5px',
                    'font-size' => '11px',
                    'font-weight' => '600',
                    'letter-spacing' => '0.05em',
                    'border' => $statusConfig['border'],
                    'background-color' => $statusConfig['bg'],
                    'color' => $statusConfig['color'],
                    'font-family' => "'Cairo', sans-serif",
                ])>
                    @yield('status-bar')
                </span>
            </div>
        @endif

    </div>
</header>
