<?php

namespace App\Models\Cms;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;

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
