<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Relations\Pivot;

class SectionBlock extends Pivot
{
    protected $table = 'section_block';

    // Composite PK — no auto-incrementing integer ID
    public $incrementing = false;

    protected $casts = [
        'is_required' => 'boolean',
    ];
}
