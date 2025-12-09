<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSchoolController extends Controller
{
    public function index()
    {
        // This will be the new dashboard for school approvals
        return Inertia::render('admin/schools/index', [
            'schools' => School::with('admin.user')->whereHas('admin', function ($query) {
                $query->where('status', 'pending');
            })->get(),
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
