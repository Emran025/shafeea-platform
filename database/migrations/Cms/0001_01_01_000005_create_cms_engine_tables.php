<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // cms_platforms
        Schema::create('cms_platforms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // cms_product_sites
        Schema::create('cms_product_sites', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('site_scope')->unique();
            $table->string('name');
            $table->string('domain')->nullable();
            $table->uuid('platform_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('platform_id')->references('id')->on('cms_platforms')->onDelete('set null');
        });

        // cms_pages
        Schema::create('cms_pages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('site_scope');
            $table->string('title');
            $table->string('slug');
            $table->string('type')->default('custom');
            $table->string('status')->default('draft');
            $table->string('author')->nullable();
            $table->json('metadata_json')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['site_scope', 'slug']);
            $table->foreign('site_scope')->references('site_scope')->on('cms_product_sites')->onDelete('cascade');
        });

        // cms_media
        Schema::create('cms_media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('site_scope');
            $table->string('filename');
            $table->string('file_path');
            $table->string('mime_type');
            $table->unsignedBigInteger('file_size');
            $table->timestamps();
        });

        // cms_sections
        Schema::create('cms_sections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('page_id');
            $table->string('type');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamp('visible_from')->nullable();
            $table->timestamp('visible_until')->nullable();
            $table->json('styling')->nullable();
            $table->timestamps();

            $table->foreign('page_id')->references('id')->on('cms_pages')->onDelete('cascade');
        });

        // cms_blocks
        Schema::create('cms_blocks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->json('content')->nullable();
            $table->uuid('media_id')->nullable();
            $table->timestamps();

            $table->foreign('media_id')->references('id')->on('cms_media')->onDelete('set null');
        });

        // cms_section_blocks
        Schema::create('cms_section_blocks', function (Blueprint $table) {
            $table->uuid('section_id');
            $table->uuid('block_id');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->primary(['section_id', 'block_id']);
            $table->foreign('section_id')->references('id')->on('cms_sections')->onDelete('cascade');
            $table->foreign('block_id')->references('id')->on('cms_blocks')->onDelete('cascade');
        });

        // cms_status_transitions
        Schema::create('cms_status_transitions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('page_id');
            $table->string('from_status');
            $table->string('to_status');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->foreign('page_id')->references('id')->on('cms_pages')->onDelete('cascade');
        });

        // cms_publish_bundles
        Schema::create('cms_publish_bundles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('site_scope');
            $table->string('name');
            $table->string('status')->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('cms_publish_bundle_members', function (Blueprint $table) {
            $table->uuid('bundle_id');
            $table->uuid('page_id');
            $table->timestamps();

            $table->primary(['bundle_id', 'page_id']);
            $table->foreign('bundle_id')->references('id')->on('cms_publish_bundles')->onDelete('cascade');
            $table->foreign('page_id')->references('id')->on('cms_pages')->onDelete('cascade');
        });

        Schema::create('cms_publish_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('page_id');
            $table->string('event_type');
            $table->json('payload')->nullable();
            $table->timestamps();

            $table->foreign('page_id')->references('id')->on('cms_pages')->onDelete('cascade');
        });

        // navigation
        Schema::create('cms_navigation_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('site_scope');
            $table->string('code');
            $table->string('name');
            $table->timestamps();

            $table->unique(['site_scope', 'code']);
        });

        Schema::create('cms_navigation_columns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('navigation_group_id');
            $table->string('title');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('navigation_group_id')->references('id')->on('cms_navigation_groups')->onDelete('cascade');
        });

        Schema::create('cms_navigation_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('navigation_column_id');
            $table->string('label');
            $table->string('url');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('navigation_column_id')->references('id')->on('cms_navigation_columns')->onDelete('cascade');
        });

        // cms_topics & newsroom
        Schema::create('cms_topics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('site_scope');
            $table->string('name');
            $table->string('slug');
            $table->timestamps();

            $table->unique(['site_scope', 'slug']);
        });

        Schema::create('cms_newsroom_links', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('site_scope');
            $table->string('title');
            $table->string('url');
            $table->timestamps();
        });

        // cms_faq & support
        Schema::create('cms_faq_categories', function (Blueprint $table) {
            $table->id();
            $table->string('site_scope')->nullable();
            $table->string('name');
            $table->string('slug', 120)->unique();
            $table->string('locale', 8)->default('en');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('cms_faqs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('cms_faq_categories')->onDelete('set null');
            $table->string('locale', 8)->default('en');
            $table->text('question');
            $table->text('answer');
            $table->string('search_terms')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('published_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('cms_support_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('site_scope')->nullable();
            $table->string('ticket_number', 32)->unique();
            $table->string('requester_name')->nullable();
            $table->string('requester_email')->nullable();
            $table->string('category', 64)->default('general');
            $table->string('priority', 16)->default('normal');
            $table->string('subject');
            $table->text('body')->nullable();
            $table->text('message')->nullable();
            $table->string('status', 32)->default('open');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('cms_email_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('site_scope')->nullable();
            $table->string('sender_name')->nullable();
            $table->string('sender_email')->nullable();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('subject')->nullable();
            $table->text('body')->nullable();
            $table->text('message')->nullable();
            $table->string('status', 32)->default('new');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamp('received_at')->useCurrent();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });

        Schema::create('cms_newsletter_subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('site_scope');
            $table->string('email');
            $table->timestamps();

            $table->unique(['site_scope', 'email']);
        });

        Schema::create('cms_entity_identities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('site_scope');
            $table->string('entity_type');
            $table->string('entity_id');
            $table->timestamps();
        });

        Schema::create('cms_admin_api_tokens', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('token_hash')->unique();
            $table->string('name');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        // school site scopes & workflow
        Schema::create('school_site_scopes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->string('site_scope')->unique();
            $table->timestamps();
        });

        Schema::create('school_workflow_transitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->string('from_status');
            $table->string('to_status');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('school_workflow_transitions');
        Schema::dropIfExists('school_site_scopes');
        Schema::dropIfExists('cms_admin_api_tokens');
        Schema::dropIfExists('cms_entity_identities');
        Schema::dropIfExists('cms_newsletter_subscriptions');
        Schema::dropIfExists('cms_email_inquiries');
        Schema::dropIfExists('cms_support_tickets');
        Schema::dropIfExists('cms_faqs');
        Schema::dropIfExists('cms_faq_categories');
        Schema::dropIfExists('cms_newsroom_links');
        Schema::dropIfExists('cms_topics');
        Schema::dropIfExists('cms_navigation_entries');
        Schema::dropIfExists('cms_navigation_columns');
        Schema::dropIfExists('cms_navigation_groups');
        Schema::dropIfExists('cms_publish_events');
        Schema::dropIfExists('cms_publish_bundle_members');
        Schema::dropIfExists('cms_publish_bundles');
        Schema::dropIfExists('cms_status_transitions');
        Schema::dropIfExists('cms_section_blocks');
        Schema::dropIfExists('cms_blocks');
        Schema::dropIfExists('cms_sections');
        Schema::dropIfExists('cms_media');
        Schema::dropIfExists('cms_pages');
        Schema::dropIfExists('cms_product_sites');
        Schema::dropIfExists('cms_platforms');
    }
};
