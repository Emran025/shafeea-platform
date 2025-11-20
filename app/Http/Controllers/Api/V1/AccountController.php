<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\ApiController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

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

    /**
     * POST /api/v1/account/change-password
     *
     * Change the authenticated user's password.
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)->mixedCase()->numbers()->symbols()],
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed.', 422, $validator->errors());
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return $this->error('The provided password does not match your current password.', 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return $this->success(null, 'Password changed successfully.');
    }
}
