<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * 
     * This is the main orchestrator that calls specialized seeders in the correct order.
     * NOTE: The original seedSystemData() method (3,690 lines) has been refactored into specialized seeders.
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

            // Demo data
            // School infrastructure
            DemoSchoolSeeder::class,               // 23 schools + admin users
            DemoStudentsSeeder::class,         // 45+ demo students with historical data
            DemoTeachersSeeder::class,         // 45+ demo Teachers with historical data
            DemoApplicantSeeder::class,         // 45+ demo Applicants with historical data
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
