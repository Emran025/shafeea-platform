{{--
    Structure: key-value data table
    Usage:
      @include('emails.partials.components.data-table', [
          'rows' => [
              ['label' => 'الاسم',             'value' => $user->name],
              ['label' => 'البريد الإلكتروني', 'value' => $user->email, 'dir' => 'ltr'],
              ['label' => 'المواعيد',           'value' => 'الأحد<br>الاثنين', 'raw' => true],
              $condition ? ['label' => 'الجنس', 'value' => 'ذكر'] : null,
          ]
      ])
    Row options:
      - null items are automatically filtered (use for conditional rows)
      - 'dir' => 'ltr'  — adds dir="ltr" lang="en" to the value cell (for emails, URLs, phone numbers)
      - 'raw' => true   — renders value with {!! !!} instead of {{ }} (for pre-escaped HTML like <br>)
                          Only use with values you control (not raw user input).
--}}
<table class="data-table" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
    @foreach(array_filter($rows ?? []) as $row)
        @php $isLtr = !empty($row['dir']) && $row['dir'] === 'ltr'; @endphp
        <tr>
            <td class="data-table__label" style="padding:10px 0; font-size:13px; font-weight:600; color:#415a77; border-bottom:1px solid #eaecef; line-height:1.6; width:42%; vertical-align:top;">{{ $row['label'] }}</td>
            <td class="data-table__value"
                @style([
                    'padding' => '10px 0',
                    'font-size' => '13px',
                    'font-weight' => '500',
                    'color' => '#0d1b2a',
                    'border-bottom' => '1px solid #eaecef',
                    'line-height' => '1.6',
                    'text-align' => 'left',
                    'vertical-align' => 'top',
                    'direction' => $isLtr ? 'ltr' : null,
                    'unicode-bidi' => $isLtr ? 'embed' : null,
                ])
                @if($isLtr) dir="ltr" lang="en"@endif
            >@if(!empty($row['raw'])){!! $row['value'] !!}@else{{ $row['value'] }}@endif</td>
        </tr>
    @endforeach
</table>
