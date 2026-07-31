<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // countries
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('code', 5)->unique();
            $table->string('phone_code', 10);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // users
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            $table->string('avatar')->nullable()->comment('User avatar URL or path');
            $table->string('phone')->nullable()->comment('User phone number');
            $table->string('phone_zone')->default('+967')->comment('User phone country/zone code');
            $table->string('whatsapp')->nullable()->comment('WhatsApp contact number');
            $table->string('whatsapp_zone')->default('+967')->comment('WhatsApp country/zone code');

            $table->enum('gender', ['Male', 'Female'])->nullable()->comment('User gender');
            $table->date('birth_date')->nullable()->comment('Date of birth');
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('residence')->nullable()->comment('Neighborhood or residence area');

            $table->enum('status', ['active', 'inactive'])->default('inactive')->comment('User status');

            $table->foreignId('school_id')
                ->nullable()
                ->constrained('schools')
                ->onDelete('cascade');

            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        // devices
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('device_id');
            $table->string('device_name')->nullable();
            $table->string('platform')->nullable();
            $table->string('model')->nullable();
            $table->string('manufacturer')->nullable();
            $table->string('os_version')->nullable();
            $table->string('app_version')->nullable();
            $table->string('timezone')->nullable();
            $table->string('locale')->nullable();
            $table->text('fcm_token')->nullable();
            $table->timestamp('last_login_at')->useCurrent();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // admins
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade')->comment('FK to users table, unique per admin');
            $table->string('name')->nullable();
            $table->string('email')->nullable()->unique();
            $table->boolean('is_super_admin')->default(false);
            $table->boolean('super_admin')->default(false)->comment('Is super admin');
            $table->enum('status', ['pending', 'accepted', 'rejected', 'suspended'])->default('pending');
            $table->timestamps();
            $table->softDeletes()->comment('Soft delete timestamp');
        });

        // roles & permissions
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('role_user', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->primary(['role_id', 'user_id']);
        });

        Schema::create('permission_role', function (Blueprint $table) {
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->primary(['permission_id', 'role_id']);
        });

        Schema::create('permission_user', function (Blueprint $table) {
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->primary(['permission_id', 'role_id']);
        });

        // user_consents
        Schema::create('user_consents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('consent_type');
            $table->boolean('agreed')->default(true);
            $table->timestamp('agreed_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_consents');
        Schema::dropIfExists('permission_user');
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('admins');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('devices');
        Schema::dropIfExists('users');
        Schema::dropIfExists('countries');
    }
};
