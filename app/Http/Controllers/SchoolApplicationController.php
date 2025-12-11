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
use Illuminate\Support\Facades\Storage;
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
                // 1. Handle School Logo
                $logoPath = null;
                if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
                    $logoPath = $request->file('logo')->store(
                        'schools/logos',
                        'public' // تأكد من تعريف 'public' disk في config/filesystems.php
                    );
                }

                // 2. Create School
                $school = School::create(array_merge(
                    $request->safe()->only(['name', 'phone', 'country', 'city', 'location', 'address']),
                    ['logo' => $logoPath]
                ));

                $user = User::create([
                    'name' => $request->admin_name,
                    'email' => $request->admin_email,
                    'phone' => $request->admin_phone,
                    'password' => Hash::make($request->admin_password),
                    'school_id' => $school->id,
                ]);

                if ($request->has('documents') && is_array($request->documents)) {
                    foreach ($request->documents as $doc) {
                        if (isset($doc['file']) && $doc['file'] instanceof \Illuminate\Http\UploadedFile) {
                            $filePath = $doc['file']->store(
                                'public/documents/schools/' . $school->id,
                                'public'
                            );

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
                }

                Admin::create([
                    'user_id' => $user->id,
                    'school_id' => $school->id,
                    'status' => 'pending',
                ]);
            });

            return redirect()->route('schools.apply')->with('success', 'تم تسجيل مدرستكم بنجاح! سيتم مراجعة الطلب وإشعاركم بالنتيجة.');
        } catch (\Exception $e) {
            Log::error('School application error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['admin_password', 'admin_password_confirmation'])
            ]);

            return back()->withErrors([
                'error' => 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.'
            ])->withInput();
        }
    }
}
