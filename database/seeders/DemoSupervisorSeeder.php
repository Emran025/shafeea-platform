<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoSupervisorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeds demo teachers with specific creation dates and memorization levels
     * Useful for demonstrating historical data and various teacher states
     */
    public function run(): void
    {
        // Get a random school to assign teachers to
        $schoolId = School::inRandomOrder()->first()?->id;

        if (! $schoolId) {
            $this->command->error('❌ No schools found! Please run SchoolSeeder first.');
            return;
        }

        $user = User::create([
            'name' => 'عمران غالب محمد ناصر',
            'email' => 'amran@naser.com',
            'password' => bcrypt('amran$$$025'),
            'avatar' => 'https://example.com/teacher.jpg',
            'gender' => "Male",
            'birth_date' => '1980-01-' . rand(10, 28),
            'phone' => '+967739123473',
            'whatsapp' => '+96771989025',
            'country' => 'اليمن',
            'city' => 'صنعاء',
            'residence' => 'التحرير',
            'school_id' => $schoolId,
        ]);

        Admin::create([
            'user_id' => $user->id,
            'super_admin' => true,
            'status' => 'accepted',
        ]);
        $this->command->info('✅ Created demo Supervisor.');
    }
}
