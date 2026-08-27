<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'school_admin', 'display_name' => 'مدير المدرسة', 'description' => 'يمتلك كافة الصلاحيات على جميع الذكور والإناث'],
            ['name' => 'male_deputy', 'display_name' => 'نائب شؤون الذكور', 'description' => 'يمتلك صلاحيات كاملة ولكن النطاق مقيد بالذكور فقط'],
            ['name' => 'female_deputy', 'display_name' => 'نائبة شؤون الإناث', 'description' => 'تمتلك صلاحيات كاملة ولكن النطاق مقيد بالإناث فقط'],
            ['name' => 'halaqah_supervisor', 'display_name' => 'مشرف الحلقات', 'description' => 'إنشاء، تعديل، ترتيب الحلقات وتعيين المعلمين'],
            ['name' => 'registration_supervisor', 'display_name' => 'مشرف القبول والتسجيل', 'description' => 'تسجيل طلاب جدد ومراجعة الطلبات'],
            ['name' => 'reports_supervisor', 'display_name' => 'مشرف المتابعة والتقارير', 'description' => 'قراءة فقط للتقارير ومتابعة الحضور'],
            ['name' => 'pages_manager', 'display_name' => 'مدير الصفحات', 'description' => 'إدارة الصفحات الثابتة'],
            ['name' => 'chief_editor', 'display_name' => 'مدير التحرير', 'description' => 'إنشاء المواضيع وإسناد مهام الكتابة'],
            ['name' => 'editor', 'display_name' => 'محرر', 'description' => 'كتابة وتعديل المقالات المسندة إليه فقط'],
        ];

        foreach ($roles as $role) {
            \Illuminate\Support\Facades\DB::table('roles')->updateOrInsert(
                ['name' => $role['name']],
                $role
            );
        }

        $permissions = [
            ['code' => 'manage_school', 'label' => 'إدارة المدرسة بالكامل'],
            ['code' => 'manage_male_section', 'label' => 'إدارة شؤون الذكور'],
            ['code' => 'manage_female_section', 'label' => 'إدارة شؤون الإناث'],
            ['code' => 'manage_halaqahs', 'label' => 'إدارة الحلقات'],
            ['code' => 'manage_registrations', 'label' => 'إدارة القبول والتسجيل'],
            ['code' => 'view_reports', 'label' => 'عرض التقارير'],
            ['code' => 'manage_pages', 'label' => 'إدارة الصفحات'],
            ['code' => 'manage_articles', 'label' => 'إدارة المقالات والتحرير'],
            ['code' => 'write_articles', 'label' => 'كتابة المقالات المسندة'],
            ['code' => 'view_teachers', 'label' => 'عرض بيانات المعلمين'],
            ['code' => 'view_halaqas', 'label' => 'عرض بيانات الحلقات'],
        ];

        foreach ($permissions as $permission) {
            \Illuminate\Support\Facades\DB::table('permissions')->updateOrInsert(
                ['code' => $permission['code']],
                $permission
            );
        }
    }
}
