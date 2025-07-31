<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\ApiController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class AuthController extends ApiController
{
     /**
     * POST /auth/api/v1/login
     * Authenticate user, save device info, and return token/profile.
     */
    public function login(Request $request)
    {
        // =========== MODIFICATION START ===========
        // Add validation rules for device_info
        $validator = Validator::make($request->all(), [
            'login' => 'required|string',
            'password' => 'required|string',
            'device_info' => 'sometimes|array', // 'sometimes' makes it optional
            'device_info.device_id' => 'required_with:device_info|string',
            'device_info.model' => 'nullable|string',
            'device_info.manufacturer' => 'nullable|string',
            'device_info.os_version' => 'nullable|string',
            'device_info.app_version' => 'nullable|string',
            'device_info.timezone' => 'nullable|string',
            'device_info.locale' => 'nullable|string',
            'device_info.fcm_token' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation Error.', 422, $validator->errors()->toArray()); // Changed code to 422 for validation
        }
        // =========== MODIFICATION END ===========

        $loginValue = $request->login;

        if (filter_var($loginValue, FILTER_VALIDATE_EMAIL)) {
            $loginField = 'email';
        } elseif (preg_match('/^\+?\d{7,15}$/', $loginValue)) {
            $loginField = 'phone';
        } else {
            return $this->error('The login field must be a valid email or phone number.',  422, []);
        }

        $credentials = [
            $loginField => $loginValue,
            'password' => $request->password
        ];

        if (!Auth::attempt($credentials)) {
            return $this->error('Unauthorized. Invalid credentials.', 401, []);
        }

        $user = Auth::user(); // More reliable to get the authenticated user this way

        // =========== MODIFICATION START ===========
        // --- Store or update device information if provided ---
        if ($request->has('device_info')) {
            $deviceInfo = $request->input('device_info');
            
            // This will find a device with the same user_id and device_id and update it,
            // or it will create a new device entry if one doesn't exist.
            $user->devices()->updateOrCreate(
                ['device_id' => $deviceInfo['device_id']], // Attributes to find by
                $deviceInfo  // Attributes to update or create with
            );
        }

        // --- Create a new token for the user ---
        // Using device_id as the token name is good practice for traceability
        $tokenName = $request->input('device_info.device_id', 'authToken');
        $token = $user->createToken($tokenName)->plainTextToken;
        // =========== MODIFICATION END ===========
        
        // Determine user role
        if ($user->admin) {
            $role = 'admin';
        } elseif ($user->teacher) {
            $role = 'teacher';
        } elseif ($user->student) {
            $role = 'student';
        } else {
            $role = 'user';
        }

        return $this->success([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
            ],
            'role' => $role,
        ], 'Login successful.');
    }


    /**
     * POST /auth/api/v1/refresh
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
     * GET /auth/api/v1/me
     * Return the current supervisor profile (mock).
     */
    public function me(Request $request)
    {
        // This should return the ACTUAL authenticated user, not a mock one
        $user = $request->user();
        return $this->success([
            'user' => $user, // Or format it with a UserResource
        ], 'Authenticated profile retrieved successfully.');
    }

    /**
     * POST /auth/api/v1/logout
     * Invalidate the current user's token.
     */
    public function logout(Request $request)
    {
        // This should perform a REAL logout
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Successfully logged out.');
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
                'BA in Quranic Sciences'
            ]),
            'experienceYears' => rand(1, 20),
            'country' => fake()->country(),
            'residence' => fake()->city(),
            'city' => fake()->city(),
            'availableTime' => fake()->time('H:i:s'),
            'stopReasons' => null,
            'memorizationLevel' => fake()->randomElement([null, 'Full Quran', 'Half Quran', 'Selected Surahs']),
        ];
    }
}
