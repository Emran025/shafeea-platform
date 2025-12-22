<?php

namespace Database\Seeders;

use App\Models\FrequencyType;
use Illuminate\Database\Seeder;

class FrequencyTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $frequencytypes = [
            ['name' => 'يوميًا', 'days_between' => 1, 'description' => "تكرار كل يوم",],
            ['name' => 'أسبوعي', 'days_between' => 7, 'description' => "تكرار كل 7 أيام",],
            ['name' => 'مرتين بالأسبوع', 'days_between' => 3, 'description' => "تكرار كل 3 أيام",],
            ['name' => 'ثلاث مرات بالأسبوع', 'days_between' => 2, 'description' => "تكرار كل يومين",],
        ];

        foreach ($frequencytypes as $frequencyType) {
            FrequencyType::create($frequencyType);
        }

        $this->command->info('✅ Created ' . FrequencyType::count() . ' frequency types.');
    }
}
