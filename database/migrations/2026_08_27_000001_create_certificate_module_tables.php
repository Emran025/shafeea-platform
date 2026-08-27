<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Keys for Digital Signature per School
        Schema::create('school_crypto_keys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->text('public_key');
            $table->text('private_key'); // Should be encrypted at rest in a real app
            $table->timestamps();
        });

        // 2. Certificate Templates
        Schema::create('certificate_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('background_image_path');
            $table->string('font_file_path')->nullable();
            $table->json('fields_config')->nullable(); // { "name": {"x": 100, "y": 200, "size": 24, "color": "#000"} }
            $table->timestamps();
        });

        // 3. Generated Certificates
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->foreignId('certificate_template_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('recipient_name');
            $table->string('recipient_phone')->nullable();
            $table->string('recipient_whatsapp')->nullable();
            $table->json('data_payload')->nullable(); // Full excel row data
            $table->string('file_path_pdf')->nullable();
            $table->string('file_path_jpg')->nullable();
            $table->text('digital_signature')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('certificate_templates');
        Schema::dropIfExists('school_crypto_keys');
    }
};
