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

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
