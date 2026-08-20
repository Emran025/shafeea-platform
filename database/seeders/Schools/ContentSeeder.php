<?php

namespace Database\Seeders\Schools;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * ContentSeeder — JSON-driven replacement for all PHP content seeders.
 *
 * Seeds in order:
 *   1. entity_identities  — admin/entity_identities.json
 *   2. platform_registry  — admin/platform_registry.json
 *   3. product_sites      — admin/product_sites.json
 *   4. media              — admin/media.json
 *   5. pages / sections / blocks — pages/*.json (all files, alphabetical)
 *
 * JSON shape for pages:
 *   page    → identity, hierarchy, composition, meta, sections[]
 *   section → id, type, name, anchor_id, position, group, pinned,
 *             required_block_types, blocks[]
 *   block   → id, type, position, weight, featured, media_id?,
 *             content: { en: { ...fields } }
 *
 * Block locale_content is stored in the standard DB envelope:
 *   { locale, is_complete, fields, actions }
 */
class ContentSeeder extends Seeder
{
    private const ACTOR = '00000000-0000-0000-0000-000000000001';

    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        $this->seedEntityIdentities();
        $this->seedPlatformRegistry();
        $this->seedProductSites();
        $this->seedMedia();
        $this->seedAllPages();

        Schema::enableForeignKeyConstraints();

