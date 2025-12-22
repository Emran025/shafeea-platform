<?php

namespace Database\Seeders;

use App\Models\Halaqah;
use App\Models\Teacher;
use Illuminate\Database\Seeder;

class DemoHalaqahsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeds 23 schools with admin users based on predefined Arabic names
     */
    public function run(): void
    {


        // Load school names from JSON file
        $schoolNames = json_decode(
            file_get_contents(database_path('data/school_names.json')),
            true
        );

        $teachers = Teacher::all();
        $halaqahs = collect();
        foreach (range(1, 20) as $i) {
            $teacher = $teachers->random();
            $halaqah = Halaqah::create([
                'name' => "حلقة {$schoolNames[$i]}",
                'avatar' => 'https://example.com/halaqah.png',
                'gender' => 'male',
                'residence' => 'صنعاء',
                'max_students' => 20,
                'sum_of_students' => 0,
                'is_active' => true,
                'is_deleted' => false,
                'school_id' => $teacher->user->school_id,
            ]);
            $halaqah->teachers()->attach($teacher->id, [
                'assigned_at' => now(),
                'is_current' => true,
                'note' => 'تمت الإضافة بواسطة البيانات الأولية للنظام',
            ]);
            $halaqahs->push($halaqah);
        }

        $this->command->info('✅ Created ' . count($schoolNames) . ' Halaqahs with its Teacher.');
    }
}
