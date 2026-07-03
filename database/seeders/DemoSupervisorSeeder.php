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
            'name' => 'المشرف العام',
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
            'avatar' => 'https://example.com/teacher.jpg',
            'gender' => "Male",
            'birth_date' => '1980-01-' . rand(10, 28),
            'phone' => '+967734567890',
            'whatsapp' => '+967773456789',
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
