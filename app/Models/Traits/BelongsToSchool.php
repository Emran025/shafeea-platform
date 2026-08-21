<?php
namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait BelongsToSchool
{
    protected static function bootBelongsToSchool()
    {
        static::addGlobalScope('school', function (Builder $builder) {
            if (request()->has('school_id')) {
                $builder->where($builder->getModel()->getTable() . '.school_id', request()->school_id);
            }
        });

        static::creating(function (Model $model) {
            if (empty($model->school_id) && request()->has('school_id')) {
                $model->school_id = request()->school_id;
            }
        });
    }
}
