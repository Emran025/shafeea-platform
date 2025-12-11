<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeacherApplicationRequest;
use App\Models\Applicant;
use App\Models\Document;
use App\Models\School;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TeacherApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('teachers/apply', [
            'schools' => School::all(),
        ]);
    }

    public function store(StoreTeacherApplicationRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                ]);

                foreach ($request->documents as $doc) {
                    $filePath = $doc['file']->store('public/documents');

                    Document::create([
                        'user_id' => $user->id,
                        'name' => $doc['name'],
                        'certificate_type' => $doc['certificate_type'],
                        'certificate_type_other' => $doc['certificate_type_other'] ?? null,
                        'riwayah' => $doc['riwayah'] ?? null,
                        'issuing_place' => $doc['issuing_place'] ?? null,
                        'issuing_date' => $doc['issuing_date'] ?? null,
                        'file_path' => $filePath,
                    ]);
                }

                Applicant::create([
                    'user_id' => $user->id,
                    'school_id' => $request->school_id,
                    'application_type' => 'teacher',
                    'bio' => $request->bio,
                    'qualifications' => $request->qualifications,
                    'memorization_level' => $request->memorization_level,
                    'submitted_at' => now(),
                ]);
            });

            return redirect()->route('teachers.apply')->with('success', 'تم تقديم طلبك بنجاح!');
        } catch (\Exception $e) {
            Log::error('Teacher application error: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'An unexpected error occurred. Please try again later.']);
        }
    }
}
