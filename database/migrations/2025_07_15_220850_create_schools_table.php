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
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('School name');
            $table->string('logo')->comment('School avatar URL');
            $table->string('phone')->comment('School contact phone');
            $table->string('country')->comment('Country');
            $table->string('city')->comment('City');
            $table->string('location')->comment('Location description');
            $table->string('address')->comment('Full address');
            $table->timestamps();
            $table->softDeletes()->comment('Soft delete timestamp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
