<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── 1. platform_registry ───────────────────────────────────────────────
        if (! Schema::hasTable('platform_registry')) {
            Schema::create('platform_registry', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('code')->unique();
                $table->string('name');
                $table->text('description')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // ── 2. product_sites ──────────────────────────────────────────────────
        if (! Schema::hasTable('product_sites')) {
            Schema::create('product_sites', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('site_scope')->unique();
                $table->string('name');
                $table->string('domain')->nullable();
                $table->uuid('platform_id')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();

                $table->foreign('platform_id')->references('id')->on('platform_registry')->onDelete('set null');
            });
        }

        // ── 3. pages ──────────────────────────────────────────────────────────
        if (! Schema::hasTable('pages')) {
            Schema::create('pages', function (Blueprint $table) {
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
                $table->foreign('site_scope')->references('site_scope')->on('product_sites')->onDelete('cascade');
            });
        }

        // ── 4. media ──────────────────────────────────────────────────────────
        if (! Schema::hasTable('media')) {
            Schema::create('media', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('site_scope');
                $table->string('filename');
                $table->string('file_path');
                $table->string('mime_type');
                $table->unsignedBigInteger('file_size');
                $table->timestamps();
            });
        }

        // ── 5. sections ───────────────────────────────────────────────────────
        if (! Schema::hasTable('sections')) {
            Schema::create('sections', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('page_id');
                $table->string('type');
                $table->integer('sort_order')->default(0);
                $table->boolean('is_visible')->default(true);
                $table->timestamp('visible_from')->nullable();
                $table->timestamp('visible_until')->nullable();
                $table->json('styling')->nullable();
                $table->timestamps();

                $table->foreign('page_id')->references('id')->on('pages')->onDelete('cascade');
            });
        }

        // ── 6. blocks ─────────────────────────────────────────────────────────
        if (! Schema::hasTable('blocks')) {
            Schema::create('blocks', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('type');
                $table->json('content')->nullable();
                $table->uuid('media_id')->nullable();
                $table->timestamps();

                $table->foreign('media_id')->references('id')->on('media')->onDelete('set null');
            });
        }

        // ── 7. section_block ──────────────────────────────────────────────────
        if (! Schema::hasTable('section_block')) {
            Schema::create('section_block', function (Blueprint $table) {
                $table->uuid('section_id');
                $table->uuid('block_id');
                $table->integer('sort_order')->default(0);
                $table->timestamps();

                $table->primary(['section_id', 'block_id']);
                $table->foreign('section_id')->references('id')->on('sections')->onDelete('cascade');
                $table->foreign('block_id')->references('id')->on('blocks')->onDelete('cascade');
            });
        }

        // ── 8. status_transitions ──────────────────────────────────────────────
        if (! Schema::hasTable('status_transitions')) {
            Schema::create('status_transitions', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('page_id');
                $table->string('from_status');
                $table->string('to_status');
                $table->text('notes')->nullable();
                $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamps();

                $table->foreign('page_id')->references('id')->on('pages')->onDelete('cascade');
            });
        }

        // ── 9. publish_bundles ────────────────────────────────────────────────
        if (! Schema::hasTable('publish_bundles')) {
            Schema::create('publish_bundles', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('site_scope');
                $table->string('name');
                $table->string('status')->default('draft');
                $table->timestamp('published_at')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('publish_bundle_members')) {
            Schema::create('publish_bundle_members', function (Blueprint $table) {
                $table->uuid('bundle_id');
                $table->uuid('page_id');
                $table->timestamps();

                $table->primary(['bundle_id', 'page_id']);
                $table->foreign('bundle_id')->references('id')->on('publish_bundles')->onDelete('cascade');
                $table->foreign('page_id')->references('id')->on('pages')->onDelete('cascade');
            });
        }

        if (! Schema::hasTable('publish_events')) {
            Schema::create('publish_events', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('page_id');
                $table->string('event_type');
                $table->json('payload')->nullable();
                $table->timestamps();

                $table->foreign('page_id')->references('id')->on('pages')->onDelete('cascade');
            });
        }

        // ── 10. navigation ────────────────────────────────────────────────────
        if (! Schema::hasTable('navigation_groups')) {
            Schema::create('navigation_groups', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('site_scope');
                $table->string('code');
                $table->string('name');
                $table->timestamps();

                $table->unique(['site_scope', 'code']);
            });
        }

        if (! Schema::hasTable('navigation_columns')) {
            Schema::create('navigation_columns', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('navigation_group_id');
                $table->string('title');
                $table->integer('sort_order')->default(0);
                $table->timestamps();

                $table->foreign('navigation_group_id')->references('id')->on('navigation_groups')->onDelete('cascade');
            });
        }

        if (! Schema::hasTable('navigation_entries')) {
            Schema::create('navigation_entries', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('navigation_column_id');
                $table->string('label');
                $table->string('url');
                $table->integer('sort_order')->default(0);
                $table->timestamps();

                $table->foreign('navigation_column_id')->references('id')->on('navigation_columns')->onDelete('cascade');
            });
        }

        // ── 11. topics & newsroom ──────────────────────────────────────────────
        if (! Schema::hasTable('topics')) {
            Schema::create('topics', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->text('description')->nullable();
                $table->string('color', 16)->default('#3B82F6');
                $table->unsignedInteger('articles_count')->default(0);
                $table->timestamps();
            });
        }

        // ── 12. topic_user ────────────────────────────────────────────────────
        if (! Schema::hasTable('topic_user')) {
            Schema::create('topic_user', function (Blueprint $table) {
                $table->foreignId('topic_id')->constrained()->cascadeOnDelete();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->primary(['topic_id', 'user_id']);
            });
        }

        // ── 13. newsroom_links ────────────────────────────────────────────────
        if (! Schema::hasTable('newsroom_links')) {
            Schema::create('newsroom_links', function (Blueprint $table) {
                $table->id();
                $table->string('label');
                $table->string('href');
                $table->unsignedInteger('position')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // ── 14. faq_categories & faqs ──────────────────────────────────────────
        if (! Schema::hasTable('faq_categories')) {
            Schema::create('faq_categories', function (Blueprint $table) {
                $table->id();
                $table->string('site_scope')->nullable();
                $table->string('name');
                $table->string('slug', 120)->unique();
                $table->string('locale', 8)->default('en');
                $table->unsignedSmallInteger('sort_order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // faqs
        if (! Schema::hasTable('faqs')) {
            Schema::create('faqs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('category_id')->nullable()->constrained('faq_categories')->onDelete('cascade');
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
        }

        // ── 15. support_tickets & email_inquiries ──────────────────────────────
        if (! Schema::hasTable('support_tickets')) {
            Schema::create('support_tickets', function (Blueprint $table) {
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
        }

        if (! Schema::hasTable('email_inquiries')) {
            Schema::create('email_inquiries', function (Blueprint $table) {
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
        }

        if (! Schema::hasTable('newsletter_subscriptions')) {
            Schema::create('newsletter_subscriptions', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('site_scope');
                $table->string('email');
                $table->timestamps();

                $table->unique(['site_scope', 'email']);
            });
        }

        if (! Schema::hasTable('entity_identities')) {
            Schema::create('entity_identities', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('site_scope');
                $table->string('entity_type');
                $table->string('entity_id');
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('admin_api_tokens')) {
            Schema::create('admin_api_tokens', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('token_hash', 64)->unique();
                $table->timestamp('expires_at');
                $table->timestamp('last_used_at')->nullable();
                $table->timestamps();
                $table->index('expires_at');
            });
        }

        // ── 16. school site scopes & workflow ──────────────────────────────────
        if (! Schema::hasTable('school_site_scopes')) {
            Schema::create('school_site_scopes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('school_id')->constrained()->onDelete('cascade');
                $table->string('site_scope')->unique();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('school_workflow_transitions')) {
            Schema::create('school_workflow_transitions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('school_id')->constrained()->onDelete('cascade');
                $table->string('from_status');
                $table->string('to_status');
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('school_workflow_transitions');
        Schema::dropIfExists('school_site_scopes');
        Schema::dropIfExists('admin_api_tokens');
        Schema::dropIfExists('entity_identities');
        Schema::dropIfExists('newsletter_subscriptions');
        Schema::dropIfExists('email_inquiries');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('faq_categories');
        Schema::dropIfExists('newsroom_links');
        Schema::dropIfExists('topics');
        Schema::dropIfExists('topic_user');
        Schema::dropIfExists('navigation_entries');
        Schema::dropIfExists('navigation_columns');
        Schema::dropIfExists('navigation_groups');
        Schema::dropIfExists('publish_events');
        Schema::dropIfExists('publish_bundle_members');
        Schema::dropIfExists('publish_bundles');
        Schema::dropIfExists('status_transitions');
        Schema::dropIfExists('section_block');
        Schema::dropIfExists('blocks');
        Schema::dropIfExists('sections');
        Schema::dropIfExists('media');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('product_sites');
        Schema::dropIfExists('platform_registry');
    }
};
