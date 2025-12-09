<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeacherApplicationRequest;
use App\Models\Applicant;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TeacherApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('teachers/apply');
    }

    public function store(StoreTeacherApplicationRequest $request)
    {
        DB::transaction(function () use ($request) {
            $teacherName = $request->name;
            $qualificationsPath = $request->file('qualifications')->store("teachers/{$teacherName}/qualifications");
            $intentStatementPath = $request->file('intent_statement')->store("teachers/{$teacherName}/intent_statements");

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            Applicant::create([
                'user_id' => $user->id,
                'application_type' => 'teacher',
                'bio' => $request->bio,
                'qualifications' => $qualificationsPath,
                'intent_statement' => $intentStatementPath,
                'memorization_level' => $request->memorization_level,
                'submitted_at' => now(),
            ]);
        });

        return redirect()->route('teachers.apply')->with('success', 'تم تقديم طلبك بنجاح!');
    }
}
