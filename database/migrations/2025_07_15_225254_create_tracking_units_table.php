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
        Schema::create('tracking_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained('units')->onDelete('cascade')->comment('FK to units table');
            $table->string('from_surah')->comment('From Surah');
            $table->integer('from_page')->comment('From page');
            $table->integer('from_ayah')->comment('From ayah');
            $table->string('to_surah')->comment('To Surah');
            $table->integer('to_page')->comment('To page');
            $table->integer('to_ayah')->comment('To ayah');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracking_units');
    }
};
