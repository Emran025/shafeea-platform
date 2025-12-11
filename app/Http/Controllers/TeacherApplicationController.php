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
            'schools' => School::select('id', 'name')->get(), // فقط الحقول المطلوبة
        ]);
    }

    public function store(StoreTeacherApplicationRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                // 1. Create User
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'country' => $request->country,
                    'city' => $request->city,
                    'password' => Hash::make($request->password),
                ]);

                // 2. Create Applicant
                $applicant = Applicant::create([
                    'user_id' => $user->id,
                    'school_id' => $request->school_id,
                    'application_type' => 'teacher',
                    'bio' => $request->bio,
                    'qualifications' => $request->qualifications,
                    'memorization_level' => $request->memorization_level,
                    'status' => 'pending',
                    'submitted_at' => now(),
                ]);

                // 3. Handle Documents
                if ($request->has('documents') && is_array($request->documents)) {
                    foreach ($request->documents as $doc) {
                        if (isset($doc['file']) && $doc['file'] instanceof \Illuminate\Http\UploadedFile) {
                            $filePath = $doc['file']->store(
                                'public/documents/teachers/' . $applicant->id,
                                'public'
                            );

                            Document::create([
                                'user_id' => $user->id,
                                'applicant_id' => $applicant->id, // ربط بالمتقدم
                                'name' => $doc['name'] ?? null,
                                'certificate_type' => $doc['certificate_type'] ?? null,
                                'certificate_type_other' => $doc['certificate_type_other'] ?? null,
                                'riwayah' => $doc['riwayah'] ?? null,
                                'issuing_place' => $doc['issuing_place'] ?? null,
                                'issuing_date' => $doc['issuing_date'] ?? null,
                                'file_path' => $filePath,
                            ]);
                        }
                    }
                }

                // 4. تسجيل دخول تلقائي (اختياري)
                // Auth::login($user);
            });

            return redirect()->route('teachers.apply')
                ->with('success', 'تم تقديم طلبك بنجاح! سيتم مراجعة الطلب وإشعارك بالنتيجة عبر البريد الإلكتروني.');
        } catch (\Exception $e) {
            Log::error('Teacher application error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['password', 'password_confirmation'])
            ]);

            return back()->withErrors([
                'error' => 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.'
            ])->withInput();
        }
    }
}
