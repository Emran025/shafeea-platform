{{--
    Structure: call-to-action button
    Usage:
      @include('emails.partials.cta-button', [
          'url'   => $url,
          'label' => 'النص',
          'style' => 'primary',   // primary | secondary | ghost
      ])
    Styles:
      primary   — teal fill (#00a0da), white text — confident, modern action
      secondary — white fill, navy border/text (#1b263b) — formal complement
      ghost     — white fill, steel border (#c0ccd8), steel text — subtle navigation
--}}
@php $style = $style ?? 'primary'; @endphp

<div class="cta-wrapper" style="text-align:center; margin:30px 0;">
    @if($style === 'primary')
        {{-- Outlook VML button for pixel-perfect rendering --}}
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
            href="{{ $url }}"
            style="height:48px; v-text-anchor:middle; width:220px;"
            arcsize="0%" strokecolor="#00a0da" fillcolor="#00a0da">
            <w:anchorlock/>
            <center style="color:#ffffff; font-family:'Cairo','Segoe UI',Tahoma,Arial,sans-serif; font-size:14px; font-weight:700;">{{ $label }}</center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-->
        <a href="{{ $url }}" class="cta-button" style="display:inline-block; text-decoration:none; background-color:#00a0da; color:#ffffff !important; padding:14px 40px 15px; border:1px solid #00a0da; font-family:'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size:14px; font-weight:700; line-height:1.4; letter-spacing:0.01em;">{{ $label }}</a>
        <!--<![endif]-->

    @elseif($style === 'secondary')
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
            href="{{ $url }}"
            style="height:48px; v-text-anchor:middle; width:220px;"
            arcsize="0%" strokecolor="#1b263b" fillcolor="#ffffff">
            <w:anchorlock/>
            <center style="color:#1b263b; font-family:'Cairo','Segoe UI',Tahoma,Arial,sans-serif; font-size:14px; font-weight:700;">{{ $label }}</center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-->
        <a href="{{ $url }}" class="cta-button-secondary" style="display:inline-block; text-decoration:none; background-color:#ffffff; color:#1b263b !important; padding:14px 40px 15px; border:1px solid #1b263b; font-family:'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size:14px; font-weight:700; line-height:1.4; letter-spacing:0.01em;">{{ $label }}</a>
        <!--<![endif]-->

    @else
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
            href="{{ $url }}"
            style="height:48px; v-text-anchor:middle; width:220px;"
            arcsize="0%" strokecolor="#c0ccd8" fillcolor="#ffffff">
            <w:anchorlock/>
            <center style="color:#415a77; font-family:'Cairo','Segoe UI',Tahoma,Arial,sans-serif; font-size:14px; font-weight:700;">{{ $label }}</center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-->
        <a href="{{ $url }}" class="cta-button-ghost" style="display:inline-block; text-decoration:none; background-color:#ffffff; color:#415a77 !important; padding:14px 40px 15px; border:1px solid #c0ccd8; font-family:'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size:14px; font-weight:700; line-height:1.4; letter-spacing:0.01em;">{{ $label }}</a>
        <!--<![endif]-->
    @endif
</div>
