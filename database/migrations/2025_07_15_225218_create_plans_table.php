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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Plan name');
            $table->text('description')->comment('Plan description');
            $table->date('start_date')->comment('Plan start date');
            $table->date('end_date')->comment('Plan end date');
            $table->boolean('has_review')->default(false)->comment('Has review section');
            $table->foreignId('review_unit_id')->nullable()->constrained('units')->onDelete('set null')->comment('FK to units for review');
            $table->integer('review_amount')->nullable()->comment('Amount for review');
            $table->boolean('has_memorization')->default(false)->comment('Has memorization section');
            $table->foreignId('memorization_unit_id')->nullable()->constrained('units')->onDelete('set null')->comment('FK to units for memorization');
            $table->integer('memorization_amount')->nullable()->comment('Amount for memorization');
            $table->boolean('has_sard')->default(false)->comment('Has sard section');
            $table->foreignId('sard_unit_id')->nullable()->constrained('units')->onDelete('set null')->comment('FK to units for sard');
            $table->integer('sard_amount')->nullable()->comment('Amount for sard');
            $table->foreignId('frequency_type_id')->constrained('frequency_types')->onDelete('cascade')->comment('FK to frequency_types');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
