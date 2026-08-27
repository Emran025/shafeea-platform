<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NavigationEntry extends Model
{
    use HasUuids;

    protected $table = 'navigation_entries';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'label' => 'array',
            'badge_text' => 'array',
            'is_badge_highlighted' => 'boolean',
        ];
    }

    public function navigationColumn(): BelongsTo
    {
        return $this->belongsTo(NavigationColumn::class, 'navigation_column_id');
    }
}
