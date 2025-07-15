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
        Schema::create('halaqah_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('halaqah_id')->constrained('halaqahs')->onDelete('cascade')->comment('FK to halaqahs table');
            $table->enum('day_of_week', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])->comment('Day of the week');
            $table->time('start_time')->comment('Start time');
            $table->time('end_time')->comment('End time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('halaqah_schedules');
    }
};
