<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Response to Your Inquiry</title>
    <style type="text/css">
        /* RESET STYLES (Standard) */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        /* iOS BLUE LINKS REMOVAL */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MEDIA QUERIES */
        @media screen and (max-width: 600px) {
            .w-full {
                width: 100% !important;
            }

            .p-mobile {
                padding-left: 20px !important;
                padding-right: 20px !important;
            }

            .h-auto {
                height: auto !important;
            }
        }
    </style>

    <!-- Microsoft Outlook Specific Styles (Fixes the mso- error) -->
    <!--[if mso]>
    <style type="text/css">
        table, td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }
    </style>
    <![endif]-->
</head>

<body style="background-color: #f3f4f6; margin: 0; padding: 0;">

    <!-- PREHEADER TEXT (Visible in inbox preview) -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        We have a response to your recent inquiry regarding: {{ Str::limit($inquiry->question, 50) }}
    </div>

    <center style="width: 100%; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto;">

            <!-- HEADER / LOGO -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
                <tr>
                    <td align="center" valign="top" style="padding: 40px 0 20px 0;">
                        <!-- Replace with your actual Logo URL -->
                        <a href="{{ url('/') }}" target="_blank" style="text-decoration: none;">
                            <img src="/public/logo.png" width="150" alt="Logo" style="display: block; color: #000000; font-family: sans-serif; font-weight: bold; border: 0;">
                        </a>
                    </td>
                </tr>
            </table>

            <!-- MAIN CONTENT CARD -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden;">

                <!-- Title Section -->
                <tr>
                    <td align="left" style="padding: 40px 40px 10px 40px;" class="p-mobile">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.5px;">
                            Response to Your Inquiry
                        </h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px; color: #6b7280; line-height: 24px;">
                            Hello, regarding the question you submitted recently:
                        </p>
                    </td>
                </tr>

                <!-- The Question (Styled Box) -->
                <tr>
                    <td align="left" style="padding: 20px 40px;" class="p-mobile">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border-left: 4px solid #4f46e5; border-radius: 4px;">
                            <tr>
                                <td style="padding: 20px;">
                                    <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; font-weight: 700; color: #9ca3af; letter-spacing: 1px;">
                                        Your Question
                                    </p>
                                    <p style="margin: 0; font-size: 15px; color: #374151; font-style: italic; line-height: 22px;">
                                        "{{ $inquiry->question }}"
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- The Answer -->
                <tr>
                    <td align="left" style="padding: 0 40px 40px 40px;" class="p-mobile">
                        <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #111827;">
                            Here is our response:
                        </p>
                        <div style="font-size: 16px; color: #374151; line-height: 26px;">
                            <!-- Using nl2br to preserve line breaks -->
                            {!! nl2br(e($inquiry->answer)) !!}
                        </div>
                    </td>
                </tr>

                <!-- CTA Button (Optional) -->
                <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;" class="p-mobile">
                        <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td align="center" style="border-radius: 6px;" bgcolor="#4f46e5">
                                    <a href="{{ url('/') }}" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; border: 1px solid #4f46e5; display: inline-block; font-weight: bold;">
                                        Visit Our Website
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- FOOTER -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
                <tr>
                    <td align="center" style="padding: 30px 20px 30px 20px; color: #9ca3af; font-size: 12px; line-height: 18px;">
                        <p style="margin: 0;">
                            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                        </p>
                        <p style="margin: 10px 0 0 0;">
                            You received this email because you submitted an inquiry on our website.
                        </p>
                    </td>
                </tr>
            </table>

        </div>
    </center>
</body>

</html>