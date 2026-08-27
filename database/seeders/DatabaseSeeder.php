<?php

namespace Database\Seeders;

use App\Models\Auth\Admin;
use App\Models\School\School;
use Illuminate\Database\Seeder;

/**
 * Class DatabaseSeeder
 *
 * Primary orchestrator for the database seeding process.
 * Integrates system data, platform settings, unified user/school content, and school template seeders.
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Check if database has already been seeded
        if (School::exists() || Admin::where('super_admin', true)->exists()) {
            $this->command->info('⚠️ Database is already seeded or Initial Admin exists. Skipping duplicate seeding.');

            return;
        }

        $this->command->info('🚀 Starting comprehensive database seeding...');

        $this->call([
            // 1. Core Quran & Tracking Reference Data
            QuranUnitSeeder::class,
            QuranTrackingUnitsSeeder::class,
            TrackingTypesSeeder::class,
            FrequencyTypeSeeder::class,

            // 2. Platform Content & Reference Taxonomy
            ContentTypeSeeder::class,
            TagSeeder::class,
            CategorySeeder::class,
            CountrySeeder::class,

            // 3. Platform Help Desk & Legal Data
            PrivacyPolicySeeder::class,
            TermsOfUsSeeder::class,
            FaqSeeder::class,
            ServiceSeeder::class,
            LandingPageSettingSeeder::class,
            DocumentSeeder::class,

            // 4. Platform Subscription Plans & System Admins
            SubscriptionPlanSeeder::class,
            InitialAdminSeeder::class,

            // 5. School Engine CMS & Admin Seeders
            \Database\Seeders\Schools\AdminAccessSeeder::class,
            \Database\Seeders\Schools\ContentSeeder::class,
            \Database\Seeders\Schools\NavigationGroupSeeder::class,

            // 6. Public Demo School & Academic Workflow Data
            DemoSchoolSeeder::class,
            DemoTeachersSeeder::class,
            DemoStudentsSeeder::class,
            DemoHalaqahsSeeder::class,
            DemoTrackingsPlansSeeder::class,
            DemoEnrollmentSeeder::class,
            DemoStudentTrackingsSeeder::class,
            DemoApplicantSeeder::class,
        ]);

        $this->command->info('✅ Comprehensive database seeding completed successfully!');
    }
}
