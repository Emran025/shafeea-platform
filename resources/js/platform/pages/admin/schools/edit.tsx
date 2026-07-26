import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/layouts/admin-layout';
import {
    Building2,
    MapPin,
    Phone,
    Globe,
    Upload,
    ArrowLeft,
    School2,
    CheckCircle,
    AlertCircle,
    Key,
    Lock,
    FileCode,
    Sparkles,
} from 'lucide-react';
import { SharedData, School, User } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SchoolWithAdmin extends School {
    admin?: {
        user: User;
    };
}

interface EditProps extends SharedData {
    school: SchoolWithAdmin;
}

export default function Edit() {
    const { school } = usePage<EditProps>().props;
    const { flash } = usePage<SharedData>().props;

    // Form 1: Basic School Info
    const basicForm = useForm({
        name: school.name || '',
        logo: null as File | null,
        phone: school.phone || '',
        country: school.country || '',
        city: school.city || '',
        location: school.location || '',
        address: school.address || '',
    });

    // Form 2: Build & Keystore Configuration
    const buildForm = useForm({
        school_locked_mode: school.school_locked_mode ?? true,
        keystore_file: '', // Base64 content from client-side file reading
        keystore_store_password: '',
        keystore_key_alias: school.keystore_key_alias || '',
        keystore_key_password: '',
        build_notes: school.build_notes || '',
    });

    const [keystoreFileName, setKeystoreFileName] = useState<string>('');

    // Handle keystore file upload and client-side base64 conversion
    const handleKeystoreFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setKeystoreFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                // Extract clean base64 data URL string
                const base64Data = result.split(',')[1] || result;
                buildForm.setData('keystore_file', base64Data);
            };
            reader.readAsDataURL(file);
        }
    };

    function handleBasicSubmit(e: React.FormEvent) {
        e.preventDefault();
        basicForm.post(`/admin/schools/${school.id}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    function handleBuildSubmit(e: React.FormEvent) {
        e.preventDefault();
        buildForm.put(`/admin/schools/${school.id}/build-config`, {
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout>
            <Head title={`تعديل إعدادات ${school.name} - لوحة التحكم`} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <a href={`/admin/schools/${school.id}`}>
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            العودة للتفاصيل
                        </a>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-1">تعديل إعدادات المدرسة</h1>
                        <p className="text-sm text-muted-foreground">إدارة المعلومات الأساسية وملفات توقيع وإعدادات البناء لـ {school.name}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Section 1: Basic Info Form (lg:col-span-7) */}
                    <div className="lg:col-span-7 space-y-6">
                        <Card className="border shadow-lg overflow-hidden">
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex items-center gap-4 pb-4 border-b border-border">
                                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">بيانات المنشأة الأساسية</h2>
                                        <p className="text-muted-foreground text-xs">المعلومات والبيانات العامة للمدرسة</p>
                                    </div>
                                </div>

                                {flash?.success && (
                                    <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <AlertTitle>نجاح!</AlertTitle>
                                        <AlertDescription>{flash.success}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleBasicSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* School Name */}
                                        <div className="space-y-1 md:col-span-2">
                                            <Label htmlFor="name" className="text-xs font-bold text-muted-foreground">اسم المدرسة / المنشأة</Label>
                                            <div className="relative">
                                                <School2 className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="name"
                                                    value={basicForm.data.name}
                                                    onChange={(e) => basicForm.setData('name', e.target.value)}
                                                    className="pr-10"
                                                    required
                                                />
                                            </div>
                                            {basicForm.errors.name && <p className="text-red-500 text-xs">{basicForm.errors.name}</p>}
                                        </div>

                                        {/* Logo Upload */}
                                        <div className="space-y-1 md:col-span-2">
                                            <Label htmlFor="logo" className="text-xs font-bold text-muted-foreground">تحديث الشعار</Label>
                                            <div className="border border-dashed border-border rounded-xl p-4 text-center hover:bg-muted/50 transition-all duration-300 relative cursor-pointer bg-card flex items-center justify-center gap-4">
                                                <input
                                                    id="logo"
                                                    type="file"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => basicForm.setData('logo', e.target.files?.[0] || null)}
                                                />
                                                <Upload className="w-5 h-5 text-muted-foreground" />
                                                <span className="text-sm text-foreground">
                                                    {basicForm.data.logo ? basicForm.data.logo.name : "اختر صورة شعار جديدة لتحديثها"}
                                                </span>
                                            </div>
                                            {basicForm.errors.logo && <p className="text-red-500 text-xs">{basicForm.errors.logo}</p>}
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-1">
                                            <Label htmlFor="phone" className="text-xs font-bold text-muted-foreground">رقم الهاتف الرسمي</Label>
                                            <div className="relative">
                                                <Phone className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    value={basicForm.data.phone}
                                                    onChange={(e) => basicForm.setData('phone', e.target.value)}
                                                    className="pr-10 text-left"
                                                    dir="ltr"
                                                />
                                            </div>
                                            {basicForm.errors.phone && <p className="text-red-500 text-xs">{basicForm.errors.phone}</p>}
                                        </div>

                                        {/* Country */}
                                        <div className="space-y-1">
                                            <Label htmlFor="country" className="text-xs font-bold text-muted-foreground">الدولة</Label>
                                            <div className="relative">
                                                <Globe className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="country"
                                                    value={basicForm.data.country}
                                                    onChange={(e) => basicForm.setData('country', e.target.value)}
                                                    className="pr-10"
                                                />
                                            </div>
                                            {basicForm.errors.country && <p className="text-red-500 text-xs">{basicForm.errors.country}</p>}
                                        </div>

                                        {/* City */}
                                        <div className="space-y-1">
                                            <Label htmlFor="city" className="text-xs font-bold text-muted-foreground">المدينة</Label>
                                            <div className="relative">
                                                <MapPin className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="city"
                                                    value={basicForm.data.city}
                                                    onChange={(e) => basicForm.setData('city', e.target.value)}
                                                    className="pr-10"
                                                />
                                            </div>
                                            {basicForm.errors.city && <p className="text-red-500 text-xs">{basicForm.errors.city}</p>}
                                        </div>

                                        {/* Maps Link */}
                                        <div className="space-y-1">
                                            <Label htmlFor="location" className="text-xs font-bold text-muted-foreground">موقع خرائط Google</Label>
                                            <div className="relative">
                                                <MapPin className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="location"
                                                    value={basicForm.data.location}
                                                    onChange={(e) => basicForm.setData('location', e.target.value)}
                                                    className="pr-10 text-left font-mono text-xs"
                                                    dir="ltr"
                                                />
                                            </div>
                                            {basicForm.errors.location && <p className="text-red-500 text-xs">{basicForm.errors.location}</p>}
                                        </div>

                                        {/* Address */}
                                        <div className="space-y-1 md:col-span-2">
                                            <Label htmlFor="address" className="text-xs font-bold text-muted-foreground">العنوان بالتفصيل</Label>
                                            <div className="relative">
                                                <MapPin className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="address"
                                                    value={basicForm.data.address}
                                                    onChange={(e) => basicForm.setData('address', e.target.value)}
                                                    className="pr-10"
                                                />
                                            </div>
                                            {basicForm.errors.address && <p className="text-red-500 text-xs">{basicForm.errors.address}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                        <Button type="submit" disabled={basicForm.processing} className="px-6 bg-blue-600 hover:bg-blue-700">
                                            {basicForm.processing ? 'جاري الحفظ...' : 'حفظ التعديلات الأساسية'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>

                    {/* Section 2: Build & Keystore Configuration (lg:col-span-5) */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="border shadow-lg overflow-hidden">
                            <div className="p-6 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/10">
                                <div className="flex items-center gap-4 pb-4 border-b border-border">
                                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">توقيع وإعدادات التطبيق</h2>
                                        <p className="text-muted-foreground text-xs">إعدادات Keystore لتوقيع حزم Android</p>
                                    </div>
                                </div>

                                <form onSubmit={handleBuildSubmit} className="space-y-6">
                                    {/* App Lock Switch */}
                                    <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                                        <div className="space-y-0.5 ml-4">
                                            <Label htmlFor="locked-mode" className="text-sm font-semibold flex items-center gap-1.5">
                                                <Lock className="w-4 h-4 text-indigo-600" />
                                                وضع قفل المدرسة (School-Locked)
                                            </Label>
                                            <p className="text-xs text-muted-foreground">تضمين مفتاح المدرسة للاتصال ببياناتها حصراً</p>
                                        </div>
                                        <Switch
                                            id="locked-mode"
                                            checked={buildForm.data.school_locked_mode}
                                            onCheckedChange={(checked) => buildForm.setData('school_locked_mode', checked)}
                                        />
                                    </div>

                                    {/* Keystore File */}
                                    <div className="space-y-1">
                                        <Label htmlFor="keystore_file" className="text-xs font-bold text-muted-foreground">ملف مفاتيح التوقيع (Keystore .jks/.keystore)</Label>
                                        <div className="border border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/50 transition-all duration-300 relative cursor-pointer bg-background">
                                            <input
                                                id="keystore_file"
                                                type="file"
                                                accept=".jks,.keystore"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleKeystoreFileChange}
                                            />
                                            <div className="flex flex-col items-center gap-2">
                                                <FileCode className="w-8 h-8 text-indigo-500" />
                                                <span className="text-sm text-foreground">
                                                    {keystoreFileName ? keystoreFileName : "اضغط لرفع ملف المفاتيح الجديد"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">سيتم تشفيره بأمان تلقائياً</span>
                                            </div>
                                        </div>
                                        {buildForm.errors.keystore_file && <p className="text-red-500 text-xs">{buildForm.errors.keystore_file}</p>}
                                    </div>

                                    {/* Store Password */}
                                    <div className="space-y-1">
                                        <Label htmlFor="keystore_store_password" className="text-xs font-bold text-muted-foreground">كلمة مرور مستودع المفاتيح (Store Password)</Label>
                                        <Input
                                            id="keystore_store_password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={buildForm.data.keystore_store_password}
                                            onChange={(e) => buildForm.setData('keystore_store_password', e.target.value)}
                                            className="font-mono text-sm bg-background"
                                        />
                                        {buildForm.errors.keystore_store_password && <p className="text-red-500 text-xs">{buildForm.errors.keystore_store_password}</p>}
                                    </div>

                                    {/* Key Alias */}
                                    <div className="space-y-1">
                                        <Label htmlFor="keystore_key_alias" className="text-xs font-bold text-muted-foreground">اسم مفتاح التوقيع المستعار (Key Alias)</Label>
                                        <Input
                                            id="keystore_key_alias"
                                            placeholder="key0"
                                            value={buildForm.data.keystore_key_alias}
                                            onChange={(e) => buildForm.setData('keystore_key_alias', e.target.value)}
                                            className="font-mono text-sm bg-background"
                                        />
                                        {buildForm.errors.keystore_key_alias && <p className="text-red-500 text-xs">{buildForm.errors.keystore_key_alias}</p>}
                                    </div>

                                    {/* Key Password */}
                                    <div className="space-y-1">
                                        <Label htmlFor="keystore_key_password" className="text-xs font-bold text-muted-foreground">كلمة مرور مفتاح التوقيع (Key Password)</Label>
                                        <Input
                                            id="keystore_key_password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={buildForm.data.keystore_key_password}
                                            onChange={(e) => buildForm.setData('keystore_key_password', e.target.value)}
                                            className="font-mono text-sm bg-background"
                                        />
                                        {buildForm.errors.keystore_key_password && <p className="text-red-500 text-xs">{buildForm.errors.keystore_key_password}</p>}
                                    </div>

                                    {/* Build Notes */}
                                    <div className="space-y-1">
                                        <Label htmlFor="build_notes" className="text-xs font-bold text-muted-foreground">ملاحظات إضافية للبناء</Label>
                                        <Textarea
                                            id="build_notes"
                                            placeholder="اكتب أي متطلبات خاصة بالبناء أو الإصدارات هنا..."
                                            value={buildForm.data.build_notes}
                                            onChange={(e) => buildForm.setData('build_notes', e.target.value)}
                                            rows={3}
                                            className="bg-background text-sm"
                                        />
                                        {buildForm.errors.build_notes && <p className="text-red-500 text-xs">{buildForm.errors.build_notes}</p>}
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-border">
                                        <Button type="submit" disabled={buildForm.processing} className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2">
                                            <Sparkles className="w-4 h-4" />
                                            {buildForm.processing ? 'جاري حفظ الإعدادات...' : 'حفظ إعدادات البناء'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
