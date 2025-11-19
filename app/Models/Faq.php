<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Faq extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'school_id',
        'question',
        'answer',
        'display_order',
        'view_count',
        'is_active',
        'created_by',
    ];

    /**
     * Get the category that owns the faq.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(FaqCategory::class, 'category_id');
    }

    /**
     * Get the school that the faq is associated with.
     */
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Get the user who created the faq.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * The tags that belong to the faq.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'faq_tag');
    }
}
