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

        $bios = [
            'معلم متخصص في القراءات العشر مع خبرة طويلة في تدريس أحكام التجويد المتقدمة.',
            'مجاز في حفص عن عاصم، مهتم بتطوير مهارات الحفظ لدى الأطفال باستخدام الوسائل الحديثة.',
            'حاصل على شهادة في الدراسات الإسلامية، متخصص في ترسيخ المتشابهات اللفظية في القرآن الكريم.',
            'معلمة متخصصة في القاعدة الحلبيدية وتأسيس الطلاب المبتدئين في القراءة الصحيحة.',
            'مشرفة تربوية ومعلمة قرآن، أركز على الربط التربوي للآيات وتطبيقها في حياة الطالب.',
            'متخصص في تدريب المسابقات القرآنية وتأهيل الطلاب للمحافل الدولية.',
            'باحث في علوم القرآن ومعلم، أسعى لتبسيط أحكام التلاوة لغير الناطقين بالعربية.',
            'معلمة متمرسة في حلقات التحفيظ النسائية، مهتمة بمتابعة الأداء اليومي والتقويم المستمر.',
        ];

        foreach ($demoTeachers as $index => $teacherData) {
            // Logic to make birth year realistic for a teacher with experience
            $experience = rand(1, 20);
            $currentYear = date('Y');
            $estimatedBirthYear = $currentYear - (22 + $experience); // Assumes starting teaching at 22
            
            $user = User::create([
                'name' => $teacherData['name'],
                'email' => $teacherData['email'],
                'password' => bcrypt('password1234'),
                'avatar' => 'https://example.com/teacher.jpg',
                'gender' => $teacherData['gender'],
                'birth_date' => $this->generateBirthDate($estimatedBirthYear),
                'phone' => '+9665' . rand(10000000, 99999999), // Using Saudi prefix for realism with SAR
                'whatsapp' => '+9665' . rand(10000000, 99999999),
                'country' => 'السعودية',
                'city' => $this->getRandomCity(),
                'residence' => $this->getRandomResidence(),
                'school_id' => $schoolId,
                'created_at' => $teacherData['created_at'],
                'updated_at' => $teacherData['last_modified'],
            ]);

            Teacher::create([
                'user_id' => $user->id,
                'bio' => $bios[$index % count($bios)],
                'experience_years' => $experience,
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
        $cities = ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'أبها', 'تبوك', 'بريدة'];

        return $cities[array_rand($cities)];
    }

    private function getRandomResidence()
    {
        $residences = ['حي الياسمين', 'النرجس', 'الروضة', 'العزيزية', 'حي الشاطئ', 'حي العليا', 'حي السليمانية', 'الملز', 'المروج'];

        return $residences[array_rand($residences)];
    }
}
