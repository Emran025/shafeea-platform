<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSchoolController extends Controller
{
    public function index(Request $request)
    {
        $query = School::with('admin.user')->latest();

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhereHas('admin.user', function ($userQuery) use ($searchTerm) {
                        $userQuery->where('name', 'like', "%{$searchTerm}%");
                    })
                    ->orWhere('schools.id', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->has('status') && $request->input('status') !== '' && $request->input('status') !== null) {
            $query->whereHas('admin', function ($q) use ($request) {
                $q->where('admins.status', $request->input('status'));
            });
        }

        $schools = $query->paginate(15);

        return Inertia::render('admin/schools/index', [
            'schools' => $schools,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function show(School $school)
    {
        $school->load([
            'admin.user.documents',
        ])->loadCount(['halaqahs', 'students', 'teachers']);

        return Inertia::render('admin/schools/show', [
            'school' => $school,
        ]);
    }

    public function pending()
    {
        return Inertia::render('admin/schools/pending', [
            'schools' => School::with('admin.user')->whereHas('admin', function ($query) {
                $query->where('admins.status', 'pending');
            })->latest()->get(),
        ]);
    }

    public function approve(School $school)
    {
        $school->admin->update(['status' => 'accepted']);
        return redirect()->back()->with('success', 'School approved successfully.');
    }

    public function reject(School $school)
    {
        $school->admin->update(['status' => 'rejected']);
        return redirect()->back()->with('success', 'School rejected successfully.');
    }

    public function suspend(School $school)
    {
        $school->admin->update(['status' => 'suspended']);
        return redirect()->back()->with('success', 'School suspended successfully.');
    }
}
