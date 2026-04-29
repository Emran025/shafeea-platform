<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Document extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'certificate_type',
        'certificate_type_other',
        'riwayah',
        'issuing_place',
        'issuing_date',
        'file_path',
    ];

    /**
     * Append computed attributes to all serialized responses.
     */
    protected $appends = ['file_url'];

    /**
     * Get the full publicly accessible URL for the document file.
     * Returns null if no file has been uploaded yet.
     * 
     * Path resolution rules (same contract as School::getLogoAttribute):
     *   - null            → null  (no file uploaded)
     *   - http(s)://...   → as-is (external/CDN URL)
     *   - /...            → as-is (absolute public path)
     *   - relative path   → Storage::disk('public')->url() → /storage/...
     */
    public function getFileUrlAttribute(): ?string
    {
        $path = $this->file_path;

        if (!$path) {
            return null;
        }
        if (str_starts_with($path, 'http')) {
            return $path;
        }
        if (str_starts_with($path, '/')) {
            return $path;
        }
        return Storage::disk('public')->url($path);
    }

    /**
     * Get the user that owns the document.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
