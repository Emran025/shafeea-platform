<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoSchoolSeeder extends Seeder
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

        foreach ($schoolNames as $name) {
            // Create school
            $school = School::create([
                'name' => "مدرسة $name لتحفيظ القرآن",
                'logo' => 'https://example.com/school.png',
                'phone' => '+9677' . rand(10000000, 99999999),
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'location' => '15.3694,44.1910',
                'address' => "حي $name - شارع رئيسي",
            ]);

            // Create admin user for school
            $user = User::create([
                'name' => "مشرف مدرسة $name",
                'email' => "amran{$school->id}@naser.com",
                'password' => bcrypt('amran$$$025'),
                'avatar' => 'https://example.com/teacher.jpg',
                'gender' => 'Male',
                'birth_date' => '1980-01-' . rand(10, 28),
                'phone' => '+967739123473',
                'whatsapp' => '+96771989025',
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'residence' => 'التحرير',
                'school_id' => $school->id,
            ]);

            // Create admin record
            Admin::create([
                'user_id' => $user->id,
                'super_admin' => false,
                'status' => 'pending',
            ]);
        }

        $this->command->info('✅ Created ' . count($schoolNames) . ' schools with admin users.');
    }
}
