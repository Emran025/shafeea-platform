<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\ApiController;
use Illuminate\Support\Str;

class AuthController extends ApiController
{
    /**
     * POST /auth/api/v1/login
     * Simulate supervisor login and return mock token/profile.
     */
    public function login(Request $request)
    {
        return $this->success([
            'token' => Str::random(60),
            'user' => $this->mockProfile(),
        ], 'Login successful (mock)');
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
                'PhD in Islamic Studies', 'MA in Arabic Linguistics', 'BA in Quranic Sciences'
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
