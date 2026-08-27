<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificate_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->foreignId('certificate_template_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->integer('total_count')->default(0);
            $table->integer('processed_count')->default(0);
            $table->timestamps();
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->foreignId('certificate_batch_id')->nullable()->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('certificates', function (Blueprint $table) {
            $table->dropForeign(['certificate_batch_id']);
            $table->dropColumn('certificate_batch_id');
        });
        Schema::dropIfExists('certificate_batches');
    }
};
