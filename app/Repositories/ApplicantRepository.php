<?php

namespace App\Repositories;

use App\Models\Applicant;

class ApplicantRepository
{
    /**
     * --------------------------------------------------------------------------
     * PURE DATA ACCESS METHODS
     * --------------------------------------------------------------------------
     */

    public function all($filters = [], $pagination = true)
    {
        $query = Applicant::query();
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        $sortBy = $filters['sortBy'] ?? 'created_at';
        $sortOrder = $filters['sortOrder'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);
        if ($pagination) {
            $limit = $filters['limit'] ?? 10;

            return $query->paginate($limit);
        }

        return $query->get();
    }

    public function find($id)
    {
        return Applicant::findOrFail($id);
    }
}
