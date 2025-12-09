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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->enum('certificate_type', [
                'شهادة حفظ قران',
                'شهادة إجازة في القران',
                'سيرة ذاتية',
                'Other',
            ]);
            $table->string('certificate_type_other')->nullable();
            $table->enum('riwayah', [
                'قراءة الإمام نافع المدني',
                'قراءة الإمام عبد الله بن كثير المكي',
                'قراءة الإمام أبو عمرو البصري',
                'قراءة الإمام بن عامر الدمشقي',
                'قراءة الإمام عاصم بن أبي النجود الكوفي',
                'قراءة الإمام حمزة الزيات',
                'قراءة الإمام الكسائي',
                'قراءة الإمام أبو جعفر المدني',
                'قراءة الإمام يعقوب الحضرمي',
                'قراءة الإمام خلف العاشر',
            ])->nullable();
            $table->string('issuing_place')->nullable();
            $table->date('issuing_date')->nullable();
            $table->string('file_path');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
