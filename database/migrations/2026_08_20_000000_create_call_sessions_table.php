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
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            
            // Initiator of the call (usually student)
            $table->foreignId('initiator_id')->constrained('users')->cascadeOnDelete();
            
            // The teacher/supervisor requested to join
            $table->foreignId('target_id')->constrained('users')->cascadeOnDelete();
            
            // Optional third participant (e.g. supervisor or peer)
            $table->foreignId('third_party_id')->nullable()->constrained('users')->nullOnDelete();

            $table->enum('status', ['requested', 'active', 'rejected', 'completed', 'failed'])->default('requested');
            
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->integer('duration_seconds')->nullable();
            
            // For P2P connection logging and audit
            $table->json('metadata')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('call_sessions');
    }
};
