<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class NavigationGroup extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'navigation_groups';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'label'     => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function columns(): HasMany
    {
        return $this->hasMany(NavigationColumn::class, 'navigation_group_id')->orderBy('position');
    }
}
