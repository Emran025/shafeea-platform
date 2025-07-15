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
        Schema::create('halaqahs', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Halaqah name');
            $table->string('avatar')->comment('Avatar (base64 or URL)');
            $table->enum('gender', ['Male', 'Female'])->comment('Gender of halaqah');
            $table->string('residence')->comment('Residence');
            $table->integer('max_students')->comment('Maximum number of students');
            $table->integer('sum_of_students')->default(0)->comment('Current number of students');
            $table->boolean('is_active')->default(true)->comment('Is halaqah active');
            $table->boolean('is_deleted')->default(false)->comment('Is halaqah deleted');
            $table->foreignId('teacher_id')->constrained('teachers')->onDelete('cascade')->comment('FK to teachers table');
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade')->comment('FK to schools table');
            $table->timestamps();
            $table->softDeletes()->comment('Soft delete timestamp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('halaqahs');
    }
};
