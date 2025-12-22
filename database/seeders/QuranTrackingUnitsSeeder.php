<?php

namespace Database\Seeders;

use App\Models\TrackingUnit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuranTrackingUnitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeds 1,054 Quran tracking units from external JSON file
     * These units represent different memorization levels and page ranges
     */
    public function run(): void
    {
        // Check if tracking units already exist
        if (TrackingUnit::query()->exists()) {
            $this->command->warn('⚠️  Tracking units already exist. Skipping seeder.');
            return;
        }

        // Path to the tracking units JSON file
        $jsonPath = database_path('data/quran_tracking_units.json');

        if (! file_exists($jsonPath)) {
            $this->command->error('❌ Quran tracking units JSON file not found!');
            $this->command->info("Expected path: $jsonPath");
            $this->command->info('Please extract tracking units from DatabaseSeeder::seedSystemData() to this file.');
            return;
        }

        // Load tracking units from JSON
        $quranTrackingUnits = json_decode(file_get_contents($jsonPath), true);

        if (empty($quranTrackingUnits)) {
            $this->command->error('❌ No tracking units found in JSON file!');
            return;
        }

        $trackingUnits = collect();

        foreach ($quranTrackingUnits as $trackingUnitData) {

            $trackingUnits->push(TrackingUnit::create([
                'unit_id' => $trackingUnitData[1],
                'from_surah' => $trackingUnitData[2],
                'from_page' => $trackingUnitData[3],
                'from_ayah' => $trackingUnitData[4],
                'to_surah' => $trackingUnitData[5],
                'to_page' => $trackingUnitData[6],
                'to_ayah' => $trackingUnitData[7],
            ]));
        }

        $this->command->info('✅ Created ' . count($trackingUnits) . ' Quran tracking units.');
    }
}
