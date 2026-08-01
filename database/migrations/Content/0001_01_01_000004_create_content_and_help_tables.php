<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->nullable()->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // content_types
        Schema::create('content_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('code')->unique()->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // tags
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('tag_name');
            $table->string('tag_slug')->unique();
            $table->timestamps();
        });

        // faqs
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('cascade');
            $table->foreignId('school_id')->nullable()->constrained('schools')->onDelete('set null');
            $table->string('locale', 8)->default('en');
            $table->text('question');
            $table->text('answer');
            $table->integer('display_order')->default(0);
            $table->integer('sort_order')->default(0);
            $table->integer('view_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_published')->default(true);
            $table->string('search_terms')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('published_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('faq_tag', function (Blueprint $table) {
            $table->foreignId('faq_id')->constrained()->onDelete('cascade');
            $table->foreignId('tag_id')->constrained()->onDelete('cascade');
            $table->primary(['faq_id', 'tag_id']);
        });

        // documents
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('title')->nullable();
            $table->string('name')->nullable();
            $table->enum('certificate_type', [
                'شهادة حفظ قران',
                'شهادة إجازة في القران',
                'سيرة ذاتية',
                'Other',
            ])->nullable();
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
            $table->string('file_path')->nullable();
            $table->string('file_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->timestamps();
        });

        // help_tickets
        Schema::create('help_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('organization')->nullable();
            $table->string('subject');
            $table->string('message_type')->default('other');
            $table->text('message')->nullable();
            $table->text('body')->nullable();
            $table->string('status')->default('pending');
            $table->string('priority')->default('medium');
            $table->timestamps();
        });

        // services
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('category')->nullable()->index();
            $table->string('title');
            $table->text('description');
            $table->string('icon')->nullable()->default('Users');
            $table->string('image')->nullable();
            $table->json('features')->nullable();
            $table->json('benefits')->nullable();
            $table->boolean('popular')->default(false);
            $table->string('theme')->default('blue');
            $table->integer('display_order')->default(0)->index();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        // landing_page_settings
        Schema::create('landing_page_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string');
            $table->timestamps();
        });

        // privacy_policies
        Schema::create('privacy_policies', function (Blueprint $table) {
            $table->id();
            $table->string('version', 50);
            $table->dateTime('last_updated')->nullable();
            $table->json('summary_json')->nullable();
            $table->json('sections_json')->nullable();
            $table->text('changelog')->nullable();
            $table->boolean('required_consent')->default(true);
            $table->longText('content')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('effective_at')->nullable();
            $table->timestamps();
        });

        // terms_of_uses
        Schema::create('terms_of_uses', function (Blueprint $table) {
            $table->id();
            $table->string('version', 50);
            $table->dateTime('last_updated')->nullable();
            $table->json('summary_json')->nullable();
            $table->json('sections_json')->nullable();
            $table->text('changelog')->nullable();
            $table->boolean('required_consent')->default(true);
            $table->longText('content')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('effective_at')->nullable();
            $table->timestamps();
        });

        // notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('terms_of_uses');
        Schema::dropIfExists('privacy_policies');
        Schema::dropIfExists('landing_page_settings');
        Schema::dropIfExists('services');
        Schema::dropIfExists('help_tickets');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('faq_tag');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('content_types');
        Schema::dropIfExists('categories');
    }
};
