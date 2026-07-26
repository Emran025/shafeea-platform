<?php

namespace Database\Seeders;

use App\Models\Auth\Admin;
use App\Models\School\School;
use App\Models\Auth\User;
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
        $school = School::updateOrCreate(
            ['school_code' => 'shafeea'],
            [
                'name' => "مدرسة شفيع الإفتراضية",
                'logo' => "https://shafeea.systems360.cloud/logo.png",
                'phone' => '+96605' . rand(1000000, 9999999),
                'country' => 'المملكة العربية السعودية',
                'city' => 'مكة المكرمة',
                'location' => '21.4225,39.82617',
                'address' => "shafeea.systems360.cloud",
                'is_active' => true,
                'school_locked_mode' => true,
                'approved_at' => now(),
                'app_key' => config('services.virtual_school.app_key'),
                'build_status' => 'not_built',
                'keystore_file' => config('services.virtual_school.keystore_file'),
                'keystore_store_password' => config('services.virtual_school.store_password'),
                'keystore_key_alias' => config('services.virtual_school.key_alias'),
                'keystore_key_password' => config('services.virtual_school.key_password'),
                'build_notes' => 'المدرسة الافتراضية الرئيسية لمنصة شفيع.',
            ]
        );

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
                'residence' => 'اليمن',
                'status' => 'active',
                'school_id' => $school->id,
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
