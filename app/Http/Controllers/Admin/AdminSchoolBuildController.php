<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Services\GitHubDispatchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

/**
 * AdminSchoolBuildController
 *
 * Handles all build-related administrative actions for schools:
 *   - Saving per-school build configuration (keystore, signing credentials)
 *   - Triggering on-demand rebuilds via GitHub Actions repository_dispatch
 *   - Returning current build status for dashboard polling
 */
class AdminSchoolBuildController extends Controller
{
    public function __construct(private GitHubDispatchService $githubDispatch)
    {
    }

    /**
     * PUT /admin/schools/{school}/build-config
     *
     * Saves the school's Android signing configuration.
     * Keystore passwords are encrypted at rest by the School model's accessors.
     */
    public function updateBuildConfig(Request $request, School $school)
    {
        $validated = $request->validate([
            'school_locked_mode'      => 'boolean',
            'keystore_file'           => 'nullable|string',       // base64-encoded keystore
            'keystore_store_password' => 'nullable|string|max:255',
            'keystore_key_alias'      => 'nullable|string|max:255',
            'keystore_key_password'   => 'nullable|string|max:255',
            'build_notes'             => 'nullable|string|max:2000',
        ]);

        // Only update keystore fields that were actually provided in this request.
        // Prevents accidentally nullifying a field when the admin only edits one field.
        $updateData = array_filter($validated, fn ($v) => !is_null($v));

        $school->update($updateData);

        return Redirect::back()->with('success', 'تم حفظ إعدادات البناء بنجاح.');
    }

    /**
     * POST /admin/schools/{school}/rebuild
     *
     * Dispatches a repository_dispatch event to GitHub Actions, triggering
     * the rebuild-school workflow for this specific school.
     * The CI pipeline will pull the build config from the Build API.
     */
    public function triggerRebuild(School $school)
    {
        if (!$school->isApproved()) {
            return Redirect::back()->with('error', 'لا يمكن إعادة بناء تطبيق مدرسة غير مفعّلة.');
        }

        if (empty($school->school_code)) {
            return Redirect::back()->with('error', 'لا يوجد رمز مدرسة (School Code) محدد.');
        }

        // Mark as building immediately so the dashboard shows the updated status
        $school->update(['build_status' => 'building']);

        $dispatched = $this->githubDispatch->dispatchSchoolRebuild($school);

        if (!$dispatched) {
            // Revert status if dispatch failed
            $school->update(['build_status' => 'failed']);
            return Redirect::back()->with('error', 'فشل إرسال طلب إعادة البناء إلى GitHub. تحقق من إعداد GITHUB_DISPATCH_TOKEN.');
        }

        return Redirect::back()->with('success', "تم إرسال طلب إعادة بناء تطبيق [{$school->school_code}] بنجاح. سيظهر الملف في الإصدار خلال دقائق.");
    }

    /**
     * GET /admin/schools/{school}/build-status
     *
     * Returns the current build status for a school as JSON.
     * Used for lightweight polling from the admin dashboard without a full page reload.
     */
    public function getBuildStatus(School $school)
    {
        return response()->json([
            'build_status'       => $school->build_status,
            'last_built_at'      => $school->last_built_at?->toISOString(),
            'last_built_release' => $school->last_built_release,
        ]);
    }
}
