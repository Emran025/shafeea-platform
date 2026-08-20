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
            // ── Android signing credentials ────────────────────────────────────
            // The keystore file (base64-encoded JKS or PKCS12) and its
            // associated credentials are stored per school so that CI can
            // sign the APK without storing secrets in GitHub.
            //
            // SECURITY: keystore_store_password and keystore_key_password are
            // stored ENCRYPTED using Laravel Crypt::encryptString().
            // The School model transparently encrypts on set and decrypts on get.
            if (! Schema::hasColumn('schools', 'keystore_file')) {
                $table->longText('keystore_file')
                    ->nullable()
                    ->after('last_built_release')
                    ->comment('Base64-encoded Android keystore (JKS/PKCS12). Decoded by the build script at runtime.');
            }

            if (! Schema::hasColumn('schools', 'keystore_store_password')) {
                $table->string('keystore_store_password', 1024)
                    ->nullable()
                    ->after('keystore_file')
                    ->comment('ENCRYPTED store password for the keystore. Decrypted by School model accessor.');
            }

            if (! Schema::hasColumn('schools', 'keystore_key_alias')) {
                $table->string('keystore_key_alias', 255)
                    ->nullable()
                    ->after('keystore_store_password')
                    ->comment('Key alias inside the keystore.');
            }

            if (! Schema::hasColumn('schools', 'keystore_key_password')) {
                $table->string('keystore_key_password', 1024)
                    ->nullable()
                    ->after('keystore_key_alias')
                    ->comment('ENCRYPTED key password. Decrypted by School model accessor.');
            }

            // ── Build notes ────────────────────────────────────────────────────
            if (! Schema::hasColumn('schools', 'build_notes')) {
                $table->text('build_notes')
                    ->nullable()
                    ->after('keystore_key_password')
                    ->comment('Free-form notes for the platform operator about this school\'s build configuration.');
            }

            // ── Identity ──────────────────────────────────────────────────────
            // school_code is the globally unique slug used as:
            //   • subdomain prefix  ({school_code}.shafeea.systems360.cloud)
            //   • Flutter package name suffix
            //   • APK filename prefix
            //   • branding identifier during build
            // IMMUTABLE once approved_at is set.
            if (! Schema::hasColumn('schools', 'school_code')) {
                $table->string('school_code', 60)
                    ->nullable()
                    ->unique()
                    ->after('address')
                    ->comment('Globally unique slug — used as subdomain, package ID, and APK name prefix. Immutable after approval.');
            }

            // ── Status flags ─────────────────────────────────────────────────
            if (! Schema::hasColumn('schools', 'is_active')) {
                $table->boolean('is_active')
                    ->default(false)
                    ->after('school_code')
                    ->comment('True once the school is approved and operational.');
            }

            // ── Application operating mode ────────────────────────────────────
            // true  → School-Locked: app_key is embedded in the APK and all
            //         API requests are scoped to this school.
            // false → General Mode: no school restriction embedded in the APK.
            if (! Schema::hasColumn('schools', 'school_locked_mode')) {
                $table->boolean('school_locked_mode')
                    ->default(true)
                    ->after('is_active')
                    ->comment('Determines whether a school-scoped app_key is embedded during the build.');
            }

            // ── Approval tracking ─────────────────────────────────────────────
            if (! Schema::hasColumn('schools', 'approved_at')) {
                $table->timestamp('approved_at')
                    ->nullable()
                    ->after('school_locked_mode')
                    ->comment('Timestamp when the school was first approved.');
            }

            // ── App Key (School-Locked mode) ──────────────────────────────────
            // Generated once on approval. Embedded in the APK via dart-define.
            // The backend validates this key via X-App-Key header middleware.
            if (! Schema::hasColumn('schools', 'app_key')) {
                $table->string('app_key', 128)
                    ->nullable()
                    ->unique()
                    ->after('approved_at')
                    ->comment('Cryptographically random key embedded in school-locked APK builds.');
            }

            // ── Build lifecycle ────────────────────────────────────────────────
            if (! Schema::hasColumn('schools', 'build_status')) {
                $table->enum('build_status', ['not_built', 'building', 'built', 'failed'])
                    ->default('not_built')
                    ->after('app_key')
                    ->comment('Current build state of this school\'s APK.');
            }

            if (! Schema::hasColumn('schools', 'last_built_at')) {
                $table->timestamp('last_built_at')
                    ->nullable()
                    ->after('build_status')
                    ->comment('When the last successful build completed.');
            }

            if (! Schema::hasColumn('schools', 'last_built_release')) {
                $table->string('last_built_release', 30)
                    ->nullable()
                    ->after('last_built_at')
                    ->comment('Version tag of the last successful build, e.g. v2.0.0.');
            }
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
                'keystore_file',
                'keystore_store_password',
                'keystore_key_alias',
                'keystore_key_password',
                'build_notes',
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
