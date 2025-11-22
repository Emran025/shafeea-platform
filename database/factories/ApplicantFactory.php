<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;


class ApplicantFactory extends Factory
{
    public function definition(): array
    {
        $applicationType = $this->faker->randomElement(['teacher', 'student']);

        $bio = $applicationType === 'teacher'
            ? 'مُعلم لغة عربية بخبرة تمتد لـ ' . $this->faker->numberBetween(3, 15) . ' سنوات في تدريس القرآن الكريم وعلومه. حاصل على إجازة في القراءات العشر.'
            : 'طالب علم مجتهد، أسعى لتعميق فهمي للقرآن الكريم وتلاوته. لدي خبرة سابقة في المشاركة في حلقات التحفيظ المحلية.';

        $qualifications = $applicationType === 'teacher'
            ? 'إجازة في علوم القرآن، شهادة في أساليب التدريس الحديثة، خبرة في التعامل مع مختلف الفئات العمرية.'
            : 'خاتم لـ ' . $this->faker->numberBetween(5, 20) . ' أجزاء من القرآن الكريم، ومشارك فعال في الأنشطة الدينية بالمسجد المحلي.';

        $intentStatement = $applicationType === 'teacher'
            ? 'أتطلع إلى المساهمة في تنشئة جيل جديد من حفظة القرآن، وتطبيق خبرتي في بيئة تعليمية محفزة وملهمة.'
            : 'أهدف إلى إتمام حفظ القرآن الكريم وتلقي العلم على يد معلمين أكفاء للانضمام إلى نخبة حفظة كتاب الله.';

        return [
            'user_id' => User::factory(),
            'school_id' => null,
            'application_type' => $applicationType,
            'status' => 'pending',
            'bio' => $bio,
            'qualifications' => $qualifications,
            'intent_statement' => $intentStatement,
            'submitted_at' => now()->subDays($this->faker->numberBetween(1, 60)),
        ];
    }

    public function withSchool()
    {
        return $this->state(fn (array $attributes) => [
            'school_id' => School::factory(),
        ]);
    }

    public function underReview()
    {
        return $this->state(fn (array $attributes) => ['status' => 'under_review']);
    }

    public function approved()
    {
        return $this->state(fn (array $attributes) => ['status' => 'approved']);
    }

    public function rejected()
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => $this->faker->randomElement([
                'المعلومات المقدمة غير كافية.',
                'عدم استيفاء شروط الخبرة المطلوبة.',
                'نعتذر، لقد تم إشغال جميع الشواغر المتاحة حالياً.',
            ]),
        ]);
    }
}
