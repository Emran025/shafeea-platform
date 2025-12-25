<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSchoolApplicationRequest;
use App\Models\Admin;
use App\Models\Document;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AdminSchoolController extends Controller
{
    public function index(Request $request)
    {
        $query = School::with('admin.user')
            ->select('schools.*')
            ->selectRaw("COALESCE((SELECT CASE WHEN admins.status = 'pending' THEN 0 ELSE 1 END FROM admins JOIN users ON admins.user_id = users.id WHERE users.school_id = schools.id LIMIT 1), 1) as admin_status_order")
            ->orderBy('admin_status_order')
            ->orderBy('schools.created_at', 'desc');

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('schools.name', 'like', "%{$searchTerm}%")
                    ->orWhere('schools.id', 'like', "%{$searchTerm}%")
                    ->orWhereHas('admin.user', function ($userQuery) use ($searchTerm) {
                        $userQuery->where('name', 'like', "%{$searchTerm}%");
                    });
            });
        }

        if ($request->has('status') && $request->input('status') !== '' && $request->input('status') !== null) {
            $query->whereHas('admin', function ($adminQuery) use ($request) {
                $adminQuery->where('admins.status', $request->input('status'));
            });
        }

        $stats = [
            'total' => $query->clone()->count(),
            'accepted' => $query->clone()->whereHas('admin', fn($q) => $q->where('status', 'accepted'))->count(),
            'pending' => $query->clone()->whereHas('admin', fn($q) => $q->where('status', 'pending'))->count(),
            'rejected' => $query->clone()->whereHas('admin', fn($q) => $q->where('status', 'rejected'))->count(),
            'suspended' => $query->clone()->whereHas('admin', fn($q) => $q->where('status', 'suspended'))->count(),
        ];

        $schools = $query->paginate(15);

        return Inertia::render('admin/schools/index', [
            'schools' => $schools,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
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

    public function create()
    {
        return Inertia::render('admin/schools/create');
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
                        'public'
                    );
                }

                // 2. Create School
                $school = School::create(array_merge(
                    $request->safe()->only(['name', 'phone', 'country', 'city', 'location', 'address']),
                    ['logo' => $logoPath]
                ));

                // 3. Create Admin User
                $user = User::create([
                    'name' => $request->admin_name,
                    'email' => $request->admin_email,
                    'phone' => $request->admin_phone,
                    'password' => Hash::make($request->admin_password),
                    'school_id' => $school->id,
                ]);

                // 4. Handle Documents
                if ($request->has('documents') && is_array($request->documents)) {
                    foreach ($request->documents as $doc) {
                        if (isset($doc['file']) && $doc['file'] instanceof \Illuminate\Http\UploadedFile) {
                            $filePath = $doc['file']->store(
                                'public/documents/schools/'.$school->id,
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

                // 5. Create Admin with 'accepted' status (unlike public apply which uses 'pending')
                Admin::create([
                    'user_id' => $user->id,
                    'status' => 'accepted',
                    'super_admin' => false,
                ]);
            });

            return Redirect::route('admin.schools.index')
                ->with('success', 'تم إنشاء المدرسة بنجاح.');
        } catch (\Exception $e) {
            return Redirect::back()
                ->withErrors(['error' => 'حدث خطأ أثناء إنشاء المدرسة. يرجى المحاولة مرة أخرى.'])
                ->withInput();
        }
    }

    public function edit(School $school)
    {
        $school->load('admin.user');
        return Inertia::render('admin/schools/edit', [
            'school' => $school,
        ]);
    }

    public function update(Request $request, School $school)
    {
        // TODO: Implement update logic
        return Redirect::route('admin.schools.index')
            ->with('success', 'تم تحديث المدرسة بنجاح.');
    }

    public function destroy(School $school)
    {
        $school->delete();
        
        return Redirect::route('admin.schools.index')
            ->with('success', 'تم حذف المدرسة بنجاح.');
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
