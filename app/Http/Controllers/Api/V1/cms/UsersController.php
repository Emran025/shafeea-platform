<?php

namespace App\Http\Controllers\Api\V1\cms;

use App\Http\Controllers\Controller;
use App\Models\Auth\User;
use App\Models\Cms\Topic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UsersController extends Controller
{
    /**
     * Tier codes for convenience — used in validations and guards.
     * T1 Platform | T2 Operations | T3 Content | T4 Authoring | T5 Inquiry
     */
    private const TIERS = [
        'platform' => ['platform.admin'],
        'ops'      => ['ops.manager'],
        'content'  => ['content.supervisor', 'content.publisher', 'content.editor'],
        'author'   => ['content.author'],
        'inquiry'  => ['inquiry.manager', 'inquiry.email', 'inquiry.support', 'inquiry.faq'],
    ];

    private const ALL_ROLES = [
        'platform.admin',
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

    public function index(Request $request): JsonResponse
    {
        $query = User::query()->with('topics:id,name')->orderBy('id');

        // ?tier=platform|ops|content|author|inquiry  — scopes results to that tier
        if ($tier = $request->query('tier')) {
            $roles = self::TIERS[$tier] ?? [];
            if (! empty($roles)) {
                $query->whereIn('role', $roles);
            }
        }

        // ?role=  — further narrow to a specific role code
        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }

        $users = $query->get()->map(fn(User $u) => [
            'id'     => (string) $u->id,
            'name'   => $u->name,
            'email'  => $u->email,
            'role'   => $u->role,
            'tier'   => $this->resolveTier($u->role),
            'active' => (bool) $u->is_active,
            'topics' => $u->topics->pluck('name')->values()->all(),
        ]);

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'role'     => ['required', Rule::in(self::ALL_ROLES)],
            'active'   => ['required', 'boolean'],
            'topics'   => ['array'],
            'topics.*' => ['string', 'max:120'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        // Enforce caller-tier permission:
        //   creating a supervisor-tier user requires manage_supervisors
        //   creating a content-tier/author user requires manage_content_users
        $this->authorizeRoleAssignment($request, $data['role']);

        $user = User::query()->create([
            'name'             => $data['name'],
            'email'            => $data['email'],
            'role'             => $data['role'],
            'is_active'        => $data['active'],
            'password'         => Hash::make($data['password'] ?? 'Acc@123456'),
            'email_verified_at' => now(),
        ]);

        $this->syncTopics($user, $data['topics'] ?? []);

        return response()->json(['id' => (string) $user->id], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role'     => ['required', Rule::in(self::ALL_ROLES)],
            'active'   => ['required', 'boolean'],
            'topics'   => ['array'],
            'topics.*' => ['string', 'max:120'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        // Caller must have permission for the target role's tier
        $this->authorizeRoleAssignment($request, $data['role']);

        $user->fill([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'role'      => $data['role'],
            'is_active' => $data['active'],
        ]);

        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        $this->syncTopics($user, $data['topics'] ?? []);

        return response()->json(['ok' => true]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->topics()->detach();
        $user->delete();
        return response()->json(null, 204);
    }

    private function syncTopics(User $user, array $topicNames): void
    {
        $topicIds = Topic::query()
            ->whereIn('name', $topicNames)
            ->pluck('id')
            ->all();
        $user->topics()->sync($topicIds);
    }

    /** Resolve which tier label a role belongs to. */
    private function resolveTier(string $role): string
    {
        foreach (self::TIERS as $tier => $roles) {
            if (in_array($role, $roles, true)) {
                return $tier;
            }
        }
        return 'unknown';
    }

    /**
     * Guard store/update: the calling user must hold the appropriate permission
     * to assign the given target role.
     *
     * - platform.admin roles      → require manage_supervisors
     * - ops / content / inquiry   → require manage_supervisors
     * - content.author            → require manage_content_users
     * - content.editor/supervisor → require manage_content_users
     *
     * platform.admin callers bypass all checks (handled by RequirePermission).
     */
    private function authorizeRoleAssignment(\Illuminate\Http\Request $request, string $targetRole): void
    {
        $caller = $request->attributes->get('admin_user');
        if (! $caller || $caller->role === 'platform.admin') {
            return; // already guarded upstream
        }

        $supervisorRoles = array_merge(
            self::TIERS['platform'],
            self::TIERS['ops'],
            self::TIERS['inquiry'],
        );

        $required = in_array($targetRole, $supervisorRoles, true)
            ? 'manage_supervisors'
            : 'manage_content_users';

        if (! $caller->hasPermission($required)) {
            abort(403, "You do not have permission to assign the role '{$targetRole}'.");
        }
    }
}
