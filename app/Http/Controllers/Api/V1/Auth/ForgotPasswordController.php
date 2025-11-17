<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\ForgotPasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ForgotPasswordRequest $request): JsonResponse
    {
        Password::sendResetLink(
            $request->only('email')
        );

        return response()->json([
            'status' => 'success',
            'message' => 'If the email exists, a reset link has been sent.'
        ]);
    }
}
