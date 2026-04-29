<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->sentence(3),
            'certificate_type' => $this->faker->randomElement([
                'شهادة حفظ قران',
                'شهادة إجازة في القران',
                'سيرة ذاتية',
                'Other',
            ]),
            'riwayah' => $this->faker->randomElement([
                'قراءة الإمام نافع المدني',
                'قراءة الإمام عبد الله بن كثير المكي',
                'قراءة الإمام أبو عمرو البصري',
                'قراءة الإمام بن عامر الدمشقي',
                'قراءة الإمام عاصم بن أبي النجود الكوفي',
                'قراءة الإمام حمزة الزيات',
                'قراءة الإمام الكسائي',
                'قراءة الإمام أبو جعفر المدني',
                'قراءة الإمام يعقوب الحضرمي',
                'قراءة الإمام خلف العاشر',
            ]),
            'issuing_place' => $this->faker->city,
            'issuing_date' => $this->faker->date(),
            'file_path' => $this->faker->filePath(),
        ];
    }
}
