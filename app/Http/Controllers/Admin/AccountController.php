<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index(Request $request)
    {
        $sessions = DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->get();

        return Inertia::render('admin/account/index', [
            'sessions' => $sessions,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
        ]);

        $user->update($request->only('name', 'email'));

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($request->input('password')),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    /**
     * Placeholder for enabling two-factor authentication.
     * To be implemented later.
     */
    public function enableTwoFactor(Request $request)
    {
        // Logic for enabling 2FA will go here.
        // For now, this is a placeholder.
        return back()->with('info', 'Two-factor authentication setup is not yet implemented.');
    }

    public function terminateSession(Request $request, $sessionId)
    {
        DB::table('sessions')
            ->where('id', $sessionId)
            ->where('user_id', $request->user()->id)
            ->delete();

        return back()->with('success', 'Session terminated successfully.');
    }
}
