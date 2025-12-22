<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\Tracking;
use App\Models\TrackingDetail;
use App\Models\TrackingUnit;
use Illuminate\Database\Seeder;

class DemoStudentTrackingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeds demo enrollment with specific creation dates and memorization levels
     * Useful for demonstrating historical data and various teacher states
     */
    public function run(): void
    {

        // Path to demo students JSON file
        $jsonPath = database_path('data/demo_student_trackings.json');

        if (! file_exists($jsonPath)) {
            $this->command->warn('⚠️  Demo students JSON file not found. Skipping seeder.');
            $this->command->info('Expected path: ' . $jsonPath);
            return;
        }

        // Load demo students from JSON
        $demoStudentTrackings = json_decode(file_get_contents($jsonPath), true);

        if (empty($demoStudentTrackings)) {
            $this->command->warn('⚠️  No demo students found in JSON file.');
            return;
        }

        $enrollments = Enrollment::all();
        foreach ($enrollments as $enrollment) {
            foreach ($demoStudentTrackings as $sourceData) {
                $dayData = $sourceData;
                $details = $dayData['details'];
                unset($dayData['details']);
                $dayData['enrollment_id'] = $enrollment->id;
                if (isset($dayData['id'])) {
                    unset($dayData['id']);
                }
                $tracking = Tracking::create($dayData);
                foreach ($details as $detailData) {

                    $detailData['tracking_id'] = $tracking->id;
                    if (isset($detailData['id'])) {
                        unset($detailData['id']);
                    }
                    TrackingDetail::create($detailData);
                }
            }
        }

        $this->command->info('✅ Created demo demo student trackings.');
    }
}
