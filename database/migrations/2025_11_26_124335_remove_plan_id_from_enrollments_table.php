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
        Schema::table('enrollments', function (Blueprint $table) {
            // Drop the foreign key constraint first
            $table->dropForeign(['plan_id']);
            // Then drop the column
            $table->dropColumn('plan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->foreignId('plan_id')->constrained('plans')->onDelete('cascade')->comment('FK to plans table');
        });
    }
};
