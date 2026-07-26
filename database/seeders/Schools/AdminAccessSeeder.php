<?php

namespace Database\Seeders\Schools;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminAccessSeeder extends Seeder
{
    public function run(): void
    {
        $now = now()->toDateTimeString();

        // 1. Users
        $usersPath = database_path('content/admin/users.json');
        if (! file_exists($usersPath)) {
            throw new \RuntimeException("AdminAccessSeeder: users.json not found.");
        }
        $users = json_decode(file_get_contents($usersPath), true, 512, JSON_THROW_ON_ERROR);

        foreach ($users as $user) {
            DB::table('users')->updateOrInsert(
                ['email' => mb_strtolower(trim($user['email']))],
                [
                    'name' => $user['name'],
                    'role' => $user['role'] ?? 'school.admin',
                    'is_active' => $user['is_active'] ?? true,
                    'email_verified_at' => $now,
                    'password' => Hash::make('Acc@123456'),
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }

        // 2. Topics
        $topicsPath = database_path('content/admin/topics.json');
        if (! file_exists($topicsPath)) {
            throw new \RuntimeException("AdminAccessSeeder: topics.json not found.");
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

        // 3. Permissions
        $permissionsPath = database_path('content/admin/permissions.json');
        if (! file_exists($permissionsPath)) {
            throw new \RuntimeException("AdminAccessSeeder: permissions.json not found.");
        }
        $permissions = json_decode(file_get_contents($permissionsPath), true, 512, JSON_THROW_ON_ERROR);

        foreach ($permissions as $perm) {
            DB::table('permissions')->updateOrInsert(
                ['code' => $perm['code']],
                ['label' => $perm['label'], 'updated_at' => $now, 'created_at' => $now]
            );
        }

        DB::table('role_permissions')->delete();

        // 4. Role Permissions
        $rolePermissionsPath = database_path('content/admin/role_permissions.json');
        if (! file_exists($rolePermissionsPath)) {
            throw new \RuntimeException("AdminAccessSeeder: role_permissions.json not found.");
        }
        $roleMap = json_decode(file_get_contents($rolePermissionsPath), true, 512, JSON_THROW_ON_ERROR);

        foreach ($roleMap as $role => $codes) {
            foreach ($codes as $code) {
                $permissionId = DB::table('permissions')->where('code', $code)->value('id');
                if ($permissionId) {
                    DB::table('role_permissions')->insert([
                        'role' => $role,
                        'permission_id' => $permissionId,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }
            }
        }

        DB::table('topic_user')->delete();

        // 5. Topic Assignments
        $topicAssignmentsPath = database_path('content/admin/topic_assignments.json');
        if (! file_exists($topicAssignmentsPath)) {
            throw new \RuntimeException("AdminAccessSeeder: topic_assignments.json not found.");
        }
        $topicAssignments = json_decode(file_get_contents($topicAssignmentsPath), true, 512, JSON_THROW_ON_ERROR);

        foreach ($topicAssignments as $topicName => $emails) {
            $topicId = DB::table('topics')->where('name', $topicName)->value('id');
            if (! $topicId) {
                continue;
            }
            foreach ($emails as $email) {
                $userId = DB::table('users')->where('email', mb_strtolower(trim($email)))->value('id');
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
