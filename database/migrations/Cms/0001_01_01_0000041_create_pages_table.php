<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
                ]);
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
    }

    public function down(): void
    {
        if (Schema::hasTable('pages')) {
            Schema::table('pages', function (Blueprint $table) {
                $table->dropForeign(['parent_id']);
            });
            Schema::dropIfExists('pages');
        }
    }
};
