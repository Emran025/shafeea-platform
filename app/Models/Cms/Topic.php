<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Model;
use App\Models\Auth\User;

class Topic extends Model
{
    protected $table = 'topics';

    protected $fillable = [
        'name',
        'description',
        'color',
        'articles_count',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
