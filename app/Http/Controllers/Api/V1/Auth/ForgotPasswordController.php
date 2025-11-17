<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\ForgotPasswordRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     *
     * @param  \App\Http\Requests\Api\V1\Auth\ForgotPasswordRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ForgotPasswordRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if ($user) {
            // TODO: UNCOMMENT WHEN EMAIL SERVICE IS READY
            // Actual email sending logic will be here
            // Password::sendResetLink($request->only('email'));

            // CURRENT: Simulate email sending (for development)
            Log::info('Password reset requested for: ' . $request->email);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'If the email exists, a reset link has been sent.'
        ]);
    }
}
