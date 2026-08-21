<?php

namespace App\Http\Controllers\Api\V1\Cms;

use App\Http\Controllers\Controller;
use App\Models\Auth\Permission;
use App\Models\Auth\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionsMatrixController extends Controller
{
    /**
     * All known CMS role slugs in tier order.
     * platform.admin is listed first; its permissions cannot be modified via the matrix UI.
     */
    private const ROLE_ORDER = [
        // T1 — Platform
        'platform.admin',
        // T2 — Operations
        'ops.manager',
        // T3 — Content
        'content.supervisor',
        'content.publisher',
        'content.editor',
        // T4 — Authoring
        'content.author',
        // T5 — Inquiry
        'inquiry.manager',
        'inquiry.email',
        'inquiry.support',
        'inquiry.faq',
    ];

    /** Roles that may be modified through the matrix endpoint. */
    private const EDITABLE_ROLES = [
        'ops.manager',
        'content.supervisor',
        'content.publisher',
        'content.editor',
        'content.author',
        'inquiry.manager',
        'inquiry.email',
        'inquiry.support',
        'inquiry.faq',
    ];

    public function index(): JsonResponse
    {
        $allPermissions = Permission::query()->orderBy('code')->pluck('code')->values()->all();

        // Eager-load all roles with their permissions in one query.
        $roles = Role::with('permissions:id,code')->get()->keyBy('name');

        $matrix = [];
        foreach (self::ROLE_ORDER as $roleName) {
            /** @var Role|null $role */
            $role = $roles->get($roleName);
            $matrix[$roleName] = $role
                ? $role->permissions->pluck('code')->sort()->values()->all()
                : [];
        }

        return response()->json([
            'all_permissions' => $allPermissions,
            'role_permissions' => $matrix,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $roleName = $request->input('role');
        $codes    = $request->input('permissions', []);

        if (! in_array($roleName, self::EDITABLE_ROLES, true)) {
            return response()->json([
                'error' => 'Invalid role or the role cannot be modified.',
            ], 422);
        }

        $role = Role::where('name', $roleName)->first();
        if (! $role) {
            return response()->json(['error' => "Role '{$roleName}' not found."], 404);
        }

        // Resolve permission IDs from codes and sync the n-n pivot.
        $permissionIds = Permission::whereIn('code', $codes)->pluck('id');
        $role->permissions()->sync($permissionIds);

        return response()->json(['ok' => true]);
    }
}
