<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
                    'video_feature',
                    'media_grid',
                ]);
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
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
