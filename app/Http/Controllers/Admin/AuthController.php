<?php

namespace App\Http\Controllers\Admin;

use App\Events\AdminLogin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('admin/login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_info' => 'required|array',
            'device_info.device_id' => 'required|string|max:255',
            'device_info.model' => 'required|string|max:100',
            'device_info.manufacturer' => 'required|string|max:100',
            'device_info.os_version' => 'required|string|max:50',
            'device_info.app_version' => 'nullable|string|max:20',
            'device_info.timezone' => 'nullable|string|max:50',
            'device_info.locale' => 'nullable|string|max:10',
            'device_info.fcm_token' => 'nullable|string|max:255',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            event(new AdminLogin(Auth::user(), $request));

            return redirect()->intended('/admin');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }
}
