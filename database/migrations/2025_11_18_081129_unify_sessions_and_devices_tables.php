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
        Schema::table('sessions', function (Blueprint $table) {
            $table->string('device_id')->nullable()->after('user_agent');
            $table->string('model')->nullable()->after('device_id');
            $table->string('manufacturer')->nullable()->after('model');
            $table->string('os_version')->nullable()->after('manufacturer');
            $table->string('app_version')->nullable()->after('os_version');
            $table->string('timezone')->nullable()->after('app_version');
            $table->string('locale')->nullable()->after('timezone');
            $table->text('fcm_token')->nullable()->after('locale');
            $table->timestamp('login_time')->nullable()->after('fcm_token');
        });

        Schema::dropIfExists('devices');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sessions', function (Blueprint $table) {
            $table->dropColumn([
                'device_id',
                'model',
                'manufacturer',
                'os_version',
                'app_version',
                'timezone',
                'locale',
                'fcm_token',
                'login_time',
            ]);
        });

        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('device_id');
            $table->string('model')->nullable();
            $table->string('manufacturer')->nullable();
            $table->string('os_version')->nullable();
            $table->string('app_version')->nullable();
            $table->string('timezone')->nullable();
            $table->string('locale')->nullable();
            $table->text('fcm_token')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'device_id']);
        });
    }
};
