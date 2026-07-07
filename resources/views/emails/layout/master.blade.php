{{-- Structure: primary email document shell --}}
<!DOCTYPE html>
<html lang="ar" dir="rtl" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <!--[if mso]>
    <noscript>
        <xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
    </noscript>
    <![endif]-->
    <title>@yield('email-title', 'منصة شفيع')</title>
    @include('emails.partials.styles')
</head>
<body>
    {{-- Inbox preview text (hidden) --}}
    <div class="preheader">@yield('preheader', 'رسالة من منصة شفيع')</div>

    {{-- Outer wrapper table for Outlook compatibility --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#e4e8ed;">
        <tr>
            <td>
                <div class="email-wrapper">
                    <article class="email-card">
                        {{-- Institutional accent: navy bar --}}
                        <div class="email-accent-bar" aria-hidden="true">&nbsp;</div>
                        {{-- Institutional accent: brass rule --}}
                        <div class="email-accent-bar--brass" aria-hidden="true">&nbsp;</div>

                        @include('emails.partials.header')

                        <main class="email-body">
                            @yield('content')
                        </main>

                        @include('emails.partials.footer')
                    </article>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
