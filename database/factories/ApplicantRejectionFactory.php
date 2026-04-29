<?php

namespace Database\Factories;

use App\Models\Applicant;
use App\Models\ApplicantRejection;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicantRejectionFactory extends Factory
{
    protected $model = ApplicantRejection::class;

    public function definition(): array
    {
        return [
            'applicant_id' => Applicant::factory(),
            'school_id' => School::factory(),
            'reason' => $this->faker->sentence(),
        ];
    }
}
