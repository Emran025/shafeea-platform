<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'tag_name',
        'tag_slug',
        'description',
        'usage_count',
    ];

    /**
     * The faqs that belong to the tag.
     */
    public function faqs(): BelongsToMany
    {
        return $this->belongsToMany(Faq::class, 'faq_tag');
    }
}
