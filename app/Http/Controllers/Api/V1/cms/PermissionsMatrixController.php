<?php

namespace App\Http\Controllers\Api\V1\cms;

use App\Http\Controllers\Controller;
use App\Models\Auth\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermissionsMatrixController extends Controller
{
    public function index(): JsonResponse
    {
        $all = Permission::query()->orderBy('id')->get(['code']);

        $rolePermissions = DB::table('role_permissions')
            ->join('permissions', 'permissions.id', '=', 'role_permissions.permission_id')
            ->select(['role_permissions.role', 'permissions.code'])
            ->get()
            ->groupBy('role')
            ->map(fn($rows) => $rows->pluck('code')->values()->all());

        return response()->json([
            'all_permissions' => $all->pluck('code')->values()->all(),
            'role_permissions' => [
                // T1 — Platform
                'platform.admin'      => $rolePermissions->get('platform.admin', []),
                // T2 — Operations
                'ops.manager'         => $rolePermissions->get('ops.manager', []),
                // T3 — Content
                'content.supervisor'  => $rolePermissions->get('content.supervisor', []),
                'content.publisher'   => $rolePermissions->get('content.publisher', []),
                'content.editor'      => $rolePermissions->get('content.editor', []),
                // T4 — Authoring
                'content.author'      => $rolePermissions->get('content.author', []),
                // T5 — Inquiry
                'inquiry.manager'     => $rolePermissions->get('inquiry.manager', []),
                'inquiry.email'       => $rolePermissions->get('inquiry.email', []),
                'inquiry.support'     => $rolePermissions->get('inquiry.support', []),
                'inquiry.faq'         => $rolePermissions->get('inquiry.faq', []),
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $role = $request->input('role');
        $codes = $request->input('permissions', []);

        $validRoles = [
            // platform.admin cannot be modified — see below
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

        if (!in_array($role, $validRoles)) {
            return response()->json(['error' => 'Invalid role or the role cannot be modified.'], 422);
        }

        $permIds = Permission::whereIn('code', $codes)->pluck('id');

        DB::table('role_permissions')->where('role', $role)->delete();

        foreach ($permIds as $permId) {
            DB::table('role_permissions')->insert([
                'role'          => $role,
                'permission_id' => $permId,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
        }

        return response()->json(['ok' => true]);
    }
}
