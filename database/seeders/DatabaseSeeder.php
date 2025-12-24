<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

/**
 * Class DatabaseSeeder
 *
 * This class serves as the primary orchestrator for the database seeding process.
 * It ensures that all necessary system data, content management records, and
 * demonstration data are populated in the correct order to maintain referential integrity.
 *
 * @package Database\Seeders
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * This method executes the seeding logic. It first checks if the database
     * has already been seeded to prevent duplicate entries. If not, it calls
     * a series of specialized seeders categorized by system data, content
     * management, and demo infrastructure.
     *
     * @return void
     */
    public function run(): void
    {
        // Check if database has already been seeded
        if (User::exists()) {
            $this->command->info('⚠️  Database is already seeded. Skipping seeder to prevent duplicates.');
            return;
        }

        // Call specialized seeders in dependency order
        $this->command->info('🚀 Starting database seeding...');

        $this->call([
            // System data (no dependencies)
            QuranUnitSeeder::class,
            QuranTrackingUnitsSeeder::class,  // 1,054 Quran tracking units

            TrackingTypesSeeder::class,

            // Content management
            ContentTypeSeeder::class,
            TagSeeder::class,
            CategorySeeder::class,
            PrivacyPolicySeeder::class,
            TermsOfUsSeeder::class,
            FrequencyTypeSeeder::class,
            ServiceSeeder::class,

            // Demo data
            // School infrastructure
            DemoSchoolSeeder::class,                // 23 schools + admin users
            DemoStudentsSeeder::class,              // 45+ demo students with historical data
            DemoTeachersSeeder::class,              // 45+ demo Teachers with historical data
            DemoApplicantSeeder::class,             // 25+ demo Applicants with historical data
            DemoTrackingsPlansSeeder::class,
            DemoSupervisorSeeder::class,
            DocumentSeeder::class,

            FaqSeeder::class,

            DemoHalaqahsSeeder::class,
            DemoEnrollmentSeeder::class,
            DemoStudentTrackingsSeeder::class,

        ]);

        $this->command->info('✅ Database seeding completed successfully!');
    }
}
