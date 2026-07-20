<?php

namespace App\Services;

use App\Models\School;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

/**
 * BuildApiService
 *
 * Encapsulates all business logic for the Build API.
 * Keeps the controller thin and the logic independently testable.
 */
class BuildApiService
{
    /**
     * Get the list of schools that should be built, based on the requested mode.
     *
     * Mode: "new_release" | "all"
     *   Returns ALL active schools. Used when a new version tag is published and
     *   every school needs a fresh APK regardless of prior build history.
     *   ("all" is accepted as an alias for "new_release" for CI compatibility.)
     *
     * Mode: "latest_release" (default)
     *   Returns only active schools that have NOT yet been built for the given
     *   release version. Avoids rebuilding schools that already have an APK.
     *
     * @param  string       $mode     "new_release" | "all" | "latest_release"
     * @param  string|null  $release  Version tag, e.g. "v2.0.0" (required for latest_release)
     */
    public function getSchoolsForBuild(string $mode, ?string $release): Collection
    {
        if ($mode === 'new_release' || $mode === 'all') {
            return School::active()->get();
        }

        // Default: latest_release — skip schools already built for this release
        if (empty($release)) {
            return School::active()->get();
        }

        return School::notBuiltForRelease($release)->get();
    }

    /**
     * Mark a school as successfully built for the given release.
     * Called by the CI pipeline after a successful APK upload.
     */
    public function markSchoolBuilt(School $school, string $release): void
    {
        $school->update([
            'build_status'       => 'built',
            'last_built_at'      => now(),
            'last_built_release' => $release,
        ]);

        Log::info("Build API: School [{$school->school_code}] marked as built for release {$release}.");
    }

    /**
     * Mark a school build as in-progress (called when CI starts the build job).
     */
    public function markSchoolBuilding(School $school): void
    {
        $school->update(['build_status' => 'building']);
    }

    /**
     * Mark a school build as failed.
     */
    public function markSchoolFailed(School $school): void
    {
        $school->update(['build_status' => 'failed']);
    }

    /**
     * Build the full configuration payload for a single school.
     * This is what GitHub Actions receives to perform a white-label build.
     *
     * Note: Keystore passwords are decrypted transparently by the School model's
     * encrypted accessors before being returned here.
     */
    public function generateBuildPayload(School $school): array
    {
        return [
            // ── Identity ───────────────────────────────────────────────────────
            'id'                 => $school->id,
            'school_code'        => $school->school_code,
            'name'               => $school->name,
            'logo_url'           => $school->getPublicLogoUrl(),

            // ── Application mode ──────────────────────────────────────────────
            'school_locked_mode' => $school->school_locked_mode,
            'app_key'            => $school->school_locked_mode ? $school->app_key : null,

            // ── Android signing ───────────────────────────────────────────────
            'keystore_file'           => $school->keystore_file,           // base64
            'keystore_store_password' => $school->keystore_store_password, // decrypted by accessor
            'keystore_key_alias'      => $school->keystore_key_alias,
            'keystore_key_password'   => $school->keystore_key_password,   // decrypted by accessor

            // ── Build metadata ────────────────────────────────────────────────
            'build_status'       => $school->build_status,
            'last_built_release' => $school->last_built_release,
            'build_notes'        => $school->build_notes,
        ];
    }
}
