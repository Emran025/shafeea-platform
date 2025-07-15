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
        Schema::create('halaqah_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('halaqah_id')->constrained('halaqahs')->onDelete('cascade')->comment('FK to halaqahs table');
            $table->foreignId('admin_id')->constrained('admins')->onDelete('cascade')->comment('FK to admins table');
            $table->text('note')->comment('Note text');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('halaqah_notes');
    }
};
