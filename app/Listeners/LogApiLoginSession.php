<?php

namespace App\Listeners;

use App\Events\ApiLogin;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;

class LogApiLoginSession
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\ApiLogin  $event
     * @return void
     */
    public function handle(ApiLogin $event)
    {
        $user = $event->user;
        $request = $event->request;
        $deviceInfo = $request->input('device_info', []);

        $payload = base64_encode(serialize([
            'type' => 'api_login',
            'device_id' => $deviceInfo['device_id'] ?? null,
            'login_timestamp' => now()->toISOString(),
            'token_created' => true
        ]));

        DB::table('sessions')->insert([
            'id' => session()->getId(),
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
