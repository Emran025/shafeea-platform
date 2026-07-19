<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds per-school build configuration columns.
     * Sensitive values (keystore passwords) are encrypted at rest by the School model
     * using Laravel's Crypt facade before storage and decrypted on read.
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
            $table->longText('keystore_file')
                ->nullable()
                ->after('last_built_release')
                ->comment('Base64-encoded Android keystore (JKS/PKCS12). Decoded by the build script at runtime.');

            $table->string('keystore_store_password', 1024)
                ->nullable()
                ->after('keystore_file')
                ->comment('ENCRYPTED store password for the keystore. Decrypted by School model accessor.');

            $table->string('keystore_key_alias', 255)
                ->nullable()
                ->after('keystore_store_password')
                ->comment('Key alias inside the keystore.');

            $table->string('keystore_key_password', 1024)
                ->nullable()
                ->after('keystore_key_alias')
                ->comment('ENCRYPTED key password. Decrypted by School model accessor.');

            // ── Build notes ────────────────────────────────────────────────────
            $table->text('build_notes')
                ->nullable()
                ->after('keystore_key_password')
                ->comment('Free-form notes for the platform operator about this school\'s build configuration.');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->dropColumn([
                'keystore_file',
                'keystore_store_password',
                'keystore_key_alias',
                'keystore_key_password',
                'build_notes',
            ]);
        });
    }
};
