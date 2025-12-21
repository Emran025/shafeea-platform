<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SchoolFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'مدرسة ' . $this->faker->company() . ' لتحفيظ القرآن',
            'logo' => $this->faker->imageUrl(200, 200, 'schools', true, 'School'),
            'phone' => '+9677' . $this->faker->numerify('########'), // Yemeni phone number
            'country' => 'Yemen',
            'city' => $this->faker->randomElement(['Sana\'a', 'Aden', 'Taiz', 'Hodeidah', 'Ibb']),
            'location' => $this->faker->latitude() . ',' . $this->faker->longitude(),
            'address' => $this->faker->streetAddress(),
        ];
    }
}
