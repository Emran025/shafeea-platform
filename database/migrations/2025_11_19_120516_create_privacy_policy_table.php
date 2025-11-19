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
        Schema::create('privacy_policy', function (Blueprint $table) {
            $table->string('version', 50)->primary();
            $table->dateTime('last_updated');
            $table->json('summary_json');
            $table->json('sections_json');
            $table->text('changelog')->nullable();
            $table->boolean('required_consent')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('privacy_policy');
    }
};
