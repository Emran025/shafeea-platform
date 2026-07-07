{{--
    Structure: key-value data table
    Expects $rows as array of ['label' => '', 'value' => ''] pairs
    All row values are rendered verbatim — no transformation applied.
--}}
<table class="data-table" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    @foreach($rows as $row)
        <tr>
            <td class="data-table__label">{{ $row['label'] }}</td>
            <td class="data-table__value">{{ $row['value'] }}</td>
        </tr>
    @endforeach
</table>
