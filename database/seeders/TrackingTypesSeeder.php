<?php

namespace Database\Seeders;

use App\Models\TrackingType;
use Illuminate\Database\Seeder;

class TrackingTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $trackingTypes = [
            ['name_ar' => 'حفظ', 'name_en' => 'Memorization'],
            ['name_ar' => 'مراجعة', 'name_en' => 'Review'],
            ['name_ar' => 'سرد', 'name_en' => 'Recitation'],
        ];

        foreach ($trackingTypes as $trackingType) {
            TrackingType::create($trackingType);
        }

        $this->command->info('✅ Created ' . TrackingType::count() . ' tracking types.');
    }
}
