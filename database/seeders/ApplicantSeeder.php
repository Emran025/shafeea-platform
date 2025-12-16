<?php

namespace Database\Seeders;

use App\Models\Applicant;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ApplicantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $schools = School::all();
        if ($schools->isEmpty()) {
            $this->command->warn('No schools found. Please seed schools before running the ApplicantSeeder.');
            return;
        }


        $applicants = [
            // PENDING Applicants (15)
            [
                'name' => 'علي عبدالله صالح',
                'email' => 'ali.saleh@example.com',
                'gender' => 'Male',
                'birth_year' => 2005,
                'phone' => '+967771234567',
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'application_type' => 'student',
                'status' => 'pending',
                'qualifications' => 'طالب في المرحلة الثانوية.',
                'memorization_level'  => 0,
                "bio" => 'الرغبة في حفظ القرآن الكريم وإتقان أحكام التجويد.',
                'created_at' => '2024-10-01 10:00:00',
                'school_id' => 1,
            ],
            [
                'name' => 'فاطمة محمد أحمد',
                'email' => 'fatima.ahmed@example.com',
                'gender' => 'Female',
                'birth_year' => 1995,
                'phone' => '+967772345678',
                'country' => 'اليمن',
                'city' => 'عدن',
                'application_type' => 'teacher',
                'status' => 'pending',
                'memorization_level'  => 30,
                'qualifications' => 'بكالوريوس دراسات إسلامية، إجازة في رواية حفص عن عاصم.',
                "bio" => 'المساهمة في تعليم كتاب الله للأجيال القادمة.',
                'created_at' => '2024-10-02 11:30:00',
                'school_id' => 2,
            ],
            [
                'name' => 'حسن سالم عمر',
                'email' => 'hasan.omar@example.com',
                'gender' => 'Male',
                'birth_year' => 2006,
                'phone' => '+967773456789',
                'country' => 'اليمن',
                'city' => 'تعز',
                'application_type' => 'student',
                'status' => 'pending',
                'qualifications' => 'طالب في الصف العاشر.',
                "bio" => 'إكمال حفظ القرآن وتثبيته.',
                'memorization_level'  => 20,
                'created_at' => '2024-10-03 14:00:00',
                'school_id' => 3,
            ],
            [
                'name' => 'مريم قائد علي',
                'email' => 'mariam.ali@example.com',
                'gender' => 'Female',
                'birth_year' => 2007,
                'phone' => '+967774567890',
                'country' => 'اليمن',
                'city' => 'إب',
                'application_type' => 'student',
                'status' => 'pending',
                'qualifications' => 'طالبة في المرحلة الإعدادية.',
                'memorization_level'  => 0,
                "bio" => 'البدء في رحلة حفظ القرآن الكريم.',
                'created_at' => '2024-10-05 09:00:00',
                'school_id' => 1,
            ],
            [
                'name' => 'أحمد ناصر حسين',
                'email' => 'ahmed.hussein@example.com',
                'gender' => 'Male',
                'birth_year' => 1990,
                'phone' => '+967775678901',
                'country' => 'اليمن',
                'city' => 'الحديدة',
                'application_type' => 'teacher',
                'status' => 'pending',
                'memorization_level'  => 30,
                'qualifications' => 'دبلوم في علوم الحاسوب، حافظ لخمسة عشر جزءاً.',
                "bio" => 'خدمة كتاب الله من خلال تدريس الطلاب.',
                'created_at' => '2024-10-06 16:20:00',
                'school_id' => null,
            ],
            [
                'name' => 'نورة قاسم سعيد',
                'email' => 'noura.saeed@example.com',
                'gender' => 'Female',
                'birth_year' => 2004,
                'phone' => '+967776789012',
                'country' => 'اليمن',
                'city' => 'ذمار',
                'application_type' => 'student',
                'status' => 'pending',
                'memorization_level'  => 10,
                'qualifications' => 'طالبة جامعية، تخصص لغة عربية.',
                "bio" => 'تحسين التلاوة والحفظ.',
                'created_at' => '2024-10-08 12:10:00',
                'school_id' => 2,
            ],
            [
                'name' => 'خالد منصور زيد',
                'email' => 'khaled.zaid@example.com',
                'gender' => 'Male',
                'birth_year' => 2008,
                'phone' => '+967777890123',
                'country' => 'اليمن',
                'city' => 'مأرب',
                'application_type' => 'student',
                'status' => 'pending',
                'memorization_level'  => 2,
                'qualifications' => 'طالب في الصف الثامن.',
                "bio" => 'حفظ جزء عم وتبارك.',
                'created_at' => '2024-10-10 10:45:00',
                'school_id' => null,
            ],
            [
                'name' => 'سمية علي سالم',
                'email' => 'sumaya.salem@example.com',
                'gender' => 'Female',
                'birth_year' => 1998,
                'phone' => '+967778901234',
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'application_type' => 'teacher',
                'status' => 'pending',
                'memorization_level'  => 30,
                'qualifications' => 'إجازة في القراءات العشر.',
                "bio" => 'تعليم الطالبات القراءة الصحيحة للقرآن.',
                'created_at' => '2024-10-11 15:00:00',
                'school_id' => 1,
            ],
            [
                'name' => 'عمار ياسر محمد',
                'email' => 'ammar.mohammed@example.com',
                'gender' => 'Male',
                'birth_year' => 2009,
                'phone' => '+967779012345',
                'country' => 'اليمن',
                'city' => 'عدن',
                'application_type' => 'student',
                'status' => 'pending',
                'memorization_level'  => 3,
                'qualifications' => 'طالب في الصف السابع.',
                "bio" => 'المشاركة في المسابقات القرآنية.',
                'created_at' => '2024-10-12 11:15:00',
                'school_id' => 3,
            ],
            [
                'name' => 'سارة إبراهيم حسن',
                'email' => 'sara.hassan@example.com',
                'gender' => 'Female',
                'birth_year' => 2006,
                'phone' => '+967731234567',
                'country' => 'اليمن',
                'city' => 'تعز',
                'application_type' => 'student',
                'status' => 'pending',
                'memorization_level'  => 15,
                'qualifications' => 'طالبة في المرحلة الثانوية.',
                "bio" => 'حفظ القرآن كاملاً.',
                'created_at' => '2024-10-14 09:30:00',
                'school_id' => 2,
            ],
            [
                'name' => 'يوسف خالد عبدالله',
                'email' => 'yousef.abdullah@example.com',
                'gender' => 'Male',
                'birth_year' => 1992,
                'phone' => '+967732345678',
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'application_type' => 'teacher',
                'status' => 'pending',
                'memorization_level'  => 30,
                'qualifications' => 'خبرة 5 سنوات في تحفيظ القرآن.',
                "bio" => 'البحث عن فرصة عمل مستقرة في مجال تعليم القرآن.',
                'created_at' => '2024-10-15 13:00:00',
                'school_id' => null,
            ],
            [
                'name' => 'آية عبدالرحمن قاسم',
                'email' => 'aya.qasem@example.com',
                'gender' => 'Female',
                'birth_year' => 2005,
                'phone' => '+967733456789',
                'country' => 'اليمن',
                'city' => 'إب',
                'application_type' => 'student',
                'status' => 'pending',
                'qualifications' => 'طالبة في السنة الأولى الجامعية.',
                'memorization_level'  => 1,
                "bio" => 'إتقان تلاوة القرآن الكريم.',
                'created_at' => '2024-10-17 10:00:00',
                'school_id' => 1,
            ],
            [
                'name' => 'محمد علي ناجي',
                'email' => 'mohammed.naji@example.com',
                'gender' => 'Male',
                'birth_year' => 2010,
                'phone' => '+967734567890',
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'application_type' => 'student',
                'status' => 'pending',
                'qualifications' => 'طالب في الصف السادس.',
                "bio" => 'حفظ خمسة أجزاء خلال هذا العام.',
                'created_at' => '2024-10-18 11:45:00',
                'school_id' => 3,
            ],
            [
                'name' => 'هناء فؤاد سالم',
                'email' => 'hana.salem@example.com',
                'gender' => 'Female',
                'birth_year' => 1988,
                'phone' => '+967735678901',
                'country' => 'اليمن',
                'city' => 'عدن',
                'application_type' => 'teacher',
                'status' => 'pending',
                'memorization_level'  => 20,
                'qualifications' => 'معلمة لغة عربية متقاعدة.',
                "bio" => 'شغل وقت الفراغ في عمل نافع.',
                'created_at' => '2024-10-20 14:30:00',
                'school_id' => null,
            ],
            [
                'name' => 'عبدالعزيز سالم أحمد',
                'email' => 'aziz.ahmed@example.com',
                'gender' => 'Male',
                'birth_year' => 2004,
                'phone' => '+967736789012',
                'country' => 'اليمن',
                'city' => 'تعز',
                'application_type' => 'student',
                'status' => 'pending',
                'memorization_level'  => 25,
                'qualifications' => 'طالب في كلية الهندسة.',
                "bio" => 'المراجعة وتثبيت الحفظ السابق.',
                'created_at' => '2024-10-21 16:00:00',
                'school_id' => 2,
            ],
            // UNDER_REVIEW Applicants (5)
            [
                'name' => 'أسماء عمر حسين',
                'email' => 'asma.hussein@example.com',
                'gender' => 'Female',
                'birth_year' => 2003,
                'phone' => '+967711234567',
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'application_type' => 'student',
                'status' => 'under_review',
                'memorization_level'  => 26,
                'qualifications' => 'طالبة في كلية الشريعة.',
                "bio" => 'الانضمام لحلقة متقدمة في الحفظ.',
                'created_at' => '2024-09-15 09:00:00',
                'school_id' => 1,
            ],
            [
                'name' => 'طارق زياد عبدالله',
                'email' => 'tariq.abdullah@example.com',
                'gender' => 'Male',
                'birth_year' => 1985,
                'phone' => '+967712345678',
                'country' => 'اليمن',
                'city' => 'عدن',
                'application_type' => 'teacher',
                'status' => 'under_review',
                'memorization_level'  => 30,
                'qualifications' => 'ماجستير في الفقه، خبرة 10 سنوات.',
                "bio" => 'الإشراف على الحلقات وتطوير المناهج.',
                'created_at' => '2024-09-16 10:30:00',
                'school_id' => 2,
            ],
            [
                'name' => 'عائشة بكر سالم',
                'email' => 'aisha.salem@example.com',
                'gender' => 'Female',
                'birth_year' => 2006,
                'phone' => '+967713456789',
                'country' => 'اليمن',
                'city' => 'تعز',
                'application_type' => 'student',
                'status' => 'under_review',
                'memorization_level'  => 29,
                'qualifications' => 'طالبة في الصف الحادي عشر.',
                "bio" => 'الاستعداد للمسابقات الدولية.',
                'created_at' => '2024-09-18 11:00:00',
                'school_id' => 3,
            ],
            [
                'name' => 'إبراهيم محمود علي',
                'email' => 'ibrahim.ali@example.com',
                'gender' => 'Male',
                'birth_year' => 1993,
                'phone' => '+967714567890',
                'country' => 'اليمن',
                'city' => 'إب',
                'application_type' => 'teacher',
                'status' => 'under_review',
                'memorization_level'  => 20,
                'qualifications' => 'خريج كلية القرآن الكريم.',
                "bio" => 'تدريس العلوم الشرعية المتعلقة بالقرآن.',
                'created_at' => '2024-09-20 14:00:00',
                'school_id' => null,
            ],
            [
                'name' => 'جنى وليد قاسم',
                'email' => 'jana.qasem@example.com',
                'gender' => 'Female',
                'birth_year' => 2008,
                'phone' => '+967715678901',
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'application_type' => 'student',
                'status' => 'under_review',
                'memorization_level'  => 10,
                'qualifications' => 'طالبة في الصف الثامن.',
                "bio" => 'الانضمام إلى حلقة لصديقاتها.',
                'created_at' => '2024-09-22 12:00:00',
                'school_id' => 1,
            ],
            // APPROVED Applicants (3)
            [
                'name' => 'سليمان داوود محمد',
                'email' => 'sulaiman.mohammed@example.com',
                'gender' => 'Male',
                'birth_year' => 2002,
                'phone' => '+967701234567',
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'application_type' => 'student',
                'status' => 'approved',
                'memorization_level'  => 2,
                'qualifications' => 'طالب جامعي.',
                "bio" => 'ختم القرآن الكريم في غضون عامين.',
                'created_at' => '2024-09-01 10:00:00',
                'school_id' => 1,
            ],
            [
                'name' => 'أمينة عبدالقادر سالم',
                'email' => 'amina.salem@example.com',
                'gender' => 'Female',
                'birth_year' => 1980,
                'phone' => '+967702345678',
                'country' => 'اليمن',
                'city' => 'عدن',
                'application_type' => 'teacher',
                'status' => 'approved',
                'memorization_level'  => 30,
                'qualifications' => 'خبرة طويلة في تدريس النساء الكبيرات.',
                "bio" => 'نشر العلم الشرعي بين النساء.',
                'created_at' => '2024-09-05 11:00:00',
                'school_id' => 2,
            ],
            [
                'name' => 'يحيى زكريا عبدالله',
                'email' => 'yahya.abdullah@example.com',
                'gender' => 'Male',
                'birth_year' => 2007,
                'phone' => '+967703456789',
                'country' => 'اليمن',
                'city' => 'تعز',
                'application_type' => 'student',
                'status' => 'approved',
                'memorization_level'  => 30,
                'qualifications' => 'طالب في الصف التاسع.',
                "bio" => 'المراجعة الدائمة والمشاركة في الأنشطة.',
                'created_at' => '2024-09-10 15:30:00',
                'school_id' => 3,
            ],
            // REJECTED Applicants (2)
            [
                'name' => 'بلقيس حميد قائد',
                'email' => 'belqis.qaid@example.com',
                'gender' => 'Female',
                'birth_year' => 2001,
                'phone' => '+967704567890',
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'application_type' => 'student',
                'status' => 'rejected',
                'memorization_level'  => 20,
                'qualifications' => 'طالبة جامعية.',
                "bio" => 'الرغبة في الحفظ.',
                'created_at' => '2024-09-08 14:00:00',
                'school_id' => 1,
            ],
            [
                'name' => 'غازي منصور علي',
                'email' => 'ghazi.ali@example.com',
                'gender' => 'Male',
                'birth_year' => 1996,
                'phone' => '+967705678901',
                'country' => 'اليمن',
                'city' => 'إب',
                'application_type' => 'teacher',
                'status' => 'rejected',
                'memorization_level'  => 30,
                'qualifications' => 'خريج ثانوية عامة.',
                "bio" => 'الحصول على وظيفة.',
                'created_at' => '2024-09-12 16:00:00',
                'school_id' => null,
            ],
        ];

        foreach ($applicants as $applicantData) {
            // 1. Smart Create/Update User (Safe)
            $user = $this->smartUpdateOrCreate(
                User::class,
                ['email' => $applicantData['email']],
                [
                    'name' => $applicantData['name'],
                    'password' => Hash::make('password'),
                    'avatar' => 'https://i.pravatar.cc/150?u=' . $applicantData['email'],
                    'gender' => $applicantData['gender'],
                    'birth_date' => $this->generateBirthDate($applicantData['birth_year']),
                    'phone' => $applicantData['phone'],
                    'country' => $applicantData['country'],
                    'city' => $applicantData['city'],
                    'school_id' => $applicantData['school_id'] ?? $schools->random()->id,
                    'created_at' => $applicantData['created_at'],
                    'updated_at' => $applicantData['created_at'],
                ]
            );

            // 2. Smart Create/Update Applicant (Safe)
            $this->smartUpdateOrCreate(
                Applicant::class,
                ['user_id' => $user->id],
                [
                    'school_id' => $user->school_id,
                    'application_type' => $applicantData['application_type'],
                    'status' => $applicantData['status'],
                    'qualifications' => $applicantData['qualifications'],
                    "bio" => $applicantData['bio'],
                    'created_at' => $applicantData['created_at'],
                    'updated_at' => $applicantData['created_at'],
                ]
            );
        }
    }

    private function generateBirthDate($birthYear): string
    {
        $month = rand(1, 12);
        $day = rand(1, 28);
        return "{$birthYear}-{$month}-{$day}";
    }

    /**
     * Helper to safely update or create records, handling SoftDeletes automatically.
     */
    private function smartUpdateOrCreate($modelClass, array $searchConditions, array $data = [])
    {
        $query = $modelClass::query();

        if (in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses_recursive($modelClass))) {
            $query->withTrashed();
        }

        $record = $query->updateOrCreate($searchConditions, $data);

        if (method_exists($record, 'trashed') && $record->trashed()) {
            $record->restore();
        }

        return $record;
    }
}
