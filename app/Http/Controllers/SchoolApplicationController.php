<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSchoolApplicationRequest;
use App\Models\Admin;
use App\Models\School;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SchoolApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('schools/apply');
    }

    public function store(StoreSchoolApplicationRequest $request)
    {
        DB::transaction(function () use ($request) {
            $school = School::create($request->safe()->only(['name', 'logo', 'phone', 'country', 'city', 'location', 'address']));

            $user = User::create([
                'name' => $request->admin_name,
                'email' => $request->admin_email,
                'phone' => $request->admin_phone,
                'password' => Hash::make($request->admin_password),
                'school_id' => $school->id,
            ]);

            Admin::create([
                'user_id' => $user->id,
                'status' => 'pending',
            ]);
        });

        return redirect()->route('schools.apply')->with('success', 'تم تسجيل مدرستكم بنجاح!');
    }
}
