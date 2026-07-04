<!DOCTYPE html>
<html lang="ar" dir="rtl" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>@yield('email-title', 'منصة شفيع')</title>

    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->

    @include('emails.partials.styles')
</head>

<body>

{{-- ===== PREHEADER (inbox preview text) ===== --}}
<div class="preheader">@yield('preheader', 'رسالة من منصة شفيع')</div>

<div class="email-wrapper">
    <div class="email-card">

        @include('emails.partials.header')

        {{-- ===== BODY ===== --}}
        <div class="email-body">
            @yield('content')
        </div>
        {{-- /BODY --}}

        @include('emails.partials.footer')

    </div>
</div>

</body>
</html>