        $this->command->info('ContentSeeder: all JSON content seeded successfully.');
    }

    // =========================================================================
    // Entity Identities — admin/entity_identities.json
    // =========================================================================

    private function seedEntityIdentities(): void
    {
        $now   = now()->toDateTimeString();
        $items = $this->loadJson('admin/entity_identities.json');

        foreach ($items as $item) {
            DB::table('entity_identities')->upsert(
                [[
                    'entity_id'          => $item['entity_id'],
                    'schema_version'     => $item['schema_version'],
                    'canonical_name'     => $item['canonical_name'],
                    'display_case'       => $item['display_case'],
                    'tier'               => $item['tier'],
                    'typographic_weight' => $item['typographic_weight'],
                    'positioning'        => json_encode($item['positioning']),
                    'color_tokens'       => $item['color_tokens'] !== null
                        ? json_encode($item['color_tokens'])
                        : null,
                    'created_at'         => $now,
                    'updated_at'         => $now,
                ]],
                ['entity_id'],
                ['canonical_name', 'display_case', 'typographic_weight', 'positioning', 'color_tokens', 'updated_at']
            );
        }

        $this->command->info('ContentSeeder: entity_identities seeded (' . count($items) . ').');
    }

    // =========================================================================
    // Platform Registry — admin/platform_registry.json
    // =========================================================================

    private function seedPlatformRegistry(): void
    {
        $now   = now()->toDateTimeString();
        $items = $this->loadJson('admin/platform_registry.json');

        foreach ($items as $item) {
            DB::table('platform_registry')->upsert(
                [[
                    'platform_id'      => $item['platform_id'],
                    'schema_version'   => $item['schema_version'],
                    'identity_ref'     => $item['identity_ref'],
                    'status'           => $item['status'],
                    'segment'          => $item['segment'],
                    'target_users'     => json_encode($item['target_users']),
                    'strategic_role'   => json_encode($item['strategic_role']),
                    'tagline'          => json_encode($item['tagline']),
                    'positioning'      => json_encode($item['positioning']),
                    'capabilities'     => json_encode($item['capabilities']),
                    'relationships'    => json_encode($item['relationships']),
                    'website_presence' => json_encode($item['website_presence']),
                    'created_at'       => $now,
                    'updated_at'       => $now,
                ]],
                ['platform_id'],
                [
                    'status',
                    'segment',
                    'target_users',
                    'strategic_role',
                    'tagline',
                    'positioning',
                    'capabilities',
                    'relationships',
                    'website_presence',
                    'updated_at'
                ]
            );
        }

        $this->command->info('ContentSeeder: platform_registry seeded (' . count($items) . ').');
    }

    // =========================================================================
    // Product Sites — admin/product_sites.json
    // =========================================================================

    private function seedProductSites(): void
    {
        $now   = now()->toDateTimeString();
        $actor = self::ACTOR;
        $items = $this->loadJson('admin/product_sites.json');

        foreach ($items as $item) {
            $row = [
                'site_id'                           => $item['site_id'],
                'schema_version'                    => $item['schema_version'],
                'platform_id'                       => $item['platform_id'],
                'status'                            => $item['status'],
                'url_health'                        => $item['url_health'] ? 1 : 0,
                'identity_platform_name'            => $item['identity_platform_name'],
                'identity_display_name'             => $item['identity_display_name'],
                'identity_display_case'             => $item['identity_display_case'],
                'identity_site_label'               => json_encode($item['identity_site_label']),
                'identity_short_description'        => json_encode($item['identity_short_description']),
                'identity_ecosystem_role'           => json_encode($item['identity_ecosystem_role']),
                'urls_canonical'                    => $item['urls_canonical'],
                'urls_localized'                    => json_encode($item['urls_localized']),
                'urls_contact'                      => $item['urls_contact'] ?? null,
                'urls_docs'                         => $item['urls_docs'] ?? null,
                'gateway_has_gateway_page'          => $item['gateway_has_gateway_page'] ? 1 : 0,
                'gateway_page_id'                   => $item['gateway_page_id'] ?? null,
                'gateway_include_in_nav'            => $item['gateway_include_in_nav'] ? 1 : 0,
                'gateway_nav_label'                 => json_encode($item['gateway_nav_label']),
                'gateway_showcase_order'            => $item['gateway_showcase_order'],
                'gateway_cta_label'                 => json_encode($item['gateway_cta_label']),
                'gateway_cta_intent'                => $item['gateway_cta_intent'],
                'gateway_unavailable_label'         => json_encode($item['gateway_unavailable_label']),
                'display_show_in_platform_index'    => $item['display_show_in_platform_index'] ? 1 : 0,
                'display_show_in_nav'               => $item['display_show_in_nav'] ? 1 : 0,
                'display_show_in_homepage_showcase' => $item['display_show_in_homepage_showcase'] ? 1 : 0,
                'display_broken_link_policy'        => $item['display_broken_link_policy'],
                'display_media_ref'                 => $item['display_media_ref'] ?? null,
                'created_by'                        => $actor,
                'last_modified_by'                  => $actor,
                'published_by'                      => null,
                'published_at'                      => null,
                'version_number'                    => $item['version_number'] ?? 1,
                'created_at'                        => $now,
                'updated_at'                        => $now,
            ];

            DB::table('product_sites')->upsert([$row], ['site_id'], array_keys($row));
        }

        $this->command->info('ContentSeeder: product_sites seeded (' . count($items) . ').');
    }

    // =========================================================================
    // Media — admin/media.json
    // =========================================================================

    private function seedMedia(): void
    {
        $now   = now()->toDateTimeString();
        $actor = self::ACTOR;
        $items = $this->loadJson('admin/media.json');

        foreach ($items as $item) {
            $row = [
                'id'                          => $item['id'],
                'schema_version'              => 'media@1.0',
                'type'                        => $item['type'],
                'status'                      => 'ready',
                'identity_name'               => $item['identity_name'],
                'identity_original_filename'  => $item['identity_original_filename'],
                'identity_description'        => null,
                'identity_tags'               => '[]',
                'identity_owner'              => 'accsystem',
                'source_mime_type'            => $item['source_mime_type'],
                'source_store_type'           => 'external_url',
                'source_external_url'         => $item['source_external_url'],
                'source_bucket'               => null,
                'source_object_key'           => null,
                'source_checksum_sha256'      => null,
                'source_size_bytes'           => null,
                'dimensions_width'            => $item['dimensions_width'] ?? null,
                'dimensions_height'           => $item['dimensions_height'] ?? null,
                'dimensions_aspect_ratio'     => $item['dimensions_aspect_ratio'] ?? null,
                'dimensions_duration_seconds' => null,
                'delivery_base_url'           => '/media',
                'delivery_variants'           => json_encode([[
                    'label'      => 'original',
                    'url'        => $item['source_external_url'],
                    'format'     => pathinfo($item['identity_original_filename'], PATHINFO_EXTENSION),
                    'width'      => $item['dimensions_width'] ?? null,
                    'height'     => $item['dimensions_height'] ?? null,
                    'size_bytes' => null,
                ]]),
                'delivery_is_public'          => 1,
                'delivery_cache_ttl_seconds'  => 86400,
                'locale_meta'                 => json_encode(['en' => [
                    'locale'   => 'en',
                    'alt_text' => $item['alt_text'],
                    'caption'  => null,
                    'title'    => null,
                ]]),
                'created_by'                  => $actor,
                'last_modified_by'            => $actor,
                'published_by'                => $actor,
                'published_at'                => $now,
                'version_number'              => 1,
                'created_at'                  => $now,
                'updated_at'                  => $now,
            ];

            DB::table('media')->upsert([$row], ['id'], ['status', 'updated_at']);
        }

        $this->command->info('ContentSeeder: media seeded (' . count($items) . ').');
    }

    // =========================================================================
    // Pages — pages/*.json
    // =========================================================================

    private function seedAllPages(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_type_check");
            DB::statement("ALTER TABLE pages ADD CONSTRAINT pages_type_check CHECK (type IN (
                'corporate.index', 'corporate.about', 'corporate.product_gateway', 'corporate.product_index',
                'corporate.contact', 'corporate.legal', 'corporate.platform', 'corporate.home',
                'editorial', 'editorial.press_release', 'utility', 'utility.comparison',
                'platform.full_page', 'platform.features', 'platform.use_cases',
                'pricing.overview', 'pricing.platform', 'pricing.compare',
                'newsroom.overview', 'newsroom.news', 'newsroom.stories', 'newsroom.about', 'newsroom.article',
                'solution.industry', 'solution.role', 'solution.business_type', 'solution.industry_tier', 'solution.tier_overview',
                'industry.full_page', 'resource.blog_post', 'resource.report', 'resource.customer_story', 'resource.webinar',
                'trust.overview', 'trust.section', 'campaign.landing',
                'school.home', 'school.contact', 'school.legal', 'school.about', 'school.overview', 'school.news', 'school.stories', 'school.full_page'
            ))");
        }

        $dir   = database_path('content/pages');

        if (! is_dir($dir)) {
            throw new \RuntimeException("ContentSeeder: pages directory not found at {$dir}");
        }

        $files = glob($dir . '/*.json');

        if (empty($files)) {
            throw new \RuntimeException("ContentSeeder: no .json files found in {$dir}");
        }

        sort($files); // deterministic load order (alphabetical)

        $pages = [];
        foreach ($files as $file) {
            $pages[] = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
        }

        $now   = now()->toDateTimeString();
        $actor = self::ACTOR;

        foreach ($files as $index => $file) {
            $page = $pages[$index];
            $this->command->info("Seeding page from file: " . basename($file));
            $this->seedPage($page, $now, $actor);
        }

        $this->command->info('ContentSeeder: ' . count($pages) . ' pages seeded from pages/ directory.');
    }

    // =========================================================================
    // JSON loader helper
    // =========================================================================

    private function loadJson(string $relativePath): array
    {
        $path = database_path('content/' . $relativePath);

        if (! file_exists($path)) {
            throw new \RuntimeException("ContentSeeder: JSON file not found: {$path}");
        }

        return json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
    }

    // =========================================================================
    // Page
    // =========================================================================

    private function seedPage(array $p, string $now, string $actor): void
    {
        $id = $p['id'];

        // ── Clean up stale sections from previous seeds ───────────────────────
        // Without this, removing sections from a JSON file leaves orphaned section
        // rows still linked to the page, causing them to appear in composition.
        $staleSectionIds = DB::table('sections')->where('page_id', $id)->pluck('id');
        if ($staleSectionIds->isNotEmpty()) {
            DB::table('section_block')->whereIn('section_id', $staleSectionIds)->delete();
            DB::table('sections')->whereIn('id', $staleSectionIds)->delete();
        }
        // ─────────────────────────────────────────────────────────────────────

        $identity = $p['identity'];
        $hier     = $p['hierarchy'];
        $comp     = $p['composition'];
        $meta     = $p['meta'];

        $row = [
            'id'                          => $id,
            'schema_version'              => 'page@1.0',
            'slug'                        => $p['slug'],
            'type'                        => $p['type'],
            'page_subtype'                => $p['page_subtype'] ?? null,
            'site_scope'                  => 'accsystem',
            'status'                      => 'published',

            'identity_title'              => json_encode($identity['title']),
            'identity_purpose'            => json_encode($identity['purpose']),
            'identity_owner'              => $identity['owner'],
            'identity_canonical_url'      => $identity['canonical_url'],
            'identity_classification'     => $identity['classification'],

            'parent_id'                   => null,
            'hierarchy_depth'             => $hier['depth'],
            'hierarchy_position'          => $hier['position'],
            'hierarchy_include_in_nav'    => $hier['include_in_nav'] ? 1 : 0,
            'hierarchy_nav_label'         => isset($hier['nav_label']) ? json_encode($hier['nav_label']) : null,
            'breadcrumb_label'            => isset($hier['breadcrumb_label']) ? json_encode($hier['breadcrumb_label']) : null,

            'composition_section_order'   => $comp['section_order'],
            'composition_allow_dynamic'   => $comp['allow_dynamic'] ? 1 : 0,
            'composition_max_sections'    => $comp['max_sections'],
            'composition_fallback_policy' => $comp['fallback_policy'],

            'meta_seo_title'              => json_encode($meta['seo_title']),
            'meta_seo_description'        => json_encode($meta['seo_description']),
            'meta_og_title'               => isset($meta['og_title'])       ? json_encode($meta['og_title'])       : null,
            'meta_og_description'         => isset($meta['og_description']) ? json_encode($meta['og_description']) : null,
            'meta_og_image'               => $meta['og_image'] ?? null,
            'meta_robots'                 => $meta['robots'] ?? 'index,follow',
            'meta_schema_markup'          => null,
            'meta_hreflang'               => json_encode([]),

            'created_by'                  => $actor,
            'last_modified_by'            => $actor,
            'published_by'                => $actor,
            'published_at'                => $now,
            'version_number'              => 1,
            'created_at'                  => $now,
            'updated_at'                  => $now,
        ];

        DB::table('pages')->upsert([$row], ['id'], [
            'slug',
            'type',
            'status',
            'identity_title',
            'meta_seo_title',
            'meta_seo_description',
            'meta_og_title',
            'meta_og_description',
            'updated_at',
        ]);

        foreach ($p['sections'] as $section) {
            $this->seedSection($section, $id, $now, $actor);
        }
    }

    // =========================================================================
    // Section
    // =========================================================================

    private function seedSection(array $s, string $pageId, string $now, string $actor): void
    {
        $row = [
            'id'                          => $s['id'],
            'schema_version'              => 'section@1.0',
            'page_id'                     => $pageId,
            'type'                        => $s['type'],
            'status'                      => 'published',
            'identity_name'               => $s['name'],
            'identity_anchor_id'          => $s['anchor_id'] ?? null,
            'identity_owner'              => 'accsystem',
            'identity_purpose'            => 'Page content section',
            'ordering_position'           => $s['position'],
            'ordering_group'              => $s['group'] ?? null,
            'ordering_is_pinned'          => ($s['pinned'] ?? false) ? 1 : 0,
            'composition_min_blocks'      => 1,
            'composition_max_blocks'      => null,
            'composition_required_types'  => json_encode($s['required_block_types'] ?? []),
            'composition_locale_strategy' => 'fallback',
            'visibility_audience'         => json_encode(['public']),
            'visibility_visible_from'     => null,
            'visibility_visible_until'    => null,
            'created_by'                  => $actor,
            'last_modified_by'            => $actor,
            'published_by'                => $actor,
            'published_at'                => $now,
            'version_number'              => 1,
            'created_at'                  => $now,
            'updated_at'                  => $now,
        ];

        DB::table('sections')->upsert([$row], ['id'], ['status', 'ordering_position', 'updated_at']);

        foreach ($s['blocks'] as $block) {
            $this->seedBlock($block, $s['id'], $now, $actor);
        }
    }

    // =========================================================================
    // Block
    // =========================================================================

    private function seedBlock(array $b, string $sectionId, string $now, string $actor): void
    {
        $localeContent = $this->buildLocaleContent($b['content']);

        DB::table('blocks')->upsert([[
            'id'                    => $b['id'],
            'schema_version'        => 'block@1.0',
            'type'                  => $b['type'],
            'status'                => 'published',
            'locale_content'        => json_encode($localeContent),
            'media_id'              => $b['media_id'] ?? null,
            'actions'               => json_encode([]),
            'references'            => json_encode([]),
            'config_is_decorative'  => 0,
            'config_is_featured'    => ($b['featured'] ?? false) ? 1 : 0,
            'config_display_weight' => $b['weight'] ?? 5,
            'created_by'            => $actor,
            'last_modified_by'      => $actor,
            'published_by'          => $actor,
            'published_at'          => $now,
            'version_number'        => 1,
            'created_at'            => $now,
            'updated_at'            => $now,
        ]], ['id'], ['status', 'media_id', 'locale_content', 'updated_at']);

        DB::table('section_block')->upsert([[
            'section_id'  => $sectionId,
            'block_id'    => $b['id'],
            'position'    => $b['position'],
            'is_required' => 0,
        ]], ['section_id', 'block_id'], ['position']);
    }

    // =========================================================================
    // Locale envelope builder
    // =========================================================================

    /**
     * Wraps each locale's raw fields in the standard content envelope:
     *   { locale, is_complete, fields, actions }
     *
     * Input:  { "en": { "text": "Hello" } }
     * Output: { "en": { "locale": "en", "is_complete": true, "fields": { "text": "Hello" }, "actions": [] } }
     */
    private function buildLocaleContent(array $content): array
    {
        $result = [];

        foreach ($content as $locale => $fields) {
            $result[$locale] = [
                'locale'      => $locale,
                'is_complete' => true,
                'fields'      => is_array($fields) ? $fields : [],
                'actions'     => [],
            ];
        }

        return $result;
    }
}
