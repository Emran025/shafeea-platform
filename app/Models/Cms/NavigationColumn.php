<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NavigationColumn extends Model
{
    use HasUuids;

    protected $table = 'navigation_columns';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'label' => 'array',
            'featured_block' => 'array',
        ];
    }

    public function navigationGroup(): BelongsTo
    {
        return $this->belongsTo(NavigationGroup::class, 'navigation_group_id');
    }

    public function entries(): HasMany
    {
        return $this->hasMany(NavigationEntry::class, 'navigation_column_id')->orderBy('position');
    }
}
