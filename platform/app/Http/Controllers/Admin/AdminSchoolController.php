<?php

namespace App\Http\Controllers\Admin;

use App\Events\SchoolApprovedEvent;
use App\Events\SchoolRejectedEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\School\StoreSchoolApplicationRequest;
use App\Models\Auth\Admin;
use App\Models\Content\Document;
use App\Models\School\School;
use App\Models\Auth\User;
use App\Services\Build\GitHubDispatchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminSchoolController extends Controller
{
    public function __construct(private GitHubDispatchService $githubDispatch) {}

    public function index(Request $request)
    {
        $query = School::with('admin.user')
            ->whereHas('admin', function ($q) {
                $q->where('admins.super_admin', false);
            })
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
            'accepted' => $query->clone()->whereHas('admin', fn($q) => $q->where('admins.status', 'accepted'))->count(),
            'pending' => $query->clone()->whereHas('admin', fn($q) => $q->where('admins.status', 'pending'))->count(),
            'rejected' => $query->clone()->whereHas('admin', fn($q) => $q->where('admins.status', 'rejected'))->count(),
            'suspended' => $query->clone()->whereHas('admin', fn($q) => $q->where('admins.status', 'suspended'))->count(),
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
                    $request->safe()->only(['name', 'school_code', 'phone', 'country', 'city', 'location', 'address']),
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
                                'documents/schools/' . $school->id,
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
                $platformAdminRole = \App\Models\Auth\Role::where("name", "platform.admin")->first();
                if ($platformAdminRole) {
                    $user->roles()->attach($platformAdminRole->id);
                }
                \Illuminate\Support\Facades\DB::table("school_site_scopes")->insert(["school_id" => $school->id, "site_scope" => $school->school_code, "created_at" => now(), "updated_at" => now()]);
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
        $validated = $request->validate([
            'name'     => 'required|string|max:255|unique:schools,name,' . $school->id,
            'phone'    => 'required|string|max:20',
            'country'  => 'required|string|max:100',
            'city'     => 'required|string|max:100',
            'location' => 'required|string|max:255',
            'address'  => 'required|string|max:500',
            'logo'     => 'nullable|file|image|max:5120',
        ]);

        // Handle updating Logo file
        if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
            // Delete old logo if it exists and is a relative path
            if ($school->getRawOriginal('logo') && Storage::disk('public')->exists($school->getRawOriginal('logo'))) {
                Storage::disk('public')->delete($school->getRawOriginal('logo'));
            }
            $logoPath = $request->file('logo')->store('schools/logos', 'public');
            $validated['logo'] = $logoPath;
        } else {
            // Remove logo key from update array to not overwrite with null
            unset($validated['logo']);
        }

        $school->update($validated);

        return Redirect::route('admin.schools.show', $school->id)
            ->with('success', 'تم تحديث بيانات المدرسة بنجاح.');
    }

    public function destroy(School $school)
    {
        $school->delete();

        return Redirect::route('admin.schools.index')
            ->with('success', 'تم حذف المدرسة بنجاح.');
    }

    public function approve(School $school)
    {
        // Ensure the school has a school_code before approving
        if (empty($school->school_code)) {
            return redirect()->back()->with('error', 'لا يمكن قبول المدرسة قبل تحديد رمز المدرسة (School Code).');
        }

        DB::transaction(function () use ($school) {
            // 1. Approve the admin
            $school->admin->update(['status' => 'accepted']);

            // 2. Activate the school and record approval timestamp
            $school->update([
                'is_active'   => true,
                'approved_at' => now(),
                // Generate a unique, cryptographically secure App Key (128 hex chars = 512 bits)
                // Only generated once — subsequent approvals of the same school do not overwrite it.
                'app_key'     => $school->app_key ?? Str::random(64) . bin2hex(random_bytes(16)),
            ]);
        });

        // 3. Fire the approval event (sends welcome email etc.)
        SchoolApprovedEvent::dispatch($school->fresh());

        // 4. Auto-trigger the GitHub rebuild so the school gets its APK immediately
        if (!empty(config('services.github.token'))) {
            $school->update(['build_status' => 'building']);
            $this->githubDispatch->dispatchSchoolRebuild($school);
        }

        return redirect()->back()->with('success', 'تم قبول المدرسة بنجاح وسيبدأ بناء التطبيق قريباً.');
    }

    public function reject(Request $request, School $school)
    {
        $school->admin->update(['status' => 'rejected']);

        SchoolRejectedEvent::dispatch($school, $request->input('reason'));

        return redirect()->back()->with('success', 'School rejected successfully.');
    }

    public function suspend(School $school)
    {
        $school->admin->update(['status' => 'suspended']);

        return redirect()->back()->with('success', 'School suspended successfully.');
    }
}
