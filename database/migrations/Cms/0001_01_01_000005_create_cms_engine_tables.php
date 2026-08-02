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
                // Canonical identifier: 'accore' | 'accommerce' | 'qayd'
                $table->string('platform_id')->primary();
                $table->string('schema_version')->default('platform@1.0');
                $table->string('identity_ref');
                $table->enum('status', ['active', 'in_development', 'preview', 'deprecated'])
                    ->default('active');
                $table->enum('segment', ['enterprise_b2b', 'consumer_b2c', 'personal_smb', 'infrastructure']);
                $table->json('target_users')->nullable();
                $table->json('strategic_role')->nullable();
                $table->json('tagline')->nullable();
                $table->json('positioning')->nullable();
                $table->json('capabilities')->nullable();
                $table->json('relationships')->nullable();
                $table->json('website_presence')->nullable();
                $table->timestamps();
            });
        }

        // ── 2. product_sites ──────────────────────────────────────────────────
        if (! Schema::hasTable('product_sites')) {
            Schema::create('product_sites', function (Blueprint $table) {
                $table->string('site_id')->primary();
                $table->string('schema_version')->default('productsite@1.0');
                $table->string('platform_id')->nullable();
                $table->enum('status', [
                    'live',
                    'in_development',
                    'maintenance',
                    'deprecated',
                ])->default('in_development');

                $table->boolean('url_health')->default(true);

                // ProductSiteIdentity
                $table->string('identity_platform_name');
                $table->string('identity_display_name');
                $table->enum('identity_display_case', ['uppercase', 'lowercase_product']);
                $table->json('identity_site_label');
                $table->json('identity_short_description');
                $table->json('identity_ecosystem_role');

                // ProductSiteUrls
                $table->string('urls_canonical');
                $table->json('urls_localized')->nullable();
                $table->string('urls_contact')->nullable();
                $table->string('urls_docs')->nullable();

                // GatewayPageConfig
                $table->boolean('gateway_has_gateway_page')->default(false);
                $table->uuid('gateway_page_id')->nullable();
                $table->boolean('gateway_include_in_nav')->default(false);
                $table->json('gateway_nav_label')->nullable();
                $table->unsignedInteger('gateway_showcase_order')->default(0);
                $table->json('gateway_cta_label');
                $table->enum('gateway_cta_intent', ['primary', 'secondary'])->default('primary');
                $table->json('gateway_unavailable_label');

                // ProductSiteDisplay
                $table->boolean('display_show_in_platform_index')->default(true);
                $table->boolean('display_show_in_nav')->default(true);
                $table->boolean('display_show_in_homepage_showcase')->default(true);
                $table->enum('display_broken_link_policy', [
                    'suppress_cta',
                    'show_unavailable_label',
                    'show_as_is',
                ])->default('show_unavailable_label');
                $table->json('display_media_ref')->nullable();

                // AuditRecord
                $table->uuid('created_by');
                $table->uuid('last_modified_by');
                $table->uuid('published_by')->nullable();
                $table->timestamp('published_at')->nullable();
                $table->unsignedInteger('version_number')->default(1);

                $table->timestamps();

                $table->foreign('platform_id')
                    ->references('platform_id')
                    ->on('platform_registry')
                    ->nullOnDelete();

                $table->foreign('gateway_page_id')
                    ->references('id')
                    ->on('pages')
                    ->nullOnDelete();
            });
        }

        // ── 3. pages ──────────────────────────────────────────────────────────
        if (! Schema::hasTable('pages')) {
            Schema::create('pages', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('slug')->unique();
                $table->string('schema_version')->default('page@1.0');
                $table->enum('type', [
                    'corporate.index',
                    'corporate.about',
                    'corporate.product_gateway',
                    'corporate.product_index',
                    'corporate.contact',
                    'corporate.legal',
                    'editorial',
                    'utility',
                    'platform.full_page',
                    'pricing.overview',
                    'pricing.platform',
                    'pricing.compare',
                    'newsroom.overview',
                    'newsroom.news',
                    'newsroom.stories',
                    'newsroom.about',
                    'corporate.platform',
                    'newsroom.article',
                    'corporate.home',
                    'solution.industry_tier',
                    'solution.tier_overview',
                    'industry.full_page',
                ]);
                $table->string('page_subtype')->nullable();
                $table->string('site_scope');
                $table->enum('status', [
                    'draft',
                    'in_review',
                    'approved',
                    'published',
                    'archived',
                    'deleted',
                ])->default('draft');

                // PageIdentity
                $table->json('identity_title');
                $table->json('identity_purpose');
                $table->string('identity_owner');
                $table->string('identity_canonical_url');
                $table->enum('identity_classification', ['public', 'internal', 'restricted'])->default('public');

                // PageHierarchy
                $table->uuid('parent_id')->nullable();
                $table->unsignedTinyInteger('hierarchy_depth')->default(0);
                $table->unsignedInteger('hierarchy_position')->default(0);
                $table->boolean('hierarchy_include_in_nav')->default(false);
                $table->json('hierarchy_nav_label')->nullable();
                $table->json('breadcrumb_label')->nullable();

                // PageCompositionPolicy
                $table->enum('composition_section_order', ['explicit', 'ranked'])->default('explicit');
                $table->boolean('composition_allow_dynamic')->default(false);
                $table->unsignedInteger('composition_max_sections')->nullable();
                $table->enum('composition_fallback_policy', [
                    'show_partial',
                    'show_none',
                    'show_error_contract',
                ])->default('show_partial');

                // PageMeta
                $table->json('meta_seo_title');
                $table->json('meta_seo_description');
                $table->json('meta_og_title')->nullable();
                $table->json('meta_og_description')->nullable();
                $table->json('meta_og_image')->nullable();
                $table->enum('meta_robots', [
                    'index,follow',
                    'noindex,nofollow',
                    'noindex,follow',
                ])->default('index,follow');
                $table->string('meta_schema_markup')->nullable();
                $table->json('meta_hreflang')->nullable();

                // AuditRecord
                $table->uuid('created_by');
                $table->uuid('last_modified_by');
                $table->uuid('published_by')->nullable();
                $table->timestamp('published_at')->nullable();
                $table->unsignedInteger('version_number')->default(1);

                $table->timestamps();
                $table->softDeletes();
            });

            Schema::table('pages', function (Blueprint $table) {
                $table->foreign('parent_id')
                    ->references('id')
                    ->on('pages')
                    ->nullOnDelete();
            });
        }

        // ── 4. media ──────────────────────────────────────────────────────────
        if (! Schema::hasTable('media')) {
            Schema::create('media', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('schema_version')->default('media@1.0');
                $table->enum('type', [
                    'image.photo',
                    'image.graphic',
                    'image.icon',
                    'image.logo',
                    'video.hosted',
                    'video.native',
                    'document.pdf',
                    'document.report',
                ]);
                $table->enum('status', [
                    'uploading',
                    'processing',
                    'ready',
                    'failed',
                    'archived',
                    'deleted',
                ])->default('uploading');

                // MediaIdentity
                $table->string('identity_name');
                $table->text('identity_description')->nullable();
                $table->json('identity_tags')->nullable();
                $table->string('identity_owner');
                $table->string('identity_original_filename');

                // MediaSource
                $table->enum('source_store_type', ['s3_compatible', 'external_url']);
                $table->string('source_bucket')->nullable();
                $table->string('source_object_key')->nullable();
                $table->string('source_external_url')->nullable();
                $table->string('source_checksum_sha256')->nullable();
                $table->unsignedBigInteger('source_size_bytes')->nullable();
                $table->string('source_mime_type');

                // MediaDimensions
                $table->unsignedInteger('dimensions_width')->nullable();
                $table->unsignedInteger('dimensions_height')->nullable();
                $table->string('dimensions_aspect_ratio')->nullable();
                $table->unsignedInteger('dimensions_duration_seconds')->nullable();

                // MediaDelivery
                $table->string('delivery_base_url');
                $table->json('delivery_variants')->nullable();
                $table->boolean('delivery_is_public')->default(true);
                $table->unsignedInteger('delivery_cache_ttl_seconds')->default(86400);

                // Map<LocaleCode, MediaLocaleMeta>
                $table->json('locale_meta')->nullable();

                // AuditRecord
                $table->uuid('created_by');
                $table->uuid('last_modified_by');
                $table->uuid('published_by')->nullable();
                $table->timestamp('published_at')->nullable();
                $table->unsignedInteger('version_number')->default(1);

                $table->timestamps();
                $table->softDeletes();
            });
        }

        // ── 5. sections ───────────────────────────────────────────────────────
        if (! Schema::hasTable('sections')) {
            Schema::create('sections', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('page_id');
                $table->string('schema_version')->default('section@1.0');
                $table->enum('type', [
                    'hero',
                    'narrative',
                    'value_proposition',
                    'platform_showcase',
                    'leadership',
                    'statistics',
                    'testimonial',
                    'cta_band',
                    'legal_body',
                    'contact_form',
                    'navigation_anchor',
                    'freeform',
                    'problem_statement',
                    'solution_overview',
                    'capability_grid',
                    'ecosystem_diagram',
                    'use_case_grid',
                    'industry_grid',
                    'pricing_card_row',
                    'pricing_table',
                    'in_page_nav',
                    'breadcrumb',
                    'customer_story_grid',
                    'blog_post_grid',
                    'media_spotlight',
                    'media_banner',
                    'video_feature',
                    'media_grid',
                    'logo_cloud',
                    'faq_accordion',
                    'tabbed_switcher',
                    'resource_gate',
                    'product_comparison',
                    'news_hero',
                    'news_article_grid',
                    'stories_hero',
                    'stories_grid',
                    'about_hero',
                    'mission_statement',
                    'timeline',
                    'prose_body',
                    'rich_text',
                    'feature_grid',
                    'comparison_table',
                    'feature_spotlight',
                    'workflow_steps',
                ]);
                $table->string('background_image_url')->nullable();
                $table->string('custom_css_classes')->nullable();
                $table->enum('status', [
                    'draft',
                    'in_review',
                    'approved',
                    'published',
                    'hidden',
                    'archived',
                ])->default('draft');

                // SectionIdentity
                $table->string('identity_name');
                $table->string('identity_anchor_id')->nullable();
                $table->string('identity_owner');
                $table->text('identity_purpose');

                // SectionOrdering
                $table->unsignedInteger('ordering_position')->default(1);
                $table->boolean('ordering_is_pinned')->default(false);
                $table->string('ordering_group')->nullable();

                // SectionCompositionPolicy
                $table->unsignedInteger('composition_min_blocks')->default(0);
                $table->unsignedInteger('composition_max_blocks')->nullable();
                $table->json('composition_required_types')->nullable();
                $table->enum('composition_locale_strategy', ['strict', 'fallback'])->default('fallback');

                // VisibilityPolicy
                $table->json('visibility_audience')->nullable();
                $table->timestamp('visibility_visible_from')->nullable();
                $table->timestamp('visibility_visible_until')->nullable();

                // AuditRecord
                $table->uuid('created_by');
                $table->uuid('last_modified_by');
                $table->uuid('published_by')->nullable();
                $table->timestamp('published_at')->nullable();
                $table->unsignedInteger('version_number')->default(1);

                $table->timestamps();

                $table->foreign('page_id')
                    ->references('id')
                    ->on('pages')
                    ->cascadeOnDelete();
            });
        }

        // ── 6. blocks ─────────────────────────────────────────────────────────
        if (! Schema::hasTable('blocks')) {
            Schema::create('blocks', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('schema_version')->default('block@1.0');
                $table->enum('type', [
                    'headline',
                    'subheadline',
                    'rich_text',
                    'quote',
                    'label',
                    'caption',
                    'cta',
                    'nav_link',
                    'platform_card',
                    'product_gateway_cta',
                    'person_card',
                    'feature_item',
                    'stat_item',
                    'media',
                    'media_group',
                    'form_definition',
                    'capability_card',
                    'use_case_card',
                    'industry_card',
                    'platform_recommendation',
                    'pricing_tier_card',
                    'feature_row',
                    'video_embed',
                    'breadcrumb_trail',
                    'customer_story_card',
                    'blog_post_card',
                    'timeline_event',
                    'news_category',
                    'news_article_card',
                    'feature_tile',
                    'comparison_row',
                    'step_item',
                ]);
                $table->enum('status', [
                    'draft',
                    'in_review',
                    'approved',
                    'published',
                    'archived',
                ])->default('draft');

                $table->json('locale_content')->nullable();
                $table->uuid('media_id')->nullable();
                $table->json('actions')->nullable();
                $table->json('references')->nullable();
                $table->boolean('config_is_decorative')->default(false);
                $table->boolean('config_is_featured')->default(false);
                $table->unsignedTinyInteger('config_display_weight')->default(5);

                $table->uuid('created_by');
                $table->uuid('last_modified_by');
                $table->uuid('published_by')->nullable();
                $table->timestamp('published_at')->nullable();
                $table->unsignedInteger('version_number')->default(1);

                $table->timestamps();
            });
        }

        // ── 7. section_block ──────────────────────────────────────────────────
        if (! Schema::hasTable('section_block')) {
            Schema::create('section_block', function (Blueprint $table) {
                $table->uuid('section_id');
                $table->uuid('block_id');
                $table->unsignedInteger('position')->default(1);
                $table->boolean('is_required')->default(false);

                $table->primary(['section_id', 'block_id']);

                $table->foreign('section_id')
                    ->references('id')
                    ->on('sections')
                    ->cascadeOnDelete();

                $table->foreign('block_id')
                    ->references('id')
                    ->on('blocks')
                    ->cascadeOnDelete();
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
                $table->string('group_id')->unique();
                $table->json('label');
                $table->string('type'); // mega_menu | dropdown | direct_link
                $table->integer('position');
                $table->boolean('is_active')->default(true);
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (! Schema::hasTable('navigation_columns')) {
            Schema::create('navigation_columns', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('navigation_group_id');
                $table->string('column_id');
                $table->json('label')->nullable();
                $table->integer('position');
                $table->json('featured_block')->nullable();
                $table->timestamps();

                $table->foreign('navigation_group_id')
                    ->references('id')
                    ->on('navigation_groups')
                    ->onDelete('cascade');
            });
        }

        if (! Schema::hasTable('navigation_entries')) {
            Schema::create('navigation_entries', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('navigation_column_id');
                $table->json('label');
                $table->string('destination_type'); // internal_page | external_url
                $table->string('destination_value');
                $table->integer('position');
                $table->boolean('is_badge_highlighted')->default(false);
                $table->json('badge_text')->nullable();
                $table->timestamps();

                $table->foreign('navigation_column_id')
                    ->references('id')
                    ->on('navigation_columns')
                    ->onDelete('cascade');
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
                // Canonical entity identifier: 'accsystem' | 'accore' | 'accommerce' | 'qayd'
                $table->string('entity_id')->primary();
                $table->string('schema_version')->default('identity@1.0');
                $table->string('canonical_name');
                $table->enum('display_case', ['uppercase', 'lowercase_product']);
                $table->enum('tier', ['corporate_parent', 'component_product']);
                $table->enum('typographic_weight', ['institutional', 'operational']);
                $table->json('positioning')->nullable();
                $table->json('color_tokens')->nullable();
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

        if (! Schema::hasTable('platform_registry')) {
            Schema::table('platform_registry', function (Blueprint $table) {
                $table->foreign('identity_ref')
                    ->references('entity_id')
                    ->on('entity_identities')
                    ->restrictOnDelete();
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
        if (Schema::hasTable('platform_registry')) {
            Schema::table('platform_registry', function (Blueprint $table) {
                $table->dropForeign(['identity_ref']);
            });
        }
    }
};
