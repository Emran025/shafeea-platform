<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeacherApplicationRequest;
use App\Models\Applicant;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('teachers/apply');
    }

    public function store(StoreTeacherApplicationRequest $request)
    {
        Applicant::create([
            'name' => $request->name,
            'email' => $request->email,
            'application_type' => 'teacher',
            'bio' => $request->bio,
            'qualifications' => $request->qualifications,
            'intent_statement' => $request->intent_statement,
            'memorization_level' => $request->memorization_level,
            'submitted_at' => now(),
        ]);

        return redirect()->route('teachers.apply')->with('success', 'تم تقديم طلبك بنجاح!');
    }
}
