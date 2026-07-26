<?php

namespace App\Http\Controllers\Api\V1\cms;

use App\Http\Controllers\Controller;
use App\Models\Cms\AdminApiToken;
use App\Models\Auth\Permission;
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
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        /** @var User|null $user */
        $user = User::query()->where('email', $data['email'])->first();

        if (! $user || ! $user->is_active || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['error' => 'Invalid credentials.'], 422);
        }

        $plain = Str::random(64);

        AdminApiToken::query()->create([
            'user_id' => $user->id,
            'token_hash' => hash('sha256', $plain),
            'expires_at' => now()->addHours(12),
        ]);

        return response()->json([
            'token' => $plain,
            'actor' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'permissions' => $this->permissionsForRole($user->role),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $request->attributes->get('admin_user');
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        return response()->json([
            'actor' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'permissions' => $this->permissionsForRole($user->role),
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

    private function permissionsForRole(string $role): array
    {
        return Permission::query()
            ->join('role_permissions', 'permissions.id', '=', 'role_permissions.permission_id')
            ->where('role_permissions.role', $role)
            ->orderBy('permissions.code')
            ->pluck('permissions.code')
            ->values()
            ->all();
    }
}
