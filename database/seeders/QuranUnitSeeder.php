<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class QuranUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            ['name_ar' => 'جزء', 'code' => 'juz'],
            ['name_ar' => 'حزب', 'code' => 'hizb'],
            ['name_ar' => '½ حزب', 'code' => 'halfHizb'],
            ['name_ar' => '¼ حزب', 'code' => 'quarterHizb'],
            ['name_ar' => 'صفحة', 'code' => 'page'],
        ];

        foreach ($units as $unit) {
            Unit::create($unit);
        }

        $this->command->info('✅ Created ' . Unit::count() . ' Quran units.');
    }
}
