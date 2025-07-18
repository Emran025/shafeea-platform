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
     * Simulate supervisor login and return mock token/profile.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login' => 'required|string', // يمكن أن يكون بريد أو رقم هاتف
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation Error.',400,$validator->errors()->toArray());
        }

        $loginValue = $request->login;

        if (filter_var($loginValue, FILTER_VALIDATE_EMAIL)) {
            $loginField = 'email';
        } elseif (preg_match('/^\+?\d{7,15}$/', $loginValue)) {
            // تحقق من رقم هاتف (يمكن تعديل Regex حسب الشكل المطلوب)
            $loginField = 'phone';
        } else {
            return $this->error('The login field must be a valid email or phone number.',  422,[]);
        }

        $credentials = [
            $loginField => $loginValue,
            'password' => $request->password
        ];

        if (!Auth::attempt($credentials)) {
            return $this->error('Unauthorized. Invalid credentials.', 401,[]);
        }

        $user = User::where($loginField, $loginValue)->firstOrFail();

        $token = $user->createToken('authToken')->plainTextToken;

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
        return $this->success([
            'user' => $this->mockProfile(),
        ], 'Authenticated profile (mock)');
    }

    /**
     * POST /auth/api/v1/logout
     * Simulate token invalidation.
     */
    public function logout(Request $request)
    {
        return $this->success(null, 'Successfully logged out (mock).');
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
