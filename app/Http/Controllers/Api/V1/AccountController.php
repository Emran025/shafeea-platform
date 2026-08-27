<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
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

        if (! Hash::check($request->current_password, $user->password)) {
            return $this->error('The provided password does not match your current password.', 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return $this->success(null, 'Password changed successfully.');
    }

    /**
     * PUT /api/v1/account/profile
     *
     * Update the authenticated user's profile info (name, email, and role-based username).
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Normalize before validation so uniqueness checks and stored
        // values are consistent regardless of letter casing typed by the
        // client — case must never be the reason two accounts collide or
        // fail to match.
        $request->merge(array_filter([
            'email' => $request->has('email') ? mb_strtolower(trim((string) $request->input('email'))) : null,
            'username' => $request->has('username') ? mb_strtolower(trim((string) $request->input('username'))) : null,
        ], fn ($value) => $value !== null));

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'username' => ['sometimes', 'string', 'max:255', new \App\Rules\UniqueUsername($user->id)],
            'role' => ['sometimes', 'string', 'in:student,teacher,applicant'],
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed.', 422, $validator->errors());
        }

        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        $user->save();

        if ($request->has('username')) {
            $role = $request->input('role');
            if (! $role) {
                if ($user->student) {
                    $role = 'student';
                } elseif ($user->teacher) {
                    $role = 'teacher';
                } elseif ($user->applicant) {
                    $role = 'applicant';
                }
            }

            if ($role === 'student' && $user->student) {
                $user->student->update(['username' => $request->username]);
            } elseif ($role === 'teacher' && $user->teacher) {
                $user->teacher->update(['username' => $request->username]);
            } elseif ($role === 'applicant' && $user->applicant) {
                $user->applicant->update(['username' => $request->username]);
            }
        }

        return $this->success(null, 'Profile updated successfully.');
    }
}
