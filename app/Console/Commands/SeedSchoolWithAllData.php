<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\{
    Admin,
    FrequencyType,
    Halaqah,
    Plan,
    School,
    Student,
    Teacher,
    Tracking,
    TrackingDetail,
    TrackingType,
    TrackingUnit,
    Unit,
    User,
    Enrollment,
    StudentReport
};
use Illuminate\Support\Str;
use Carbon\Carbon;
class SeedSchoolWithAllData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:school-wafa-full';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'إنشاء مدرسة الوفاء بكافة البيانات من طلاب ومعلمين وخطط وتتبع...';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("\n🚀 بدء إنشاء بيانات مدرسة الوفاء...");

        // المدرسة
        $school = School::create([
            'name' => 'مدرسة الوفاء لتحفيظ القرآن',
            'logo' => 'https://example.com/wafa.png',
            'phone' => '+967' . rand(700000000, 799999999),
            'country' => 'اليمن',
            'city' => 'صنعاء',
            'location' => '15.3694,44.1910',
            'address' => 'شارع الوفاء - حي التعليم',
        ]);

        // وحدات الحفظ
        $units = collect();
        foreach (range(1, 10) as $i) {
            $units->push(Unit::create([
                'code' => "JZ$i",
                'name_ar' => "الجزء $i"
            ]));
        }

        // أنواع التكرار
        $frequencies = collect([
            ['name' => 'يومي', 'days_between' => 1],
            ['name' => 'أسبوعي', 'days_between' => 7],
            ['name' => 'كل 3 أيام', 'days_between' => 3],
        ])->map(fn($f) => FrequencyType::create([
            'name' => $f['name'],
            'days_between' => $f['days_between'],
            'description' => "تكرار {$f['name']}"
        ]));

        // وفاء كأدمين ومعلمة
        $wafa = User::create([
            'name' => 'وفاء أحمد',
            'email' => 'wafa@gmail.com',
            'password' => bcrypt('password'),
            'avatar' => 'https://example.com/wafa.jpg',
            'gender' => 'Female',
            'birth_date' => '1985-05-01',
            'phone' => '+9677' . rand(10000000, 99999999),
            'whatsapp' => '+9677' . rand(10000000, 99999999),
            'country' => 'اليمن',
            'city' => 'صنعاء',
            'residence' => 'الوحدة',
            'school_id' => $school->id,
        ]);

        Teacher::create([
            'user_id' => $wafa->id,
            'bio' => 'مشرفة ومعلمة متميزة',
            'experience_years' => 10,
        ]);

       $admin = Admin::create([
            'user_id' => $wafa->id,
            'super_admin' => true,
        ]);

        // المعلمين
        $teachers = collect();
        foreach (range(1, 5) as $i) {
            $user = User::create([
                'name' => "المعلم عبد الله $i",
                'email' => "teacherwafa$i@example.com",
                'password' => bcrypt('password'),
                'avatar' => 'https://example.com/teacher.jpg',
                'gender' => 'Male',
                'birth_date' => '1980-01-' . rand(10, 28),
                'phone' => '+9677' . rand(10000000, 99999999),
                'whatsapp' => '+9677' . rand(10000000, 99999999),
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'residence' => 'التحرير',
                'school_id' => $school->id,
            ]);

            $teachers->push(Teacher::create([
                'user_id' => $user->id,
                'bio' => 'معلم متخصص في القرآن الكريم',
                'experience_years' => rand(5, 15),
            ]));
        }

        // الحلقات
        $halaqahs = collect();
        foreach (range(1, 5) as $i) {
            $teacher = $teachers->random();
            $halaqahs->push(Halaqah::create([
                'name' => "حلقة الوفاء $i",
                'avatar' => 'https://example.com/halaqah.png',
                'gender' => 'male',
                'residence' => 'صنعاء',
                'max_students' => 20,
                'sum_of_students' => 0,
                'is_active' => true,
                'is_deleted' => false,
                'teacher_id' => $teacher->id,
                'school_id' => $school->id,
            ]));
        }

        // الطلاب
        $students = collect();
        foreach (range(1, 20) as $i) {
            $user = User::create([
                'name' => "الطالب يحيى $i",
                'email' => "studentwafa$i@example.com",
                'password' => bcrypt('password'),
                'avatar' => 'https://example.com/student.jpg',
                'gender' => 'Male',
                'birth_date' => '2007-05-' . rand(10, 28),
                'phone' => '+9677' . rand(10000000, 99999999),
                'whatsapp' => '+9677' . rand(10000000, 99999999),
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'residence' => 'خور مكسر',
                'school_id' => $school->id,
            ]);

            $students->push(Student::create([
                'user_id' => $user->id,
                'qualification' => 'ثانوي',
                'memorization_level' => rand(1, 10) . ' أجزاء',
                'status' => 'active',
            ]));
        }

        // الخطط
        $plans = collect();
        foreach (range(1, 10) as $i) {
            $plans->push(Plan::create([
                'name' => "خطة $i",
                'description' => "خطة لحفظ ${i} أجزاء",
                'start_date' => now(),
                'end_date' => now()->addDays(rand(30, 60)),
                'has_review' => true,
                'review_unit_id' => $units->random()->id,
                'review_amount' => rand(1, 3),
                'has_memorization' => true,
                'memorization_unit_id' => $units->random()->id,
                'memorization_amount' => rand(1, 5),
                'has_sard' => true,
                'sard_unit_id' => $units->random()->id,
                'sard_amount' => rand(1, 3),
                'frequency_type_id' => $frequencies->random()->id,
            ]));
        }

        // الاشتراكات
         foreach ($students as $student) {
            Enrollment::create([
                'student_id' => $student->id,
                'halaqah_id' => $halaqahs->random()->id,
                'plan_id' => $plans->random()->id,
                'enrolled_at' => now()->subDays(rand(1, 20)),
            ]);

            $reportDate = Carbon::now()->subDays(rand(1, 30));

            $report = StudentReport::create([
                'student_id' => $student->id,
                'report_date' => $reportDate,
                'summary' => 'Student performance summary on ' . $reportDate->format('Y-m-d'),
                'details' => json_encode([
                    'attendance' => rand(0, 1) ? 'Present' : 'Absent',
                    'participation' => rand(1, 10),
                    'homework' => rand(1, 10),
                    'notes' => Str::random(20)
                ]),
                'behavior' => rand(5, 10), // Score out of 10
                'created_at' => $reportDate,
                'updated_at' => $reportDate,
            ]);
        }

        $notificationTypes = ['alert', 'reminder', 'system'];

        // 🔔 إشعارات للمشرفين (Admin Notifications)
        foreach (range(1, 20) as $i) {
            \App\Models\Notification::create([
                'type' => $notificationTypes[array_rand($notificationTypes)], // اختيار عشوائي من القائمة
                'title' => 'تقرير جديد للطالب',
                'message' => 'تم إنشاء تقرير جديد للطالب بتاريخ ' . $reportDate->format('Y-m-d'),
                'read' => false,
                'user_id' => $admin->id ?? null, // تأكد من وجود علاقة user للطالب، أو استخدم null
                'scheduled_for' => now(), // يمكن تغييرها لتكون لاحقًا إذا لزم الأمر
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }


        $this->info("\n✅ تم إنشاء كافة بيانات مدرسة الوفاء بنجاح!");
    }
}
