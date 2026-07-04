{{--
    CTA Button Partial
    Usage:
      @include('emails.partials.cta-button', ['url' => $url, 'label' => 'النص', 'style' => 'primary'])
    Styles: primary | secondary | ghost
--}}
@php $style = $style ?? 'primary'; @endphp

<div class="cta-wrapper">
    @if($style === 'primary')
        <a href="{{ $url }}" class="cta-button">{{ $label }}</a>
    @elseif($style === 'secondary')
        <a href="{{ $url }}" class="cta-button-secondary">{{ $label }}</a>
    @else
        <a href="{{ $url }}" class="cta-button-ghost">{{ $label }}</a>
    @endif
</div>
