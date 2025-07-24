<?php

namespace App\Repositories;

use App\Models\Halaqa;
use App\Models\Halaqah;

class HalaqahRepository
{
    public function getUpdatedSince($updatedSince, $limit = 100, $page = 1)
    {
        return Halaqah::with('students') // eager load to avoid resource error
            ->when($updatedSince, function ($query) use ($updatedSince) {
                $query->where('updated_at', '>=', $updatedSince);
            })
            ->paginate($limit, ['*'], 'page', $page);
    }
}
