<?php

namespace App\Services;

use App\Models\School;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * GitHubDispatchService
 *
 * Sends repository_dispatch events to BOTH application repositories
 * (shafeea_student and shafeea_teach) simultaneously, triggering the
 * rebuild-school workflow in each.
 *
 * Architecture (decentralized):
 *   - shafeea-build-env  → Docker image + scripts provider only (no builds run here)
 *   - shafeea_student    → hosts build-all-schools.yml + rebuild-school.yml
 *   - shafeea_teach      → hosts build-all-schools.yml + rebuild-school.yml
 *
 * Authentication: GitHub Personal Access Token (GITHUB_DISPATCH_TOKEN)
 * stored in .env. The token must have the "repo" scope on both repositories.
 */
class GitHubDispatchService
{
    private string $apiBase = 'https://api.github.com';
    private string $token;
    private string $owner;

    // The two application repositories that host the build workflows
    private string $studentRepo;
    private string $teachRepo;

    public function __construct()
    {
        $this->token       = config('services.github.token', '');
        $this->owner       = config('services.github.owner', 'Emran025');
        $this->studentRepo = config('services.github.student_repo', 'shafeea_student');
        $this->teachRepo   = config('services.github.teach_repo',   'shafeea_teach');
    }

    /**
     * Trigger a rebuild for a single school in BOTH application repositories.
     *
     * Fires repository_dispatch with event_type = "rebuild_school" simultaneously
     * to shafeea_student and shafeea_teach. Both repos run their rebuild-school
     * workflow in parallel, each building their own branded APK and attaching
     * it to their latest GitHub Release.
     *
     * @return bool  true if BOTH dispatches were accepted (HTTP 204), false if either failed.
     */
    public function dispatchSchoolRebuild(School $school): bool
    {
        if (empty($this->token)) {
            Log::error('GitHubDispatchService: GITHUB_DISPATCH_TOKEN is not set. Cannot trigger rebuild.');
            return false;
        }

        $logoUrl = $school->logo
            ? rtrim(config('app.url'), '/') . '/storage/' . $school->getRawOriginal('logo')
            : '';

        $payload = [
            // Identity
            'school_id'          => $school->id,
            'school_code'        => $school->school_code,
            'school_name'        => $school->name,
            'logo_url'           => $logoUrl,
            // App-lock
            'app_key'            => $school->app_key,
            'school_locked_mode' => (bool) $school->school_locked_mode,
            // Signing (passwords decrypted by model accessors before dispatch)
            'keystore_file'           => $school->keystore_file ?? '',
            'keystore_store_password' => $school->keystore_store_password ?? '',
            'keystore_key_alias'      => $school->keystore_key_alias ?? '',
            'keystore_key_password'   => $school->keystore_key_password ?? '',
        ];

        $studentOk = $this->dispatch($this->studentRepo, $payload, $school->school_code);
        $teachOk   = $this->dispatch($this->teachRepo,   $payload, $school->school_code);

        return $studentOk && $teachOk;
    }

    /**
     * Send a single repository_dispatch event to one repository.
     */
    private function dispatch(string $repo, array $clientPayload, string $schoolCode): bool
    {
        $response = Http::withToken($this->token)
            ->withHeaders([
                'Accept'     => 'application/vnd.github+json',
                'User-Agent' => 'Shafeea-Platform/1.0',
            ])
            ->post("{$this->apiBase}/repos/{$this->owner}/{$repo}/dispatches", [
                'event_type'     => 'rebuild_school',
                'client_payload' => $clientPayload,
            ]);

        if ($response->successful()) {
            Log::info("GitHubDispatchService: Rebuild dispatched to [{$repo}] for school [{$schoolCode}].");
            return true;
        }

        Log::error("GitHubDispatchService: Failed to dispatch rebuild to [{$repo}] for school [{$schoolCode}].", [
            'status'   => $response->status(),
            'response' => $response->body(),
        ]);

        return false;
    }
}
