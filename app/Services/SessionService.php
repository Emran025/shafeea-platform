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
        $token = $request->user()->currentAccessToken();
        $currentDeviceId = $token ? $token->name : null;

        $currentSession = $currentDeviceId
            ? DB::table('sessions')->where('device_id', $currentDeviceId)->where('user_id', $user->id)->first()
            : null;

        $currentSessionId = $currentSession ? $currentSession->id : null;

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

        $sessions = $sessionsQuery->orderBy('last_activity', 'desc')->get();

        $formattedSessions = $sessions->map(function ($session) use ($currentSessionId) {
            return [
                'id' => $session->id,
                'is_current_device' => $session->id === $currentSessionId,
                'last_accessed_at' => Carbon::createFromTimestamp($session->last_activity)->toIso8601String(),
                'device_info' => [
                    'device_id' => $session->device_id,
                    'device_model' => $session->model,
                    'manufacturer' => $session->manufacturer,
                    'os_version' => $session->os_version,
                    'app_version' => $session->app_version,
                    'timezone' => $session->timezone,
                    'locale' => $session->locale,
                    'push_notification_token' => $session->fcm_token,
                ],
            ];
        });

        return [
            'status' => 'success',
            'data' => $formattedSessions,
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
        $platform = 'desktop';
        $browser = 'Unknown';
        $os = 'Unknown';

        // OS Detection
        $os_array = [
            '/windows nt 10/i'      => 'Windows 10',
            '/windows nt 6.3/i'     => 'Windows 8.1',
            '/windows nt 6.2/i'     => 'Windows 8',
            '/windows nt 6.1/i'     => 'Windows 7',
            '/windows nt 6.0/i'     => 'Windows Vista',
            '/windows nt 5.2/i'     => 'Windows Server 2003/XP x64',
            '/windows nt 5.1/i'     => 'Windows XP',
            '/windows xp/i'         => 'Windows XP',
            '/windows nt 5.0/i'     => 'Windows 2000',
            '/windows me/i'         => 'Windows ME',
            '/win98/i'              => 'Windows 98',
            '/win95/i'              => 'Windows 95',
            '/win16/i'              => 'Windows 3.11',
            '/macintosh|mac os x/i' => 'Mac OS X',
            '/mac_powerpc/i'        => 'Mac OS 9',
            '/linux/i'              => 'Linux',
            '/ubuntu/i'             => 'Ubuntu',
            '/iphone|ipod|ipad/i'   => 'iOS',
            '/android/i'            => 'Android',
            '/blackberry/i'         => 'BlackBerry',
            '/webos/i'              => 'Mobile',
        ];

        foreach ($os_array as $regex => $value) {
            if (preg_match($regex, $userAgent)) {
                $os = $value;
                break;
            }
        }

        // Browser Detection
        $browser_array = [
            '/msie/i'      => 'Internet Explorer',
            '/firefox/i'   => 'Firefox',
            '/safari/i'    => 'Safari',
            '/chrome/i'    => 'Chrome',
            '/edge/i'      => 'Edge',
            '/opera/i'     => 'Opera',
            '/netscape/i'  => 'Netscape',
            '/maxthon/i'   => 'Maxthon',
            '/konqueror/i' => 'Konqueror',
            '/mobile/i'    => 'Handheld Browser',
        ];

        if (strpos($userAgent, 'Edg') !== false) {
            $browser = 'Edge';
        } elseif (strpos($userAgent, 'Chrome') !== false && strpos($userAgent, 'Safari') !== false) {
            $browser = 'Chrome';
        } elseif (strpos($userAgent, 'Safari') !== false) {
            $browser = 'Safari';
        } else {
             foreach ($browser_array as $regex => $value) {
                if (preg_match($regex, $userAgent)) {
                    $browser = $value;
                    break;
                }
            }
        }


        // Platform detection
        if (preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|rim)|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i', $userAgent)
            || preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|4t|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5|i)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i', substr($userAgent, 0, 4))) {
            $platform = 'mobile';
        } elseif (strpos($userAgent, 'Tablet') !== false || strpos($userAgent, 'iPad') !== false) {
            $platform = 'tablet';
        }

        return [
            'platform' => $platform,
            'browser'  => $browser,
            'os'       => $os,
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
        $token = $request->user()->currentAccessToken();
        $currentDeviceId = $token ? $token->name : null;

        $currentSession = $currentDeviceId
            ? DB::table('sessions')->where('device_id', $currentDeviceId)->where('user_id', $user->id)->first()
            : null;

        if ($currentSession && $sessionId === $currentSession->id) {
            return false;
        }

        $sessionToDelete = DB::table('sessions')->where('id', $sessionId)->where('user_id', $user->id)->first();

        if ($sessionToDelete) {
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
        $token = $request->user()->currentAccessToken();
        $currentDeviceId = $token ? $token->name : null;

        $currentSession = $currentDeviceId
            ? DB::table('sessions')->where('device_id', $currentDeviceId)->where('user_id', $user->id)->first()
            : null;

        $currentSessionId = $currentSession ? $currentSession->id : null;

        $query = DB::table('sessions')->where('user_id', $user->id);

        if ($currentSessionId) {
            $query->where('id', '!=', $currentSessionId);
        }

        $sessionsToDelete = $query->get();

        if ($sessionsToDelete->isNotEmpty()) {
            $sessionIds = $sessionsToDelete->pluck('id')->toArray();
            DB::table('sessions')->whereIn('id', $sessionIds)->delete();
        }

        return $sessionsToDelete->count();
    }

}
