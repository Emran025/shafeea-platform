<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SessionService
{
    public function listSessions(Request $request)
    {
        $user = $request->user();
        $currentSessionId = $request->session()->getId();

        // Get all devices for the user
        $devices = DB::table('devices')->where('user_id', $user->id)->get();

        // Base query to get sessions for the authenticated user
        $sessionsQuery = DB::table('sessions')->where('user_id', $user->id);

        // Date range filter
        if ($request->has('date_range')) {
            $range = $request->input('date_range');
            if ($range === 'last_7_days') {
                $sessionsQuery->where('last_activity', '>=', now()->subDays(7)->getTimestamp());
            } elseif ($range === 'last_30_days') {
                $sessionsQuery->where('last_activity', '>=', now()->subDays(30)->getTimestamp());
            }
        }

        // Device type filter
        if ($request->has('device_type')) {
            $deviceType = $request->input('device_type');
            if ($deviceType === 'mobile') {
                $sessionsQuery->where('user_agent', 'like', '%Mobile%');
            } elseif ($deviceType === 'desktop') {
                $sessionsQuery->where(function ($query) {
                    $query->where('user_agent', 'not like', '%Mobile%')
                          ->where('user_agent', 'not like', '%Tablet%');
                });
            } elseif ($deviceType === 'tablet') {
                $sessionsQuery->where('user_agent', 'like', '%Tablet%');
            }
        }

        $sessions = $sessionsQuery->get();

        $activeSessions = 0;
        $uniqueDevices = [];

        $formattedSessions = $sessions->map(function ($session) use ($currentSessionId, $devices, &$activeSessions, &$uniqueDevices) {
            $parsedUA = $this->parseUserAgent($session->user_agent);

            // Find a matching device. This is a best-effort fuzzy match.
            // A more reliable method would be to store a device identifier in the session.
            $matchingDevice = $devices->first(function ($device) use ($parsedUA) {
                if (isset($device->os_version) && stripos($device->os_version, $parsedUA['os']) !== false) {
                    return true;
                }
                return false;
            });

            $deviceInfo = [
                'browser' => $parsedUA['browser'],
                'os' => $parsedUA['os'],
                'platform' => $parsedUA['platform'],
                'model' => $matchingDevice ? $matchingDevice->model : null,
                'manufacturer' => $matchingDevice ? $matchingDevice->manufacturer : null,
            ];

            $lastActivity = Carbon::createFromTimestamp($session->last_activity);
            $isCurrent = $session->id === $currentSessionId;
            $status = $lastActivity->diffInMinutes(Carbon::now()) < config('session.lifetime', 120) ? 'active' : 'expired';

            if ($status === 'active') {
                $activeSessions++;
            }

            // Track unique devices
            $deviceIdentifier = $matchingDevice ? $matchingDevice->device_id : ($deviceInfo['platform'] . '-' . $deviceInfo['browser'] . '-' . $deviceInfo['os']);
            if (!in_array($deviceIdentifier, $uniqueDevices)) {
                $uniqueDevices[] = $deviceIdentifier;
            }

            return [
                'id' => $session->id,
                'device_info' => $deviceInfo,
                'ip_address' => $session->ip_address,
                'location' => 'N/A', // Geolocation is skipped for now
                'login_time' => 'N/A', // Login time is not available in the default sessions table
                'last_activity' => $lastActivity->toIso8601String(),
                'is_current' => $isCurrent,
                'status' => $status,
            ];
        });

        // Pre-filter analytics
        $totalSessions = $formattedSessions->count();
        $devicesCount = count($uniqueDevices);

        // Status filter
        if ($request->has('status')) {
            $status = $request->input('status');
            $formattedSessions = $formattedSessions->filter(function ($session) use ($status) {
                return $session['status'] === $status;
            })->values();

            // Recalculate active sessions if filtering by status
            if ($status === 'active') {
                $activeSessions = $formattedSessions->count();
            } else if ($status === 'expired') {
                $activeSessions = 0;
            }
        }

        return [
            'status' => 'success',
            'data' => [
                'sessions' => $formattedSessions,
                'analytics' => [
                    'total_sessions' => $totalSessions,
                    'active_sessions' => $activeSessions,
                    'devices_count' => $devicesCount,
                ],
            ],
        ];
    }

    /**
     * Parse the user agent string to get device information.
     *
     * @param  string  $userAgent
     * @return array
     */
    private function parseUserAgent($userAgent)
    {
        $deviceType = 'desktop';
        $browser = 'Unknown';
        $os = 'Unknown';

        // Basic device detection
        if (strpos($userAgent, 'Mobile') !== false) {
            $deviceType = 'mobile';
        } elseif (strpos($userAgent, 'Tablet') !== false) {
            $deviceType = 'tablet';
        }

        // Basic browser detection
        if (strpos($userAgent, 'Chrome') !== false && strpos($userAgent, 'Edg') === false) {
            $browser = 'Chrome';
        } elseif (strpos($userAgent, 'Firefox') !== false) {
            $browser = 'Firefox';
        } elseif (strpos($userAgent, 'Safari') !== false && strpos($userAgent, 'Chrome') === false) {
            $browser = 'Safari';
        } elseif (strpos($userAgent, 'Edg') !== false) {
            $browser = 'Edge';
        }

        // Basic OS detection
        if (preg_match('/windows nt 10/i', $userAgent)) {
            $os = 'Windows 10';
        } elseif (preg_match('/mac os x/i', $userAgent)) {
            $os = 'macOS';
        } elseif (preg_match('/android/i', $userAgent)) {
            $os = 'Android';
        } elseif (preg_match('/iphone/i', $userAgent)) {
            $os = 'iOS';
        } elseif (preg_match('/linux/i', $userAgent)) {
            $os = 'Linux';
        }

        return [
            'platform' => $deviceType,
            'browser' => $browser,
            'os' => $os,
        ];
    }

    /**
     * Terminate a specific session.
     *
     * @param  string  $sessionId
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    public function terminateSession($sessionId, Request $request)
    {
        $user = $request->user();
        $session = DB::table('sessions')->where('id', $sessionId)->first();

        // Ensure the session belongs to the authenticated user and is not the current session
        if ($session && $session->user_id == $user->id && $session->id !== $request->session()->getId()) {
            DB::table('sessions')->where('id', $sessionId)->delete();
            return true;
        }

        return false;
    }

    /**
     * Terminate all other sessions for the current user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return int
     */
    public function terminateAllOtherSessions(Request $request)
    {
        $user = $request->user();
        $currentSessionId = $request->session()->getId();

        return DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', '!=', $currentSessionId)
            ->delete();
    }

    /**
     * Refresh the current session token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function refreshSession(Request $request)
    {
        $user = $request->user();

        // Revoke the current token
        $request->user()->currentAccessToken()->delete();

        // Create a new token
        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'token' => $token,
            'expires_at' => config('sanctum.expiration') ? now()->addMinutes(config('sanctum.expiration')) : null,
        ];
    }
}
