<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Seeder;

class InitialAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeds the initial super admin user and admin record.
     * This seeder is idempotent and safe to run multiple times.
     */
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' =>  config('app.admin_email')],
            [
                'name' => config('app.admin_name'),
                'password' => bcrypt(config('app.admin_password')),
                'avatar' => 'https://example.com/avatar.jpg',
                'gender' => "Male",
                'birth_date' => '1980-01-15',
                'phone' => config('app.admin_phone'),
                'whatsapp' => config('app.admin_whatsapp'),
                'country' => 'اليمن',
                'city' => 'صنعاء',
                'residence' => 'التحرير',
                'status' => 'active',
                'school_id' => null,
            ]
        );

        Admin::updateOrCreate(
            ['user_id' => $user->id],
            [
                'super_admin' => true,
                'status' => 'accepted',
            ]
        );

        $this->command->info('✅ Initial Admin user verified/created.');
    }
}
