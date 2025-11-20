<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\ApiController;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserProfileResource;

class AccountController extends ApiController
{
    /**
     * GET /api/v1/account/profile
     * Get the authenticated user's profile.
     */
    public function getProfile(Request $request)
    {
        return $this->success(new UserProfileResource($request->user()), 'Profile retrieved successfully.');
    }
}
