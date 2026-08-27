<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('call_sessions', function (Blueprint $table) {
            $table->id();
            $table->uuid('session_id')->unique();
            $table->foreignId('initiator_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('target_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('third_party_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('status', ['pending', 'active', 'ended', 'rejected'])->default('pending');
            $table->text('initiator_rsa_pub')->nullable();
            $table->text('target_rsa_pub')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('call_sessions');
    }
};
