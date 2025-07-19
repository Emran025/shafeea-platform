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
        Schema::create('student_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade')->comment('FK to students table');
            $table->date('report_date')->comment('Date of the report');
            $table->text('summary')->comment('Summary of the report');
            $table->json('details')->nullable()->comment('Detailed report data (optional)');
            $table->float('behavior')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_reports');
    }
};
