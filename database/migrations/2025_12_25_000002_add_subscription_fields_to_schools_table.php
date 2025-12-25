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
            $table->foreignId('current_plan_id')->nullable()->constrained('subscription_plans')->onDelete('set null');
            $table->enum('subscription_status', ['active', 'past_due', 'canceled', 'pending_payment'])->default('pending_payment');
            $table->timestamp('subscription_ends_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->dropForeign(['current_plan_id']);
            $table->dropColumn(['current_plan_id', 'subscription_status', 'subscription_ends_at']);
        });
    }
};
