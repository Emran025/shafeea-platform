<?php

namespace Database\Seeders\Schools;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminAccessSeeder extends Seeder
{
    /**
     * Human-readable display names for every CMS role slug.
     * This map is the single source of truth for the roles table.
     */
    private const ROLE_DISPLAY_NAMES = [
        'platform.admin' => 'Platform Administrator',
        'ops.manager' => 'Operations Manager',
        'content.supervisor' => 'Content Supervisor',
        'content.publisher' => 'Content Publisher',
        'content.editor' => 'Content Editor',
        'content.author' => 'Content Author',
        'inquiry.manager' => 'Inquiry Manager',
        'inquiry.email' => 'Inquiry (Email)',
        'inquiry.support' => 'Inquiry (Support)',
        'inquiry.faq' => 'Inquiry (FAQ)',
    ];

    public function run(): void
    {
        $now = now()->toDateTimeString();

        // ── 1. Roles ──────────────────────────────────────────────────────────
        // Seed the roles table (n-n source — no more flat string column on users).
        foreach (self::ROLE_DISPLAY_NAMES as $name => $displayName) {
            DB::table('roles')->updateOrInsert(
                ['name' => $name],
                [
                    'display_name' => $displayName,
                    'description' => null,
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }

        // ── 2. Users ──────────────────────────────────────────────────────────
        // Source: config/admin.php → 'users'  (emails are env-driven)
        $users = config('admin.users', []);

        foreach ($users as $userData) {
            $email = mb_strtolower(trim($userData['email']));

            DB::table('users')->updateOrInsert(
                ['email' => $email],
                [
                    'name' => $userData['name'],
                    'is_active' => $userData['is_active'] ?? true,
                    'email_verified_at' => $now,
                    'password' => Hash::make(config('admin.default_password', 'Acc@123456')),
                    'updated_at' => $now,
                    'created_at' => $now,
                    // NOTE: No 'role' column — assignment happens via role_user pivot below.
                ]
            );

            // Sync the user → role relationship via the n-n role_user pivot.
            $roleName = $userData['role'] ?? null;
            if ($roleName) {
                $userId = DB::table('users')->where('email', $email)->value('id');
                $roleId = DB::table('roles')->where('name', $roleName)->value('id');

                if ($userId && $roleId) {
                    DB::table('role_user')->updateOrInsert(
                        ['user_id' => $userId, 'role_id' => $roleId]
                    );
                }
            }
        }

        // ── 3. Topics ─────────────────────────────────────────────────────────
        // Still sourced from topics.json (non-sensitive structural content data).
        $topicsPath = database_path('content/admin/topics.json');
        if (! file_exists($topicsPath)) {
            throw new \RuntimeException('AdminAccessSeeder: topics.json not found.');
        }
        $topics = json_decode(file_get_contents($topicsPath), true, 512, JSON_THROW_ON_ERROR);

        foreach ($topics as $topic) {
            DB::table('topics')->updateOrInsert(
                ['name' => $topic['name']],
                [
                    'description' => $topic['description'],
                    'color' => $topic['color'],
                    'articles_count' => $topic['articles_count'],
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }

        // ── 4. Permissions ────────────────────────────────────────────────────
        // Source: config/admin.php → 'permissions'
        $permissions = config('admin.permissions', []);

        foreach ($permissions as $perm) {
            DB::table('permissions')->updateOrInsert(
                ['code' => $perm['code']],
                ['label' => $perm['label'], 'updated_at' => $now, 'created_at' => $now]
            );
        }

        // ── 5. Role → Permission assignments (n-n via permission_role) ────────
        // role_permissions.json maps role slugs → permission code arrays.
        // This file remains JSON because it is a pure structural mapping with no secrets.
        $rolePermissionsPath = database_path('content/admin/role_permissions.json');
        if (! file_exists($rolePermissionsPath)) {
            throw new \RuntimeException('AdminAccessSeeder: role_permissions.json not found.');
        }
        $roleMap = json_decode(file_get_contents($rolePermissionsPath), true, 512, JSON_THROW_ON_ERROR);

        // Clear existing permission_role rows so we can do a clean re-seed.
        DB::table('permission_role')->delete();

        foreach ($roleMap as $roleName => $codes) {
            $roleId = DB::table('roles')->where('name', $roleName)->value('id');
            if (! $roleId) {
                continue;
            }

            foreach ($codes as $code) {
                $permissionId = DB::table('permissions')->where('code', $code)->value('id');
                if ($permissionId) {
                    DB::table('permission_role')->insertOrIgnore([
                        'permission_id' => $permissionId,
                        'role_id' => $roleId,
                    ]);
                }
            }
        }

        // ── 6. Topic Assignments ──────────────────────────────────────────────
        // Source: config/admin.php → 'topic_assignments'  (emails are env-driven)
        $topicAssignments = config('admin.topic_assignments', []);

        DB::table('topic_user')->delete();

        foreach ($topicAssignments as $topicName => $emails) {
            $topicId = DB::table('topics')->where('name', $topicName)->value('id');
            if (! $topicId) {
                continue;
            }
            foreach ($emails as $email) {
                $userId = DB::table('users')
                    ->where('email', mb_strtolower(trim($email)))
                    ->value('id');
                if ($userId) {
                    DB::table('topic_user')->insertOrIgnore([
                        'topic_id' => $topicId,
                        'user_id' => $userId,
                    ]);
                }
            }
        }
    }
}
