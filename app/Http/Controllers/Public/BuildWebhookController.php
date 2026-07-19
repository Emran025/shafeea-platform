<?php

namespace App\Http\Controllers\Public;

use App\Models\School;
use App\Services\BuildApiService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * BuildWebhookController
 *
 * Receives a POST callback from GitHub Actions after a successful APK build.
 *
 * The workflow calls this endpoint to:
 *   1. Mark the school's build as complete in the database.
 *   2. Optionally send a download notification email to the school admin.
 *
 * Authentication: Uses the same RSA-SHA256 signature verification as the
 * Build API (VerifyBuildApiSignature middleware applied in routes/api.php).
 *
 * ── Payload ────────────────────────────────────────────────────────────────
 * {
 *   "school_id"  : 5,
 *   "release"    : "v2.0.0",
 *   "apk_url"    : "https://github.com/.../releases/download/v2.0.0/al-riyadh-student-v2.0.0.apk",
 *   "app_type"   : "student"   // or "teach"
 * }
 */
class BuildWebhookController extends Controller
{
    public function __construct(private BuildApiService $buildService)
    {
    }

    /**
     * POST /api/webhooks/build-complete
     */
    public function handleBuildComplete(Request $request)
    {
        $validated = $request->validate([
            'school_id' => 'required|integer|exists:schools,id',
            'release'   => 'required|string|max:30',
            'apk_url'   => 'required|url',
            'app_type'  => 'required|in:student,teach',
        ]);

        $school = School::findOrFail($validated['school_id']);

        // Mark the school as built
        $this->buildService->markSchoolBuilt($school, $validated['release']);

        // Optionally notify the school admin via email
        $this->sendAdminNotification($school, $validated);

        Log::info("BuildWebhook: School [{$school->school_code}] build complete.", [
            'release'  => $validated['release'],
            'app_type' => $validated['app_type'],
            'apk_url'  => $validated['apk_url'],
        ]);

        return response()->json([
            'success' => true,
            'message' => "Build completion recorded for [{$school->school_code}] release {$validated['release']}.",
        ]);
    }

    /**
     * Send a download-ready email to the school's admin user.
     * Silently skips if no admin email is resolvable.
     */
    private function sendAdminNotification(School $school, array $data): void
    {
        try {
            $adminUser = $school->admin?->user;
            if (!$adminUser || empty($adminUser->email)) {
                return;
            }

            $appLabel = $data['app_type'] === 'student' ? 'تطبيق الطالب' : 'تطبيق المعلم';
            $release  = $data['release'];
            $apkUrl   = $data['apk_url'];
            $name     = $school->name;
            $code     = $school->school_code;

            Mail::raw(
                "السلام عليكم،\n\n" .
                "تم إنشاء {$appLabel} الخاص بـ {$name} بنجاح للإصدار {$release}.\n\n" .
                "رابط تحميل التطبيق:\n{$apkUrl}\n\n" .
                "هذا الرابط دائم ويشير مباشرةً إلى الإصدار {$release} من تطبيق {$code}.\n\n" .
                "فريق شافيعة",
                function ($message) use ($adminUser, $school, $release, $appLabel) {
                    $message->to($adminUser->email, $adminUser->name)
                            ->subject("الإصدار {$release} جاهز — {$appLabel} لـ {$school->name}");
                }
            );
        } catch (\Throwable $e) {
            // Email failure must never break the webhook response
            Log::warning("BuildWebhook: Failed to send email notification for [{$school->school_code}].", [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
