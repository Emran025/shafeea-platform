<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSchoolApplicationRequest;
use App\Models\School;
use Inertia\Inertia;

class SchoolApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('schools/apply');
    }

    public function store(StoreSchoolApplicationRequest $request)
    {
        School::create($request->validated());

        return redirect()->route('schools.apply')->with('success', 'تم تسجيل مدرستكم بنجاح!');
    }
}
