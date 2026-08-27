<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class GenderScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $user = auth()->user();
        if ($user) {
            // إذا كان المستخدم له نطاق محدد (male أو female) وليس all
            if (isset($user->gender_scope) && in_array($user->gender_scope, ['male', 'female'])) {

                // التحقق المباشر من خلال اسم الجدول
                if (in_array($model->getTable(), ['users', 'halaqahs', 'students', 'teachers'])) {
                    $builder->where('gender', $user->gender_scope);
                }
                // إذا كان النموذج مرتبطاً بمستخدم (مثل Student أو Teacher)
                elseif (method_exists($model, 'user')) {
                    $builder->whereHas('user', function ($query) use ($user) {
                        $query->where('gender', $user->gender_scope);
                    });
                }
            }
        }
    }
}
