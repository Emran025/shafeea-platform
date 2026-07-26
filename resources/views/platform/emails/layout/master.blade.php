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

    {{-- Google Fonts via <link> — best support in Apple Mail, iOS, Samsung Mail, Outlook.com --}}
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" type="text/css">

    @include('emails.partials.styles')
</head>
<body>
    {{-- Inbox preview text (hidden) --}}
    <div class="preheader" style="display:none !important; visibility:hidden; mso-hide:all; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">@yield('preheader', 'رسالة من منصة شفيع')</div>

    {{-- Outer wrapper table for Outlook compatibility --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eaecf0;">
        <tr>
            <td align="center">
                <div class="email-wrapper" style="width:100%; background-color:#eaecf0; padding:44px 16px; font-family:'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;">
                    <article class="email-card" style="max-width:600px; width:100%; margin:0 auto; background-color:#ffffff; border:1px solid #d4d8de; border-top:none; font-family:'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;">

                        {{-- Institutional accent bars: navy authority + teal identity --}}
                        <div class="email-accent-bar" style="height:6px; background-color:#1b263b; font-size:0; line-height:0;" aria-hidden="true">&nbsp;</div>
                        <div class="email-accent-bar--teal" style="height:3px; background-color:#00a0da; font-size:0; line-height:0;" aria-hidden="true">&nbsp;</div>

                        @include('emails.partials.header')

                        <main class="email-body" style="padding:36px 40px 40px; font-family:'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;">
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
