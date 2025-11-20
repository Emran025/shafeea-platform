<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\ApiController;
use Illuminate\Support\Facades\Auth;

class AccountController extends ApiController
{
    /**
     * GET /api/v1/account/profile
     * Get the authenticated user's profile, matching the login response structure.
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();

        // Determine user role, replicating the logic from AuthController@login
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
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
            ],
            'role' => $role,
        ], 'Profile retrieved successfully.');
    }
}
