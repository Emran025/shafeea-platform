<?php

namespace Database\Seeders;

use App\Models\Teacher;
use App\Models\User;
use App\Models\School;
use Illuminate\Database\Seeder;

class DemoTeachersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeds demo teachers with specific creation dates and memorization levels
     * Useful for demonstrating historical data and various teacher states
     */
    public function run(): void
    {
        // Path to demo teachers JSON file
        $jsonPath = database_path('data/demo_teachers.json');

        if (! file_exists($jsonPath)) {
            $this->command->warn('⚠️  Demo teachers JSON file not found. Skipping seeder.');
            $this->command->info('Expected path: ' . $jsonPath);
            return;
        }

        // Load demo teachers from JSON
        $demoTeachers = json_decode(file_get_contents($jsonPath), true);

        if (empty($demoTeachers)) {
            $this->command->warn('⚠️  No demo teachers found in JSON file.');
            return;
        }

        // Get a random school to assign teachers to
        $schoolId = School::inRandomOrder()->first()?->id;

        if (! $schoolId) {
            $this->command->error('❌ No schools found! Please run SchoolSeeder first.');
            return;
        }

        foreach ($demoTeachers as $teacherData) {
            $user = User::create([
                'name' => $teacherData['name'],
                'email' => $teacherData['email'],
                'password' => bcrypt('password1234'),
                'avatar' => 'https://example.com/teacher.jpg',
                'gender' => $teacherData['gender'],
                'birth_date' => $this->generateBirthDate($teacherData['birth_year']),
                'phone' => '+9677' . rand(10000000, 99999999),
                'whatsapp' => '+9677' . rand(10000000, 99999999),
                'country' => 'اليمن',
                'city' => $this->getRandomCity(),
                'residence' => $this->getRandomResidence(),
                'school_id' => $schoolId,
                'created_at' => $teacherData['created_at'],
                'updated_at' => $teacherData['last_modified'],
            ]);

            Teacher::create([
                'user_id' => $user->id,
                'bio' => 'معلم متخصص في تحفيظ القرآن',
                'experience_years' => rand(1, 20),
                'created_at' => $teacherData['created_at'],
                'updated_at' => $teacherData['last_modified'],
            ]);
        }


        $this->command->info('✅ Created ' . count($demoTeachers) . ' demo teachers.');
    }

    private function generateBirthDate($birthYear)
    {
        $month = rand(1, 12);
        $day = rand(1, 28);

        return "{$birthYear}-{$month}-{$day}";
    }
    /**
     * Determine qualification based on birth year
     */

    private function getRandomCity()
    {
        $cities = ['صنعاء', 'عدن', 'تعز', 'الحديدة', 'إب', 'ذمار', 'مأرب'];

        return $cities[array_rand($cities)];
    }

    private function getRandomResidence()
    {
        $residences = ['التحرير', 'المنصورة', 'الشهداء', 'الروضة', 'السلام', 'الوحدة', 'الثورة'];

        return $residences[array_rand($residences)];
    }
}
