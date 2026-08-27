<?php

namespace App\Listeners;

use App\Events\AdminLogin;
use Illuminate\Support\Facades\DB;

class LogAdminLoginSession
{
    public function __construct() {}

    /**
     * Handle the event.
     *
     * CRITICAL: Laravel already creates a sessions row when session()->regenerate()
     * is called in AuthController::login(). We must UPDATE (not INSERT) to avoid a
     * duplicate primary key violation that silently aborts the login and causes a 302.
     */
    public function handle(AdminLogin $event)
    {
        $user = $event->user;
        $request = $event->request;
        $deviceInfo = $request->input('device_info', []);

        $payload = base64_encode(serialize([
            'type' => 'admin_login',
            'device_id' => $deviceInfo['device_id'] ?? null,
            'login_timestamp' => now()->toISOString(),
        ]));

        // UPDATE — never INSERT — because Laravel already wrote this session row.
        DB::table('sessions')
            ->where('id', session()->getId())
            ->update([
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'device_id' => $deviceInfo['device_id'] ?? null,
                'model' => $deviceInfo['model'] ?? null,
                'manufacturer' => $deviceInfo['manufacturer'] ?? null,
                'os_version' => $deviceInfo['os_version'] ?? null,
                'app_version' => $deviceInfo['app_version'] ?? null,
                'timezone' => $deviceInfo['timezone'] ?? null,
                'locale' => $deviceInfo['locale'] ?? null,
                'fcm_token' => $deviceInfo['fcm_token'] ?? null,
                'login_time' => now(),
                'payload' => $payload,
                'last_activity' => now()->timestamp,
            ]);
    }
}
