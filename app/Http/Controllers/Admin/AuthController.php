<?php

namespace App\Http\Controllers\Admin;

use App\Events\AdminLogin;
use App\Http\Requests\Admin\LoginRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('admin/login');
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        $credentials = [
            'email' => $data['email'],
            'password' => $data['password'],
        ];

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            event(new AdminLogin(Auth::user(), $request));

            return redirect()->intended('/admin');
        }

        // Logging must never be able to break the login flow itself.
        try {
            Log::warning('Admin login failed', [
                'email' => $data['email'],
                'ip' => $request->ip(),
            ]);
        } catch (\Throwable $loggingError) {
            // Swallow — a failure to write the diagnostic log must not
            // turn a normal "wrong credentials" response into a 500.
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }
}
