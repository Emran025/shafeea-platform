<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->seedSystemData();
    }
    function seedSystemData(): void
    {
        // ✅ المدارس
        $schools = collect();
        foreach (['الفرقان', 'الإيمان', 'الهدى'] as $name) {
            $schools->push(\App\Models\School::create([
                'name' => "مدرسة $name لتحفيظ القرآن",
                'logo' => 'https://example.com/school.png',
                'phone' => '+967' . rand(700000000, 799999999),
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'location' => '15.3694,44.1910',
                'address' => "شارع $name - حي التعليم",
            ]));
        }

        // ✅ وحدات الحفظ
        $units = collect();
        foreach (range(1, 10) as $i) {
            $units->push(\App\Models\Unit::create([
                'code' => "JZ$i",
                'name_ar' => "الجزء $i"
            ]));
        }

        // ✅ أنواع التكرار
        $frequencies = collect([
            ['name' => 'يومي', 'days_between' => 1],
            ['name' => 'أسبوعي', 'days_between' => 7],
            ['name' => 'كل 3 أيام', 'days_between' => 3],
        ]);
        $frequencies = $frequencies->map(
            fn($f) =>
            \App\Models\FrequencyType::create([
                'name' => $f['name'],
                'days_between' => $f['days_between'],
                'description' => "تكرار ${f['name']}"
            ])
        );

        // ✅ المعلمين (والمستخدمين)
        $teachers = collect();
        foreach (range(1, 10) as $i) {
            $user = \App\Models\User::create([
                'name' => "أستاذ عبد الله $i",
                'email' => "teacher$i@example.com",
                'password' => bcrypt('password'),
                'avatar' => 'https://example.com/teacher.jpg',
                'gender' => 'Male',
                'birth_date' => '1980-01-0' . rand(1, 9),
                'phone' => '+9677' . rand(10000000, 99999999),
                'whatsapp' => '+9677' . rand(10000000, 99999999),
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'residence' => 'التحرير',
                'school_id' => $schools->random()->id,
            ]);

            $teachers->push(\App\Models\Teacher::create([
                'user_id' => $user->id,
                'bio' => 'معلم منذ أكثر من 10 سنوات',
                'experience_years' => rand(5, 15),
            ]));
        }

        // ✅ الحلقات
        $halaqahs = collect();
        foreach (range(1, 10) as $i) {
            $teacher = $teachers->random();
            $halaqahs->push(\App\Models\Halaqah::create([
                'name' => "حلقة النور $i",
                'avatar' => 'https://example.com/halaqah.png',
                'gender' => 'male',
                'residence' => 'صنعاء',
                'max_students' => 20,
                'sum_of_students' => 0,
                'is_active' => true,
                'is_deleted' => false,
                'teacher_id' => $teacher->id,
                'school_id' => $teacher->user->school_id,
            ]));
        }

        // ✅ الطلاب (والمستخدمين)
        $students = collect();
        foreach (range(1, 10) as $i) {
            $user = \App\Models\User::create([
                'name' => "الطالب أحمد $i",
                'email' => "student$i@example.com",
                'password' => bcrypt('password'),
                'avatar' => 'https://example.com/student.jpg',
                'gender' => 'Male',
                'birth_date' => '2007-05-' . rand(10, 28),
                'phone' => '+9677' . rand(10000000, 99999999),
                'whatsapp' => '+9677' . rand(10000000, 99999999),
                'country' => 'اليمن',
                'city' => 'عدن',
                'residence' => 'خور مكسر',
                'school_id' => $schools->random()->id,
            ]);

            $students->push(\App\Models\Student::create([
                'user_id' => $user->id,
                'qualification' => 'ثانوي',
                'memorization_level' => rand(1, 10) . ' أجزاء',
                'status' => 'active',
            ]));
        }

        // ✅ الخطط
        $plans = collect();
        foreach (range(1, 10) as $i) {
            $plans->push(\App\Models\Plan::create([
                'name' => "خطة الحفظ $i",
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

        // ✅ الاشتراكات
        $enrollments = collect();
        foreach ($students as $student) {
            $enrollments->push(\App\Models\Enrollment::create([
                'student_id' => $student->id,
                'halaqah_id' => $halaqahs->random()->id,
                'plan_id' => $plans->random()->id,
                'enrolled_at' => now()->subDays(rand(1, 20)),
            ]));
        }

        // ✅ تتبعات يومية
        $trackings = collect();
        foreach (range(1, 10) as $i) {
            $trackings->push(\App\Models\Tracking::create([
                'plan_id' => $plans->random()->id,
                'date' => now()->subDays($i),
                'note' => 'ملاحظات اليوم الدراسي',
                'behavior_note' => rand(4, 5),
            ]));
        }

        // ✅ أنواع التتبع
        $trackingTypes = collect([
            ['name_ar' => 'حفظ', 'name_en' => 'Memorization'],
            ['name_ar' => 'مراجعة', 'name_en' => 'Review'],
            ['name_ar' => 'سرد', 'name_en' => 'Recitation'],
        ])->map(fn($t) => \App\Models\TrackingType::create($t));

        // ✅ وحدات التتبع
        $trackingUnits = collect();
        foreach (range(1, 20) as $i) {
            $trackingUnits->push(\App\Models\TrackingUnit::create([
                'unit_id' => $units->random()->id,
                'from_surah' => 'البقرة',
                'from_page' => rand(1, 50),
                'from_ayah' => rand(1, 20),
                'to_surah' => 'آل عمران',
                'to_page' => rand(51, 100),
                'to_ayah' => rand(21, 40),
            ]));
        }

        // ✅ تفاصيل التتبع
        foreach ($trackings as $track) {
            \App\Models\TrackingDetail::create([
                'tracking_id' => $track->id,
                'tracking_type_id' => $trackingTypes->random()->id,
                'from_tracking_unit_id' => $trackingUnits->random()->id,
                'to_tracking_unit_id' => $trackingUnits->random()->id,
                'actual_amount' => rand(1, 5),
                'comment' => 'جيد جدًا مع بعض التحسينات',
                'score' => rand(4, 5),
            ]);
        }

        echo "✅ تم إنشاء جميع البيانات التجريبية بنجاح.\n";
    }
}
