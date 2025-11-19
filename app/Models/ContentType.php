<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'has_categories',
        'has_tags',
        'has_comments',
        'has_media',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'has_categories' => 'boolean',
            'has_tags' => 'boolean',
            'has_comments' => 'boolean',
            'has_media' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
