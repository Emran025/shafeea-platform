<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSchoolApplicationRequest;
use App\Models\Admin;
use App\Models\Document;
use App\Models\School;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SchoolApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('schools/apply');
    }

    public function store(StoreSchoolApplicationRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $schoolName = $request->name;
                $logoPath = $request->file('logo')->store("schools/{$schoolName}/logos");

                $school = School::create(array_merge($request->safe()->only(['name', 'phone', 'country', 'city', 'location', 'address']), ['logo' => $logoPath]));

                $user = User::create([
                    'name' => $request->admin_name,
                    'email' => $request->admin_email,
                    'phone' => $request->admin_phone,
                    'password' => Hash::make($request->admin_password),
                    'school_id' => $school->id,
                ]);

                if ($request->has('documents')) {
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
                }

                Admin::create([
                    'user_id' => $user->id,
                    'status' => 'pending',
                ]);
            });

            return redirect()->route('schools.apply')->with('success', 'تم تسجيل مدرستكم بنجاح!');
        } catch (\Exception $e) {
            Log::error('School application error: ' ' . $e->getMessage());

            return redirect()->back()->withErrors(['error' => 'An unexpected error occurred. Please try again later.']);
        }
    }
}
