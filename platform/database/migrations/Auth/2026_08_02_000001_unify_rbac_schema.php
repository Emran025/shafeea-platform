<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Reconciliation migration — unifies the two competing RBAC systems left by the
 * accsystem/shafeea_platform merger into a single n-n chain:
 *
 *   users  ←→  role_user  ←→  roles  ←→  permission_role  ←→  permissions
 *
 * Every step is idempotent (guarded by hasTable / hasColumn).
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── 1. users.is_active ───────────────────────────────────────────────
        if (! Schema::hasColumn('users', 'is_active')) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('is_active')->default(true)
                    ->after('status')
                    ->comment('CMS admin account active flag');
            });
        }

        // ── 2. Drop users.role (flat role string — replaced by role_user pivot) ──
        if (Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }

        // ── 3. Rename permissions columns to match JSON seed files & controllers ──
        //   permissions.name        → permissions.code
        //   permissions.display_name → permissions.label
        if (Schema::hasTable('permissions')) {
            Schema::table('permissions', function (Blueprint $table) {
                if (Schema::hasColumn('permissions', 'name') && ! Schema::hasColumn('permissions', 'code')) {
                    $table->renameColumn('name', 'code');
                }
                if (Schema::hasColumn('permissions', 'display_name') && ! Schema::hasColumn('permissions', 'label')) {
                    $table->renameColumn('display_name', 'label');
                }
                if (Schema::hasColumn('permissions', 'description')) {
                    $table->dropColumn('description');
                }
            });
        }

        // ── 5. Drop permission_user (no direct bypass — all perms via roles) ──
        Schema::dropIfExists('permission_user');

        // ── 6. Drop role_permissions (old flat table from accsystem merger) ──
        Schema::dropIfExists('role_permissions');

        // ── 7. newsroom_links ────────────────────────────────────────────────
        if (! Schema::hasTable('newsroom_links')) {
            Schema::create('newsroom_links', function (Blueprint $table) {
                $table->id();
                $table->string('label');
                $table->string('href');
                $table->unsignedInteger('position')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // ── 8. admin_api_tokens ─────────────────────────────────────────────
        if (! Schema::hasTable('admin_api_tokens')) {
            Schema::create('admin_api_tokens', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('token_hash', 64)->unique();
                $table->timestamp('expires_at');
                $table->timestamp('last_used_at')->nullable();
                $table->timestamps();
                $table->index('expires_at');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_api_tokens');
        Schema::dropIfExists('newsroom_links');

        // Restore permission_user
        if (! Schema::hasTable('permission_user')) {
            Schema::create('permission_user', function (Blueprint $table) {
                $table->foreignId('permission_id')->constrained()->onDelete('cascade');
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->primary(['permission_id', 'user_id']);
            });
        }

        // Restore role_permissions
        if (! Schema::hasTable('role_permissions')) {
            Schema::create('role_permissions', function (Blueprint $table) {
                $table->id();
                $table->string('role', 64);
                $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
                $table->unique(['role', 'permission_id']);
                $table->timestamps();
            });
        }

        // Restore users.role
        if (! Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role', 64)->default('content.author')->after('email');
            });
        }

        // Restore permissions columns
        Schema::table('permissions', function (Blueprint $table) {
            if (Schema::hasColumn('permissions', 'code') && ! Schema::hasColumn('permissions', 'name')) {
                $table->renameColumn('code', 'name');
            }
            if (Schema::hasColumn('permissions', 'label') && ! Schema::hasColumn('permissions', 'display_name')) {
                $table->renameColumn('label', 'display_name');
            }
        });

        // Restore users.is_active removal
        if (Schema::hasColumn('users', 'is_active')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('is_active');
            });
        }
    }
};
