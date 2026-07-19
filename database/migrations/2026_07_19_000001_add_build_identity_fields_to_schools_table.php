<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            // ── Identity ──────────────────────────────────────────────────────
            // school_code is the globally unique slug used as:
            //   • subdomain prefix  ({school_code}.shafeea.systems360.cloud)
            //   • Flutter package name suffix
            //   • APK filename prefix
            //   • branding identifier during build
            // IMMUTABLE once approved_at is set.
            $table->string('school_code', 60)
                ->nullable()
                ->unique()
                ->after('address')
                ->comment('Globally unique slug — used as subdomain, package ID, and APK name prefix. Immutable after approval.');

            // ── Status flags ─────────────────────────────────────────────────
            $table->boolean('is_active')
                ->default(false)
                ->after('school_code')
                ->comment('True once the school is approved and operational.');

            // ── Application operating mode ────────────────────────────────────
            // true  → School-Locked: app_key is embedded in the APK and all
            //         API requests are scoped to this school.
            // false → General Mode: no school restriction embedded in the APK.
            $table->boolean('school_locked_mode')
                ->default(true)
                ->after('is_active')
                ->comment('Determines whether a school-scoped app_key is embedded during the build.');

            // ── Approval tracking ─────────────────────────────────────────────
            $table->timestamp('approved_at')
                ->nullable()
                ->after('school_locked_mode')
                ->comment('Timestamp when the school was first approved.');

            // ── App Key (School-Locked mode) ──────────────────────────────────
            // Generated once on approval. Embedded in the APK via dart-define.
            // The backend validates this key via X-App-Key header middleware.
            $table->string('app_key', 128)
                ->nullable()
                ->unique()
                ->after('approved_at')
                ->comment('Cryptographically random key embedded in school-locked APK builds.');

            // ── Build lifecycle ────────────────────────────────────────────────
            $table->enum('build_status', ['not_built', 'building', 'built', 'failed'])
                ->default('not_built')
                ->after('app_key')
                ->comment('Current build state of this school\'s APK.');

            $table->timestamp('last_built_at')
                ->nullable()
                ->after('build_status')
                ->comment('When the last successful build completed.');

            $table->string('last_built_release', 30)
                ->nullable()
                ->after('last_built_at')
                ->comment('Version tag of the last successful build, e.g. v2.0.0.');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->dropUnique(['school_code']);
            $table->dropUnique(['app_key']);
            $table->dropColumn([
                'school_code',
                'is_active',
                'school_locked_mode',
                'approved_at',
                'app_key',
                'build_status',
                'last_built_at',
                'last_built_release',
            ]);
        });
    }
};
