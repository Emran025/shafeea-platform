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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('category')->index(); // management, education, analytics, communication, technology
            $table->string('title');
            $table->text('description');
            $table->string('icon')->default('Users'); // Icon name from lucide-react (Users, BookOpen, etc.)
            $table->string('image')->nullable(); // Path to service image
            $table->json('features')->nullable(); // Array of feature strings
            $table->json('benefits')->nullable(); // Array of benefit strings
            $table->boolean('popular')->default(false);
            $table->string('theme')->default('blue'); // blue, indigo, emerald, rose, amber, violet, cyan, orange
            $table->integer('display_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
