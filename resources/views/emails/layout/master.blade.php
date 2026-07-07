<!DOCTYPE html>
<html lang="ar" dir="rtl" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>@yield('email-title', 'منصة شفيع')</title>
    @include('emails.partials.styles')
</head>
<body>
    <div class="preheader">@yield('preheader', 'رسالة من منصة شفيع')</div>
    <div class="email-wrapper">
        <div class="email-card">
            @include('emails.partials.header')
            <div class="email-body">
                @yield('content')
            </div>
            @include('emails.partials.footer')
        </div>
    </div>
</body>
</html>
