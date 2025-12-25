import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PasswordInput } from '@/components/password-input';
import { PasswordGroup } from '@/components/password-group';
import { EmailInput } from '@/components/email-input'; // استيراد المكون الجديد
import { type SharedData , PageProps  , Session} from '@/types';
import {
    Globe,
    Smartphone,
    ShieldCheck,
    Clock,
    Trash2,
    Monitor,
    User,
    Key,
    CheckCircle
} from 'lucide-react';

interface UserIndexProps extends PageProps {
    sessions:  Session[];
}

export default function AccountIndex() {
  
    const { sessions } = usePage<UserIndexProps>().props;
    const { auth , flash } = usePage<SharedData>().props;

    const { data: profileData, setData: setProfileData, put: updateProfile, processing: processingProfile, errors: profileErrors } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
    });

    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: processingPassword, errors: passwordErrors, reset: resetPasswordForm } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function handleProfileSubmit(e: React.FormEvent) {
        e.preventDefault();
        updateProfile('/admin/account/profile');
    }

    function handlePasswordSubmit(e: React.FormEvent) {
        e.preventDefault();
        updatePassword('/admin/account/password', {
            onSuccess: () => resetPasswordForm(),
        });
    }

    // Helper function to return the appropriate icon based on OS version
    const getDeviceIcon = (osVersion: string | null | undefined) => {
        const os = (osVersion || '').toLowerCase();
        if (os.includes('win') || os.includes('mac') || os.includes('linux') || os.includes('ubuntu') || os.includes('desktop')) {
            return <Monitor className="w-6 h-6 text-gray-600 dark:text-gray-300" />;
        }
        // Default to smartphone for android, ios, or unknown
        return <Smartphone className="w-6 h-6 text-gray-600 dark:text-gray-300" />;
    };

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">إعدادات الحساب</h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">إدارة معلومات ملفك الشخصي وتأمين حسابك وجلساتك.</p>
                </div>

                {flash?.success && (
                    <Alert className="animate-fade-in bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle>تم بنجاح!</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                    {/* 1. Profile Information Card */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col h-full">
                        {/* 
                            التعديل هنا: 
                            تم إضافة flex flex-col للـ div الداخلي 
                            و flex-1 للـ form لتوزيع المساحة 
                        */}
                        <div className="p-6 flex-1 flex flex-col">
                            {/* Card Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                    <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">المعلومات الشخصية</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">تحديث اسمك وبريدك الإلكتروني</p>
                                </div>
                            </div>

                            <form onSubmit={handleProfileSubmit} className="flex-1 flex flex-col justify-between space-y-5">
                                <div className="space-y-6">
                                    <div className="space-y-2.5">
                                        <Label htmlFor="name" className="text-foreground font-semibold text-sm">الاسم الكامل</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData('name', e.target.value)}
                                            className="h-10"
                                        />
                                        {profileErrors.name && <p className="text-sm text-red-600 font-medium animate-fade-in">{profileErrors.name}</p>}
                                    </div>

                                    {/* استخدام مكون EmailInput الجديد */}
                                    <EmailInput
                                        value={profileData.email}
                                        onChange={(e) => setProfileData('email', e.target.value)}
                                        error={profileErrors.email}
                                    />
                                </div>

                                <div className="pt-4 flex justify-end mt-auto">
                                    <Button type="submit" disabled={processingProfile} className="w-full sm:w-auto">
                                        حفظ التغييرات
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* 2. Update Password Card */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col h-full">
                        <div className="p-6 flex-1 flex flex-col">
                            {/* Card Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">الأمان وكلمة المرور</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">تحديث كلمة المرور لحماية حسابك</p>
                                </div>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="flex-1 flex flex-col justify-between space-y-6">
                                <div className="space-y-6">
                                    {/* Current Password Field */}
                                    <PasswordInput
                                        id="current_password"
                                        label="كلمة المرور الحالية"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                        error={passwordErrors.current_password}
                                        autoComplete="current-password"
                                    />

                                    {/* New Password & Confirmation */}
                                    <PasswordGroup
                                        // Password Field
                                        passwordValue={passwordData.password}
                                        onPasswordChange={(e) => setPasswordData('password', e.target.value)}
                                        passwordError={passwordErrors.password}
                                        passwordLabel="كلمة المرور الجديدة"
                                        
                                        // Confirmation Field
                                        confirmValue={passwordData.password_confirmation}
                                        onConfirmChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                        confirmLabel="تأكيد كلمة المرور"
                                        
                                        // Settings
                                        layout="column"
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="pt-4 flex justify-end mt-auto">
                                    <Button type="submit" disabled={processingPassword} className="w-full sm:w-auto">
                                        تحديث كلمة المرور
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* 3. Active Sessions Card (Full Width) */}
                <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="p-6">
                        {/* Card Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">الجلسات النشطة</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">إدارة وعرض جلساتك النشطة على الأجهزة الأخرى</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {sessions.map((session, index) => (
                                <div 
                                    key={session.device_id || index} 
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500/30 hover:bg-blue-50/30 dark:hover:bg-gray-700/30 transition-all duration-200"
                                >
                                    {/* Device Info Side */}
                                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                                        {/* Dynamic Icon based on OS */}
                                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                            {getDeviceIcon(session.os_version)}
                                        </div>

                                        <div className="space-y-1">
                                            {/* Primary Identifier: Model & Manufacturer */}
                                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                {session.manufacturer ? session.manufacturer.charAt(0).toUpperCase() + session.manufacturer.slice(1) : ''} {session.model || 'جهاز غير معروف'}
                                            </h3>

                                            {/* Secondary Tech Details: OS & App Version */}
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/50">
                                                    {session.os_version || 'نظام غير معروف'}
                                                </span>
                                                <span>•</span>
                                                <span>تطبيق v{session.app_version || '?'}</span>
                                            </div>

                                            {/* Context Details: Time & Location (Timezone) */}
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                <span title={session.login_time ? new Date(session.login_time).toString() : ''}>
                                                    {session.login_time 
                                                        ? new Intl.DateTimeFormat('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric', 
                                                            hour: 'numeric', 
                                                            minute: 'numeric', 
                                                            hour12: true 
                                                          }).format(new Date(session.login_time))
                                                        : 'وقت غير معروف'}
                                                </span>
                                                {session.timezone && (
                                                    <>
                                                        <span>•</span>
                                                        <Globe className="w-3 h-3" />
                                                        <span>{session.timezone}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Side */}
                                    <div className="flex items-center">
                                        <Button
                                            onClick={() => router.delete(`/admin/account/sessions/${session.device_id}`, { preserveScroll: true })}
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm h-10 px-4 rounded-lg w-full sm:w-auto transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 ml-2" />
                                            إلغاء الوصول
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            
                            {sessions.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                                        <ShieldCheck className="w-6 h-6 opacity-50" />
                                    </div>
                                    <p>لا توجد جلسات نشطة حالياً.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}