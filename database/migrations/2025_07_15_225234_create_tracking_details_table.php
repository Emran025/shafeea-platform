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
        Schema::create('tracking_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracking_id')->constrained('trackings')->onDelete('cascade')->comment('FK to trackings table');
            $table->foreignId('tracking_type_id')->constrained('tracking_types')->onDelete('cascade')->comment('FK to tracking_types table');
            $table->foreignId('from_tracking_unit_id')->constrained('tracking_units')->onDelete('cascade')->comment('FK to tracking_units (from)');
            $table->foreignId('to_tracking_unit_id')->constrained('tracking_units')->onDelete('cascade')->comment('FK to tracking_units (to)');
            $table->integer('actual_amount')->comment('Actual amount tracked');
            $table->string('comment')->nullable()->comment('Comment (optional)');
            $table->float('score', 3)->nullable()->comment('Score (optional)');
            $table->timestamps();
        });

        Schema::create('mistakes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracking_detail_id')->constrained('tracking_details')->onDelete('cascade');
            $table->integer('ayahId_quran');
            $table->integer('wordIndex');
            $table->integer('mistakeTypeId');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mistakes');
        Schema::dropIfExists('tracking_details');
    }
};
