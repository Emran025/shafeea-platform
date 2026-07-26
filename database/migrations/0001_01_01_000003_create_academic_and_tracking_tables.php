<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // frequency_types
        Schema::create('frequency_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Frequency type name');
            $table->string('code')->nullable()->unique();
            $table->integer('days_between')->nullable()->comment('Number of days between occurrences');
            $table->string('description')->nullable()->comment('Description (optional)');
            $table->timestamps();
        });

        // units
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable()->comment('Unit code');
            $table->string('name_ar')->nullable()->comment('Unit name in Arabic');
            $table->string('name')->nullable()->comment('Unit name');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // tracking_types
        Schema::create('tracking_types', function (Blueprint $table) {
            $table->id();
            $table->string('name_en')->nullable()->comment('Tracking type name in English');
            $table->string('name_ar')->nullable()->comment('Tracking type name in Arabic');
            $table->string('name')->nullable();
            $table->string('code')->nullable()->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // tracking_units
        Schema::create('tracking_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->nullable()->constrained('units')->onDelete('cascade')->comment('FK to units table');
            $table->foreignId('tracking_type_id')->nullable()->constrained('tracking_types')->onDelete('cascade');
            $table->string('from_surah')->nullable()->comment('From Surah');
            $table->integer('from_page')->nullable()->comment('From page');
            $table->integer('from_ayah')->nullable()->comment('From ayah');
            $table->string('to_surah')->nullable()->comment('To Surah');
            $table->integer('to_page')->nullable()->comment('To page');
            $table->integer('to_ayah')->nullable()->comment('To ayah');
            $table->integer('quantity')->default(1);
            $table->timestamps();
        });

        // teachers
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade')->comment('FK to users table, unique per teacher');
            $table->foreignId('school_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('username')->nullable()->unique();
            $table->string('phone')->nullable();
            $table->string('specialization')->nullable();
            $table->text('bio')->nullable()->comment('Teacher biography');
            $table->integer('experience_years')->default(0)->comment('Years of teaching experience');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes()->comment('Soft delete timestamp');
        });

        // students
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade')->comment('FK to users table, unique per student');
            $table->foreignId('school_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('username')->nullable()->unique();
            $table->string('qualification')->nullable()->comment('Student qualification');
            $table->string('memorization_level')->nullable()->comment('Memorization level');
            $table->string('guardian_phone')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('gender')->nullable();
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->comment('Student status');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes()->comment('Soft delete timestamp');
        });

        // halaqahs
        Schema::create('halaqahs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade')->comment('FK to schools table');
            $table->string('name')->comment('Halaqah name');
            $table->string('avatar')->nullable()->comment('Avatar (base64 or URL)');
            $table->text('description')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable()->comment('Gender of halaqah');
            $table->string('residence')->nullable()->comment('Residence');
            $table->integer('max_students')->default(20)->comment('Maximum number of students');
            $table->integer('sum_of_students')->default(0)->comment('Current number of students');
            $table->integer('capacity')->default(20);
            $table->boolean('is_active')->default(true)->comment('Is halaqah active');
            $table->boolean('is_deleted')->default(false)->comment('Is halaqah deleted');
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('cascade')->comment('FK to teachers table');
            $table->timestamps();
            $table->softDeletes()->comment('Soft delete timestamp');
        });

        Schema::create('halaqah_teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('halaqah_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->boolean('is_primary')->default(true);
            $table->timestamps();

            $table->unique(['halaqah_id', 'teacher_id']);
        });

        Schema::create('halaqah_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('halaqah_id')->constrained()->onDelete('cascade');
            $table->string('day_of_week');
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
        });

        Schema::create('halaqah_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('halaqah_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->text('note');
            $table->timestamps();
        });

        // enrollments
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade')->comment('FK to students table');
            $table->foreignId('halaqah_id')->constrained('halaqahs')->onDelete('cascade')->comment('FK to halaqahs table');
            $table->string('status')->default('active');
            $table->timestamp('enrolled_at')->nullable()->comment('Enrollment timestamp');
            $table->timestamps();

            $table->unique(['student_id', 'halaqah_id']);
        });

        Schema::create('enrollment_plan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained('enrollments')->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('plans')->onDelete('cascade');
            $table->boolean('is_current')->default(false);
            $table->timestamps();
        });

        Schema::create('student_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade')->comment('FK to students table');
            $table->foreignId('halaqah_id')->nullable()->constrained('halaqahs')->onDelete('cascade');
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('cascade');
            $table->date('report_date')->comment('Date of the report');
            $table->text('summary')->nullable()->comment('Summary of the report');
            $table->text('notes')->nullable();
            $table->json('details')->nullable()->comment('Detailed report data (optional)');
            $table->integer('attendance_status')->default(1);
            $table->float('behavior')->nullable();
            $table->timestamps();
        });

        // applicants
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('school_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('username')->nullable()->unique();
            $table->string('phone')->nullable();
            $table->string('type')->default('student');
            $table->enum('application_type', ['teacher', 'student'])->nullable();
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected'])->default('pending');
            $table->text('bio')->nullable();
            $table->text('qualifications')->nullable()->comment('Academic certificate or higher academic qualification');
            $table->string('memorization_level')->nullable()->default('0');
            $table->text('rejection_reason')->nullable();
            $table->json('application_data')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('applicant_rejections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_id')->constrained()->onDelete('cascade');
            $table->text('reason');
            $table->foreignId('rejected_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // tracking
        Schema::create('trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->nullable()->constrained('enrollments')->onDelete('cascade')->comment('FK to enrollments table');
            $table->foreignId('student_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('halaqah_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('tracking_type_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('frequency_type_id')->nullable()->constrained()->onDelete('cascade');
            $table->date('date')->comment('Tracking date');
            $table->string('note')->nullable()->comment('Tracking note (optional)');
            $table->float('behavior_note', 2)->nullable()->comment('Behavior note (0-5 scale, optional)');
            $table->string('status')->default('completed');
            $table->timestamps();
        });

        Schema::create('tracking_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracking_id')->constrained('trackings')->onDelete('cascade')->comment('FK to trackings table');
            $table->foreignId('tracking_type_id')->nullable()->constrained('tracking_types')->onDelete('cascade')->comment('FK to tracking_types table');
            $table->foreignId('unit_id')->nullable()->constrained('units')->onDelete('cascade');
            $table->foreignId('from_tracking_unit_id')->nullable()->constrained('tracking_units')->onDelete('cascade')->comment('FK to tracking_units (from)');
            $table->foreignId('to_tracking_unit_id')->nullable()->constrained('tracking_units')->onDelete('cascade')->comment('FK to tracking_units (to)');
            $table->integer('start_position')->nullable();
            $table->integer('end_position')->nullable();
            $table->decimal('gap', 7, 4)->nullable()->comment('Last position reached: Page.Ayah (e.g., 21.141)');
            $table->integer('actual_amount')->nullable()->comment('Actual amount tracked');
            $table->string('comment')->nullable()->comment('Comment (optional)');
            $table->float('score', 3)->nullable()->comment('Score (optional)');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('mistakes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracking_detail_id')->constrained('tracking_details')->onDelete('cascade');
            $table->integer('ayahId_quran')->nullable();
            $table->integer('wordIndex')->nullable();
            $table->integer('mistakeTypeId')->nullable();
            $table->string('type')->nullable();
            $table->integer('count')->default(1);
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mistakes');
        Schema::dropIfExists('tracking_details');
        Schema::dropIfExists('trackings');
        Schema::dropIfExists('applicant_rejections');
        Schema::dropIfExists('applicants');
        Schema::dropIfExists('student_reports');
        Schema::dropIfExists('enrollment_plan');
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('halaqah_notes');
        Schema::dropIfExists('halaqah_schedules');
        Schema::dropIfExists('halaqah_teachers');
        Schema::dropIfExists('halaqahs');
        Schema::dropIfExists('students');
        Schema::dropIfExists('teachers');
        Schema::dropIfExists('tracking_units');
        Schema::dropIfExists('tracking_types');
        Schema::dropIfExists('units');
        Schema::dropIfExists('frequency_types');
    }
};
