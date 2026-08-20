<?php

namespace App\Http\Controllers\Api\V1\Cms;

use App\Http\Controllers\Controller;
use App\Models\Auth\Role;
use App\Models\Auth\User;
use App\Models\Cms\Topic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UsersController extends Controller
{
    /**
     * Tier codes — maps tier label → allowed role names.
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
        $query = User::query()->with(['roles:id,name', 'topics:id,name'])->orderBy('id');

        // ?tier=platform|ops|content|author|inquiry — scopes results to that tier
        if ($tier = $request->query('tier')) {
            $roles = self::TIERS[$tier] ?? [];
            if (! empty($roles)) {
                $query->whereHas('roles', fn($q) => $q->whereIn('name', $roles));
            }
        }

        // ?role= — narrow to a specific role code
        if ($role = $request->query('role')) {
            $query->whereHas('roles', fn($q) => $q->where('name', $role));
        }

        $users = $query->get()->map(fn(User $u) => [
            'id'     => (string) $u->id,
            'name'   => $u->name,
            'email'  => $u->email,
            'roles'  => $u->roles->pluck('name')->values()->all(),
            'tier'   => $this->resolveTier($u->roles->pluck('name')->all()),
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
            'roles'    => ['required', 'array', 'min:1'],
            'roles.*'  => ['string', Rule::in(self::ALL_ROLES)],
            'active'   => ['required', 'boolean'],
            'topics'   => ['array'],
            'topics.*' => ['string', 'max:120'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        // Enforce caller-tier permission
        $this->authorizeRoleAssignment($request, $data['roles']);

        $user = User::query()->create([
            'name'              => $data['name'],
            'email'             => $data['email'],
            'is_active'         => $data['active'],
            'password'          => Hash::make($data['password'] ?? 'Acc@123456'),
            'email_verified_at' => now(),
        ]);

        $this->syncRoles($user, $data['roles']);
        $this->syncTopics($user, $data['topics'] ?? []);

        return response()->json(['id' => (string) $user->id], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'roles'    => ['required', 'array', 'min:1'],
            'roles.*'  => ['string', Rule::in(self::ALL_ROLES)],
            'active'   => ['required', 'boolean'],
            'topics'   => ['array'],
            'topics.*' => ['string', 'max:120'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        // Caller must have permission for the target role tier
        $this->authorizeRoleAssignment($request, $data['roles']);

        $user->fill([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'is_active' => $data['active'],
        ]);

        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        $this->syncRoles($user, $data['roles']);
        $this->syncTopics($user, $data['topics'] ?? []);

        return response()->json(['ok' => true]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->roles()->detach();
        $user->topics()->detach();
        $user->delete();

        return response()->json(null, 204);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    /** Sync the role_user pivot to exactly the given set of role name-slugs. */
    private function syncRoles(User $user, array $roleNames): void
    {
        $roleIds = Role::query()->whereIn('name', $roleNames)->pluck('id')->all();
        $user->roles()->sync($roleIds);
    }

    /** Sync the topic_user pivot from topic display-names. */
    private function syncTopics(User $user, array $topicNames): void
    {
        $topicIds = Topic::query()->whereIn('name', $topicNames)->pluck('id')->all();
        $user->topics()->sync($topicIds);
    }

    /** Resolve the tier label for the first matching role. */
    private function resolveTier(array $roleNames): string
    {
        foreach (self::TIERS as $tier => $roles) {
            foreach ($roleNames as $name) {
                if (in_array($name, $roles, true)) {
                    return $tier;
                }
            }
        }
        return 'unknown';
    }

    /**
     * Guard store/update: the calling user must hold the appropriate permission
     * to assign the given target roles.
     *
     * - platform.admin callers bypass all checks (handled upstream by RequirePermission).
     * - Assigning ops / inquiry / platform roles → requires manage_supervisors.
     * - Assigning content roles                  → requires manage_content_users.
     */
    private function authorizeRoleAssignment(Request $request, array $targetRoles): void
    {
        $caller = $request->attributes->get('admin_user');
        if (! $caller || $caller->hasRole('platform.admin')) {
            return;
        }

        $supervisorRoles = array_merge(
            self::TIERS['platform'],
            self::TIERS['ops'],
            self::TIERS['inquiry'],
        );

        foreach ($targetRoles as $targetRole) {
            $required = in_array($targetRole, $supervisorRoles, true)
                ? 'manage_supervisors'
                : 'manage_content_users';

            if (! $caller->hasPermission($required)) {
                abort(403, "You do not have permission to assign the role '{$targetRole}'.");
            }
        }
    }
}
