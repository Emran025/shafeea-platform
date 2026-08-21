<?php

namespace App\Http\Controllers\Api\V1\Cms;

use App\Http\Controllers\Controller;
use App\Models\Auth\AdminApiToken;
use App\Models\Auth\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        /** @var User|null $user */
        $user = User::query()->with('roles')->where('email', $data['email'])->first();

        if (! $user || ! $user->is_active || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['error' => 'Invalid credentials.'], 422);
        }

        $plain = Str::random(64);

        AdminApiToken::query()->create([
            'user_id'    => $user->id,
            'token_hash' => hash('sha256', $plain),
            'expires_at' => now()->addHours(12),
        ]);

        return response()->json([
            'token'       => $plain,
            'actor'       => $this->actorPayload($user),
            'permissions' => $this->permissionsForUser($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $request->attributes->get('admin_user');
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        // Ensure roles are loaded (AuthenticateAdminApi may not eager-load them)
        $user->loadMissing('roles');

        return response()->json([
            'actor'       => $this->actorPayload($user),
            'permissions' => $this->permissionsForUser($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $bearer = $request->bearerToken();
        if ($bearer) {
            AdminApiToken::query()->where('token_hash', hash('sha256', $bearer))->delete();
        }

        return response()->json(['ok' => true]);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    /**
     * Build the actor payload included in login/me responses.
     * Returns an array of role name-slugs so callers can check membership.
     */
    private function actorPayload(User $user): array
    {
        return [
            'id'    => (string) $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'roles' => $user->roles->pluck('name')->values()->all(),
            'role' => $user->roles->first()?->name ?? 'content.author',
        ];
    }

    /**
     * Collect the full set of permission codes reachable by the user through
     * all their roles:  role_user → permission_role → permissions.code
     *
     * @return string[]
     */
    private function permissionsForUser(User $user): array
    {
        return \Illuminate\Support\Facades\DB::table('role_user')
            ->join('permission_role', 'permission_role.role_id', '=', 'role_user.role_id')
            ->join('permissions', 'permissions.id', '=', 'permission_role.permission_id')
            ->where('role_user.user_id', $user->id)
            ->orderBy('permissions.code')
            ->pluck('permissions.code')
            ->unique()
            ->values()
            ->all();
    }
}
