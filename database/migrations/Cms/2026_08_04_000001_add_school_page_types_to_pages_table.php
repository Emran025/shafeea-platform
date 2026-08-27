<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('pages')) {
            $driver = DB::getDriverName();

            if ($driver === 'pgsql') {
                DB::statement('ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_type_check');
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
            } elseif ($driver === 'mysql') {
                DB::statement("ALTER TABLE pages MODIFY COLUMN type ENUM(
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
                )");
            }
        }
    }

    public function down(): void
    {
        // No-op down to preserve enum types
    }
};
