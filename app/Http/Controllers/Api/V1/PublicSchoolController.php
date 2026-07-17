<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\School;
use Illuminate\Http\Request;

/**
 * Handles public (unauthenticated) school listing for the mobile apps.
 *
 * Used by the student registration screen to populate the school
 * selection dropdown.  Only the minimum data needed for display
 * and identification is returned.
 */
class PublicSchoolController extends ApiController
{
    /**
     * GET /api/v1/schools
     *
     * Returns a lightweight list of all schools (id, name, logo, city, country).
     * This endpoint is intentionally public so that applicants can choose a
     * school before they have an account.
     *
     * Query params (all optional):
     *   - search : partial match on name / city / country
     *   - country: exact match
     *   - city    : exact match
     */
    public function index(Request $request)
    {
        $query = School::query()
            ->select(['id', 'name', 'logo', 'city', 'country']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%");
            });
        }

        if ($request->filled('country')) {
            $query->where('country', $request->country);
        }

        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        $schools = $query->orderBy('name')->get();

        return $this->success($schools, 'Schools retrieved successfully.');
    }
}
