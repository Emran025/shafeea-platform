<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\AdminStatus;
use App\Events\ApiLogin;
use App\Models\Applicant;
use App\Models\ApplicantRejection;
use App\Models\Student;
use App\Models\Teacher;
use App\Services\UsernameGenerator;
use App\Models\User;
use App\Services\ApplicantService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends ApiController
{
    protected $applicantService;

    public function __construct(ApplicantService $applicantService)
    {
        $this->applicantService = $applicantService;
    }

    /**
     * POST /api/v1/auth/login
     * Authenticate user, save device info, and return token/profile.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login' => 'required|string',
            'password' => 'required|string',
            'device_info' => 'required|array',
            'device_info.device_id' => 'required|string|max:255',
            'device_info.model' => 'required|string|max:100',
            'device_info.manufacturer' => 'required|string|max:100',
            'device_info.os_version' => 'required|string|max:50',
            'device_info.app_version' => 'nullable|string|max:20',
            'device_info.timezone' => 'nullable|string|max:50',
            'device_info.locale' => 'nullable|string|max:10',
            'device_info.fcm_token' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation Error.', 422, $validator->errors()->toArray());
        }

        // Normalize before lookup — usernames and emails are always stored
        // lowercase, so the match must never depend on letter casing typed
        // by the client.
        $loginValue = mb_strtolower(trim((string) $request->login));

        // Determine user identity by searching for the username across the role tables
        $student = \Illuminate\Support\Facades\DB::table('students')->where('username', $loginValue)->first();
        $teacher = \Illuminate\Support\Facades\DB::table('teachers')->where('username', $loginValue)->first();
        $applicant = \Illuminate\Support\Facades\DB::table('applicants')->where('username', $loginValue)->first();

        $userId = null;
        $role = 'user';

        if ($student) {
            $userId = $student->user_id;
            $role = 'student';
        } elseif ($teacher) {
            $userId = $teacher->user_id;
            $role = 'teacher';
        } elseif ($applicant) {
            $userId = $applicant->user_id;
            $role = 'applicant';
        }

        // If not found by username, fallback to checking email for admin/legacy login
        if (!$userId && filter_var($loginValue, FILTER_VALIDATE_EMAIL)) {
            $fallbackUser = User::where('email', $loginValue)->first();
            if ($fallbackUser) {
                $userId = $fallbackUser->id;
                $role = $fallbackUser->admin ? 'admin' : 'user';
            }
        }

        if (!$userId) {
            return $this->error('Unauthorized. Invalid credentials.', 401, []);
        }

        $user = User::find($userId);

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->error('Unauthorized. Invalid credentials.', 401, []);
        }

        if ($user->admin && $user->admin->status !== AdminStatus::ACCEPTED) {
            return $this->error('Your account is not active.', 403);
        }

        $deviceInfo = $request->input('device_info');

        $token = $user->createToken($deviceInfo['device_id'])->plainTextToken;

        event(new ApiLogin($user, $request));

        return $this->success([
            'token' => $token,
            'user'  => $this->buildUserPayload($user, $role),
            'role' => $role,
        ], 'Login successful.');
    }

    /**
     * POST /api/v1/auth/register
     * Register a new user, save device info, and return token/profile.
     */
    public function register(Request $request)
    {
        // Normalize before validation so the uniqueness checks (email and
        // username) run against the same lowercase form that gets stored.
        $request->merge(array_filter([
            'email' => $request->has('email') ? mb_strtolower(trim((string) $request->input('email'))) : null,
            'username' => $request->has('username') ? mb_strtolower(trim((string) $request->input('username'))) : null,
        ], fn($value) => $value !== null));

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'username' => ['required', 'string', 'max:255', new \App\Rules\UniqueUsername],
            'bio' => 'required|string',
            'qualifications' => 'required|string',
            'school_id' => 'nullable|exists:schools,id',
            'memorization_level' => 'sometimes|integer|between:-604,604',
            'avatar' => 'nullable|string',
            'phone' => 'nullable|string',
            'phone_zone' => 'nullable|string',
            'whatsapp' => 'nullable|string',
            'whatsapp_zone' => 'nullable|string',
            'gender' => 'nullable|in:Male,Female',
            'birth_date' => 'nullable|date',
            'country' => 'nullable|string',
            'city' => 'nullable|string',
            'residence' => 'nullable|string',
            'device_info' => 'required|array',
            'device_info.device_id' => 'required|string|max:255',
            'device_info.model' => 'required|string|max:100',
            'device_info.manufacturer' => 'required|string|max:100',
            'device_info.os_version' => 'required|string|max:50',
            'device_info.app_version' => 'nullable|string|max:20',
            'device_info.timezone' => 'nullable|string|max:50',
            'device_info.locale' => 'nullable|string|max:10',
            'device_info.fcm_token' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation Error.', 422, $validator->errors()->toArray());
        }

        $applicant = $this->applicantService->createStudentApplication($request->all());
        $user = $applicant->user;

        $deviceInfo = $request->input('device_info');

        $token = $user->createToken($deviceInfo['device_id'])->plainTextToken;

        event(new ApiLogin($user, $request));

        return $this->success([
            'token' => $token,
            'user'  => $this->buildUserPayload($user, 'applicant'),
            'role' => 'applicant',
        ], 'Application submitted successfully');
    }

    /**
     * POST /api/v1/auth/refresh
     * Return a new mock token and expiration time.
     */
    public function refresh(Request $request)
    {
        return $this->success([
            'token' => Str::random(60),
            'expiresAt' => now()->addHours(2)->toIso8601String(),
        ], 'Token refreshed (mock)');
    }

    /**
     * GET /api/v1/auth/me
     * Return the current supervisor profile (mock).
     */
    public function me(Request $request)
    {
        $user = $request->user();

        $role = $this->resolveUserRole($user);

        return $this->success([
            'user'  => $this->buildUserPayload($user, $role),
            'role'  => $role,
        ], 'Authenticated profile retrieved successfully.');
    }

    /**
     * POST /api/v1/auth/logout
     * Invalidate the current user's token.
     */
    public function logout(Request $request)
    {
        // This should perform a REAL logout
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Successfully logged out');
    }

    /**
     * GET /api/v1/auth/applicant-status
     * Check the current authenticated user's applicant status.
     * Returns applicant record, whether it was moved to students table,
     * and any rejection reason if present.
     */
    public function applicantStatus(Request $request)
    {
        $user = $request->user();

        // First, check if the user already exists as a Student (migrated without an applicant record)
        $student = Student::where('user_id', $user->id)->first();
        if ($student) {
            return $this->success([
                'exists' => true,
                'role' => 'student',
                'status' => 'approved',
                'movedToStudentsTable' => true,
                'rejection' => null,
            ], 'User is an active student.');
        }

        // Then check if there's an applicant record
        $applicant = Applicant::where('user_id', $user->id)->first();

        if (! $applicant) {
            return $this->success([
                'exists' => false,
                'role' => 'Undifind',
                'status' => 'Undifind',
                'movedToStudentsTable' => true,
                'rejection' => null,
            ], 'No application or student record found for this user.');
        }

        // Since we didn't find a student above, movedToStudent is false
        $movedToStudent = false;

        // Find latest explicit rejection entry if any
        $rejectionRecord = ApplicantRejection::where('applicant_id', $applicant->id)->latest()->first();

        $rejection = null;
        if ($rejectionRecord) {
            $rejection = [
                'reason' => $rejectionRecord->reason,
                'school_id' => $rejectionRecord->school_id,
            ];
        } elseif (! empty($applicant->rejection_reason)) {
            $rejection = [
                'reason' => $applicant->rejection_reason,
                'school_id' => $applicant->school_id ?? null,
            ];
        }

        return $this->success([
            'exists' => true,
            'role' => 'applicant',
            'status' => $applicant->status,
            'movedToStudentsTable' => (bool) $movedToStudent,
            'rejection' => $rejection,
        ], 'Application status retrieved.');
    }

    /**
     * POST /api/v1/auth/forgot-password
     * Handle an incoming password reset link request.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return $this->error('The given data was invalid.', 422, $validator->errors()->toArray());
        }

        // Normalize before lookup — same reasoning as login() above.
        $loginValue = mb_strtolower(trim((string) $request->login));
        $user = null;

        // Try lookup by email first
        if (filter_var($loginValue, FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $loginValue)->first();
        }

        // If not found by email, try lookup by username across the three tables
        if (!$user) {
            $student = \Illuminate\Support\Facades\DB::table('students')->where('username', $loginValue)->first();
            $teacher = \Illuminate\Support\Facades\DB::table('teachers')->where('username', $loginValue)->first();
            $applicant = \Illuminate\Support\Facades\DB::table('applicants')->where('username', $loginValue)->first();

            $userId = null;
            if ($student) {
                $userId = $student->user_id;
            } elseif ($teacher) {
                $userId = $teacher->user_id;
            } elseif ($applicant) {
                $userId = $applicant->user_id;
            }

            if ($userId) {
                $user = User::find($userId);
            }
        }

        if ($user) {
            // Send password reset link to user's email
            // We use the standard Laravel broker to send the reset link
            $status = Password::broker()->sendResetLink(['email' => $user->email]);

            if ($status === Password::RESET_LINK_SENT) {
                Log::info('Password reset link sent to: ' . $user->email);
                return $this->success(null, 'If the email or username exists, a reset link has been sent.');
            }

            return $this->error('Unable to send password reset link.', 500);
        }

        return $this->success(null, 'If the email or username exists, a reset link has been sent.');
    }

    /**
     * Return a username suggestion derived from the given name.
     *
     * This endpoint is intentionally public and read-only. The returned value
     * is a sanitized base candidate (stages 1-3 of the generator pipeline only)
     * and is NOT guaranteed to be unique — uniqueness is still enforced
     * server-side when the form is actually submitted.
     *
     * GET /username/suggest?name=محمد+علي
     *
     * @return JsonResponse { "username": "mohamed.ali" }
     */
    public function suggest(Request $request)
    {
        $name = (string) $request->query('name', '');

        $suggestion = UsernameGenerator::suggest($name);
        return $this->success([
            'username' => $suggestion,
        ], 'suggestion successful.');
    }

    /**
     * GET /api/v1/auth/email/verify/{id}/{hash}
     * Verify the user's email address via signed URL.
     */
    public function verify(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        if (! hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return response()->view('auth.verify-result', [
                'success' => false,
                'title'   => 'رابط غير صالح',
                'message' => 'عذراً، هذا الرابط غير صالح أو قد انتهت صلاحيته. يرجى طلب رابط جديد.',
            ], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->view('auth.verify-result', [
                'success' => true,
                'title'   => 'الحساب مفعل بالفعل',
                'message' => 'لقد تم تأكيد بريدك الإلكتروني مسبقاً. يمكنك المتابعة واستخدام التطبيق بشكل طبيعي.',
            ]);
        }

        $user->markEmailAsVerified();

        return response()->view('auth.verify-result', [
            'success' => true,
            'title'   => 'تم التحقق بنجاح!',
            'message' => 'تهانينا، تم تأكيد بريدك الإلكتروني بنجاح. يمكنك الآن الاستمتاع بكافة مميزات منصة شفيع.',
        ]);
    }

    /**
     * POST /api/v1/auth/email/resend
     * Resend the verification email for the authenticated user.
     */
    public function resendVerification(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $this->error('Email already verified.', 400);
        }

        $user->sendEmailVerificationNotification();

        return $this->success(null, 'Verification link sent.');
    }

    /**
     * GET /api/v1/auth/check-username
     * Check whether a username is available across students, teachers, and applicants.
     */
    public function checkUsername(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9._-]+$/i'],
        ]);

        if ($validator->fails()) {
            return $this->error('Validation Error.', 422, $validator->errors()->toArray());
        }

        $username = strtolower($request->username);
        $rule = new \App\Rules\UniqueUsername;
        $errors = [];
        $rule->validate('username', $username, function ($message) use (&$errors) {
            $errors[] = $message;
        });

        if (! empty($errors)) {
            return $this->success([
                'available' => false,
                'username' => $username,
            ], 'Username is already taken.');
        }

        return $this->success([
            'available' => true,
            'username' => $username,
        ], 'Username is available.');
    }

    /**
     * Build the authenticated user payload including username when available.
     */
    protected function buildUserPayload(User $user, ?string $role = null): array
    {
        return [
            'id'               => $user->id,
            'name'             => $user->name,
            'email'            => $user->email,
            'phone'            => $user->phone,
            'avatar'           => $user->avatar,
            'username'         => $this->resolveUsername($user, $role),
            'is_email_verified' => (bool) $user->email_verified_at,
        ];
    }

    /**
     * Resolve the username for a user based on their role record.
     */
    protected function resolveUsername(User $user, ?string $role = null): ?string
    {
        $role = $role ?? $this->resolveUserRole($user);

        return match ($role) {
            'student' => Student::where('user_id', $user->id)->value('username'),
            'teacher' => Teacher::where('user_id', $user->id)->value('username'),
            'applicant' => Applicant::where('user_id', $user->id)->value('username'),
            default => null,
        };
    }

    /**
     * Determine the primary role for an authenticated user.
     */
    protected function resolveUserRole(User $user): string
    {
        if ($user->admin) {
            return 'admin';
        }

        if (Student::where('user_id', $user->id)->exists()) {
            return 'student';
        }

        if (Teacher::where('user_id', $user->id)->exists()) {
            return 'teacher';
        }

        if (Applicant::where('user_id', $user->id)->exists()) {
            return 'applicant';
        }

        return 'user';
    }

    /**
     * Generate a random supervisor profile.
     */
    protected function mockProfile(): array
    {
        return [
            'id' => rand(1, 999),
            'status' => 'active',
            'name' => fake()->name(),
            'Avater' => base64_encode(Str::random(30)),
            'gender' => fake()->randomElement(['Male', 'Female']),
            'email' => fake()->unique()->safeEmail(),
            'phone' => '+1' . rand(1000000000, 9999999999),
            'birthDate' => fake()->date('Y-m-d', '2000-01-01'),
            'profilePictureUrl' => fake()->imageUrl(),
            'phoneZone' => '+1',
            'whatsappZone' => '+1',
            'whatsappPhone' => '+1' . rand(1000000000, 9999999999),
            'qualification' => fake()->randomElement([
                'PhD in Islamic Studies',
                'MA in Arabic Linguistics',
                'BA in Quranic Sciences',
            ]),
            'experienceYears' => rand(1, 20),
            'country' => fake()->country(),
            'residence' => fake()->city(),
            'city' => fake()->city(),
            'availableTime' => fake()->time('H:i:s'),
            'stopReasons' => null,
            'memorizationLevel' => fake()->randomElement([null, 30, 20, 10, 5]),
        ];
    }
}
