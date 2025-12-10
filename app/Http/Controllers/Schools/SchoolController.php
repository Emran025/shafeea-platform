<?php

namespace App\Http\Controllers\Schools;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\School\StoreSchoolRequest;
use App\Http\Requests\School\UpdateSchoolRequest;

class SchoolController extends Controller
{
    /**
     * Display a listing of schools.
     */
    public function index(Request $request)
    {
        $query = School::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%");
            });
        }

        // Filter by country
        if ($request->filled('country')) {
            $query->where('country', $request->country);
        }

        // Filter by city
        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        $schools = $query->withCount(['users', 'halaqahs'])
                        ->orderBy('created_at', 'desc')
                        ->paginate(12);

        // Get unique countries and cities for filters
        $countries = School::distinct()->pluck('country')->filter()->sort()->values();
        $cities = School::distinct()->pluck('city')->filter()->sort()->values();

        return Inertia::render('schools/index', [
            'schools' => $schools,
            'filters' => $request->only(['search', 'country', 'city']),
            'countries' => $countries,
            'cities' => $cities,
        ]);
    }

    /**
     * Show the form for creating a new school.
     */
    public function create()
    {
        return Inertia::render('schools/create');
    }

    /**
     * Store a newly created school.
     */
    public function store(StoreSchoolRequest $request)
    {
        $school = School::create($request->validated());

        return redirect()
            ->route('schools.show', $school)
            ->with('success', 'School created successfully.');
    }

    /**
     * Display the specified school.
     */
    public function show(School $school)
    {
        $school->load([
            'users' => function($query) {
                $query->with(['student', 'teacher', 'admin'])->latest();
            },
            'halaqahs' => function($query) {
                $query->with(['teacher.user', 'schedules'])
                      ->withCount('enrollments')
                      ->latest();
            }
        ]);

        // Get statistics
        $stats = [
            'total_users' => $school->users()->count(),
            'total_students' => $school->users()->whereHas('student')->count(),
            'total_teachers' => $school->users()->whereHas('teacher')->count(),
            'total_admins' => $school->users()->whereHas('admin')->count(),
            'total_halaqahs' => $school->halaqahs()->count(),
            'active_halaqahs' => $school->halaqahs()->where('is_active', true)->count(),
        ];

        return Inertia::render('schools/show', [
            'school' => $school,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for editing the specified school.
     */
    public function edit(School $school)
    {
        return Inertia::render('schools/edit', [
            'school' => $school,
        ]);
    }

    /**
     * Update the specified school.
     */
    public function update(UpdateSchoolRequest $request, School $school)
    {
        $school->update($request->validated());

        return redirect()
            ->route('schools.show', $school)
            ->with('success', 'School updated successfully.');
    }

    /**
     * Remove the specified school from storage.
     */
    public function destroy(School $school)
    {
        // Check if school has associated data
        if ($school->users()->exists() || $school->halaqahs()->exists()) {
            return back()->with('error', 'Cannot delete school with associated users or halaqahs.');
        }

        $school->delete();

        return redirect()
            ->route('schools.index')
            ->with('success', 'School deleted successfully.');
    }

    /**
     * Get school analytics data.
     */
    public function analytics(School $school)
    {
        $monthlyEnrollments = $school->halaqahs()
            ->join('enrollments', 'halaqahs.id', '=', 'enrollments.halaqah_id')
            ->selectRaw('MONTH(enrollments.created_at) as month, COUNT(*) as count')
            ->where('enrollments.created_at', '>=', now()->startOfYear())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $genderDistribution = $school->users()
            ->selectRaw('gender, COUNT(*) as count')
            ->whereNotNull('gender')
            ->groupBy('gender')
            ->get();

        $halaqahPerformance = $school->halaqahs()
            ->withCount('enrollments')
            ->with('teacher.user:id,name')
            ->get()
            ->map(function ($halaqah) {
                return [
                    'name' => $halaqah->name,
                    'teacher' => $halaqah->teacher?->user?->name,
                    'students_count' => $halaqah->enrollments_count,
                    'capacity_percentage' => $halaqah->max_students > 0 
                        ? round(($halaqah->enrollments_count / $halaqah->max_students) * 100, 1)
                        : 0,
                ];
            });

        return response()->json([
            'monthly_enrollments' => $monthlyEnrollments,
            'gender_distribution' => $genderDistribution,
            'halaqah_performance' => $halaqahPerformance,
        ]);
    }
}