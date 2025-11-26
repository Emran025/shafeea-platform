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
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade')->comment('FK to students table');
            $table->foreignId('halaqah_id')->constrained('halaqahs')->onDelete('cascade')->comment('FK to halaqahs table');
            $table->timestamp('enrolled_at')->comment('Enrollment timestamp');
            // $table->foreignId('plan_id')->constrained('plans')->onDelete('cascade')->comment('FK to plans table');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
