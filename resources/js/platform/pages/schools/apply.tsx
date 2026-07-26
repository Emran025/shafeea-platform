import { Head, useForm, usePage } from '@inertiajs/react';
import { useUsernameSuggestion } from '@/hooks/use-username-suggestion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SiteLayout from '@/layouts/site-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Building2,
    UserCog,
    MapPin,
    Phone,
    Globe,
    Upload,
    Award,
    ArrowLeft,
    School2,
    CheckCircle,
    PlusCircle,
    Trash2,
    AlertCircle,
} from 'lucide-react';
import { SharedData } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { EmailInput } from '@/components/email-input'; 
import { PasswordGroup } from '@/components/password-group'; 
import { CountrySelect } from '@/components/country-select';
import { PhoneInput } from '@/components/phone-input';
import React from 'react';

export default function Apply() {
    const { flash } = usePage<SharedData>().props;
    const { data, setData, post, transform, errors, setError, clearErrors, processing } = useForm({
        error: '',
        subscription_plan_id: '' as string | number,
        school_name: '',
        school_code: '',
        school_logo: null as File | null,
        school_phone: '',
        school_phone_zone: '',
        school_country: '',
        school_city: '',
        school_location: '',
        school_address: '',
        user_name: '',
        user_email: '',
        user_phone: '',
        user_phone_zone: '',
        user_whatsapp: '',
        user_whatsapp_zone: '',
        is_whatsapp_different: false,
        user_country: '',
        user_residence: '',
        user_city: '',
        user_password: '',
        user_password_confirmation: '',
        documents: [
            {
                name: '',
                certificate_type: '',
                certificate_type_other: '',
                riwayah: '',
                issuing_place: '',
                issuing_date: '',
                file: null as File | null,
            }
        ]
    });

    // Read plan_id from the URL query string (?plan_id=X) so that clicking
    // "Choose this Plan" on the pricing page pre-selects the plan through
    // the multi-step registration session.
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const planId = params.get('plan_id');
        if (planId) {
            setData('subscription_plan_id', planId);
        }
    }, []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Check for client-side file/logo errors
        const formErrors = errors as Record<string, string | undefined>;

        const hasFileErrors = Object.keys(formErrors).some(
            key =>
                (key === 'school_logo' ||
                    (key.startsWith('documents.') && key.endsWith('.file'))) &&
                !!formErrors[key]
        );
        if (hasFileErrors) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Filter out completely empty documents
        const filteredDocs = data.documents.filter(doc => 
            doc.name.trim() !== '' || 
            doc.certificate_type !== '' || 
            doc.file !== null
        );

        transform((data) => ({
            ...data,
            documents: filteredDocs.length > 0 ? filteredDocs : [],
        }));

        post(route('register.validate'), {
            forceFormData: true,
            onSuccess: () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onError: () => {
                // Validation failed — make sure the summary banner (which
                // lists every rejected field) is actually visible instead of
                // leaving the user wherever they were on a long form.
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            preserveScroll: false,
        });
    }

    const addCertificate = () => {
        setData('documents', [...data.documents, {
            name: '',
            certificate_type: '',
            certificate_type_other: '',
            riwayah: '',
            issuing_place: '',
            issuing_date: '',
            file: null,
        }]);
    };

    const removeCertificate = (index: number) => {
        const documents = [...data.documents];
        if (documents.length > 1) {
            documents.splice(index, 1);
            setData('documents', documents);
        }
    };

    // ── Username suggestion for school admin ───────────────────────────────
    // Read-only preview — school admins do not have a username column;
    // this is purely informational so the admin knows what their login
    // username will be (generated automatically from their full name).
    const { suggestion: usernameSuggestion, loading: usernameLoading } =
        useUsernameSuggestion(data.user_name);
    // ─────────────────────────────────────────────────────────────────────────────

    const handleLogoChange = (file: File | null) => {
        setData('school_logo', file);
        if (file) {
            const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
            const allowedExtensions = ['.png', '.jpg', '.jpeg'];
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            const maxSizeBytes = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
                setError('school_logo', 'شعار المدرسة غير صالح. الأنواع المسموح بها هي: PNG, JPG, JPEG.');
            } else if (file.size > maxSizeBytes) {
                setError('school_logo', 'حجم شعار المدرسة كبير جداً. الحد الأقصى المسموح به هو 5 ميجابايت.');
            } else {
                clearErrors('school_logo');
            }
        } else {
            clearErrors('school_logo');
        }
    };

    const handleDocumentChange = (index: number, field: string, value: string | File | null) => {
        const documents = [...data.documents];
        documents[index] = { ...documents[index], [field]: value } as any;
        setData('documents', documents);

        if (field === 'file') {
            if (value instanceof File) {
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
                const fileExtension = value.name.substring(value.name.lastIndexOf('.')).toLowerCase();
                const maxSizeBytes = 5 * 1024 * 1024; // 5MB

                if (!allowedTypes.includes(value.type) && !allowedExtensions.includes(fileExtension)) {
                    setError(`documents.${index}.file`, 'نوع الملف غير مدعوم. الأنواع المسموح بها هي: PDF, JPG, JPEG, PNG.');
                } else if (value.size > maxSizeBytes) {
                    setError(`documents.${index}.file`, 'حجم الملف كبير جداً. الحد الأقصى المسموح به هو 5 ميجابايت.');
                } else {
                    clearErrors(`documents.${index}.file`);
                }
            } else if (value === null) {
                clearErrors(`documents.${index}.file`);
            }
        }
    };

    return (
        <SiteLayout>
            <Head title="تسجيل منشأة تعليمية - شفيع" />

            {/* --- Hero Section --- */}
            <section className="relative py-24 gradient-hero overflow-hidden animate-fade-in-up">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-transparent dark:bg-black/40 transition-colors duration-300"></div>
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    </div>
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl mb-6 shadow-2xl hover:scale-105 transition-transform duration-300">
                        <School2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        انضم إلى مجتمع شفيع
                    </h1>
                    <p className="text-xl text-blue-50/90 max-w-2xl mx-auto leading-relaxed font-light">
                        سجل منشأتك التعليمية الآن وابدأ رحلة التحول الرقمي في إدارة حلقات تحفيظ القرآن الكريم بأحدث التقنيات.
                    </p>
                </div>
            </section>

            {/* --- Form Section --- */}
            <section className="py-16 bg-background relative -mt-10">
                <div className="container mx-auto px-4">
                    <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-card overflow-hidden rounded-3xl relative z-20 ring-1 ring-border/50">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>

                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className="p-8 md:p-12">
                                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">بيانات المنشأة</h2>
                                        <p className="text-muted-foreground text-sm">المعلومات الأساسية للمدرسة أو المركز</p>
                                    </div>
                                </div>

                                {flash?.success && (
                                <Alert className="mb-6 animate-fade-in bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <AlertTitle>نجاح!</AlertTitle>
                                    <AlertDescription>{flash.success}</AlertDescription>
                                </Alert>
                                )}
                                {errors.error && (
                                    <Alert variant="destructive" className="mb-6 animate-fade-in">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>خطأ!</AlertTitle>
                                        <AlertDescription>{errors.error}</AlertDescription>
                                    </Alert>
                                )}

                                {Object.keys(errors).filter((key) => key !== 'error').length > 0 && (
                                    <Alert variant="destructive" className="mb-6 animate-fade-in">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>يوجد {Object.keys(errors).filter((key) => key !== 'error').length} حقل يحتاج للتصحيح</AlertTitle>
                                        <AlertDescription>
                                            <ul className="list-disc list-inside mt-2 space-y-1">
                                                {Object.entries(errors)
                                                    .filter(([key]) => key !== 'error')
                                                    .map(([key, message]) => (
                                                        <li key={key}>{message}</li>
                                                    ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* School Name */}
                                    <div className="space-y-1 md:col-span-2">
                                        <Label htmlFor="school_name" className="text-foreground font-semibold text-sm mb-2.5 block">اسم المدرسة / المنشأة</Label>
                                        <div className="relative group">
                                            <School2 className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors duration-200" />
                                            <Input
                                                id="school_name"
                                                placeholder="مثال: مجمع النور القرآني"
                                                value={data.school_name}
                                                onChange={(e) => setData('school_name', e.target.value)}
                                                className="pr-11"
                                                autoComplete="off"
                                            />
                                        </div>
                                        {errors.school_name && <p className="text-red-500 text-xs mt-1">{errors.school_name}</p>}
                                    </div>

                                    {/* School Code */}
                                    <div className="space-y-1">
                                        <Label htmlFor="school_code" className="text-foreground font-semibold text-sm mb-2.5 block">
                                            رمز المدرسة <span className="text-red-500">*</span>
                                            <span className="text-xs font-normal text-muted-foreground mr-2">(Subdomain & App Identifier)</span>
                                        </Label>
                                        <div className="relative group">
                                            <span className="absolute right-3.5 top-3 text-muted-foreground text-xs font-mono select-none pointer-events-none">#</span>
                                            <Input
                                                id="school_code"
                                                placeholder="al-noor-center"
                                                value={data.school_code}
                                                onChange={(e) => setData('school_code', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                                className="pr-8 font-mono text-sm"
                                                dir="ltr"
                                                autoComplete="off"
                                            />
                                        </div>
                                        {errors.school_code
                                            ? <p className="text-red-500 text-xs mt-1">{errors.school_code}</p>
                                            : <p className="text-xs text-muted-foreground mt-1">
                                                أحرف إنجليزية صغيرة وأرقام وشرطات فقط &mdash; سيكون عنوان النطاق الفرعي: <span className="font-mono">{data.school_code || 'school-code'}.shafeea.systems360.cloud</span>
                                              </p>
                                        }
                                    </div>

                                    {/* Logo Upload */}
                                    <div className="space-y-1 md:col-span-2">
                                        <Label htmlFor="school_logo" className="text-foreground font-semibold text-sm mb-2.5 block">شعار المدرسة</Label>
                                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/50 hover:border-blue-500/40 transition-all duration-300 relative cursor-pointer group bg-card">
                                            <input
                                                id="school_logo"
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => handleLogoChange(e.target.files ? e.target.files[0] : null)}
                                            />
                                            <div className="flex flex-col items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                                                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mb-1 shadow-sm">
                                                    <Upload className="w-7 h-7" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {data.school_logo ? data.school_logo.name : "اضغط لرفع الشعار أو اسحبه هنا"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG حتى 5 ميجابايت</p>
                                                </div>
                                            </div>
                                        </div>
                                        {errors.school_logo && <p className="text-red-500 text-xs mt-1">{errors.school_logo}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="school_phone" className="text-foreground font-semibold text-sm mb-2.5 block">رقم الهاتف الرسمي</Label>
                                        <PhoneInput
                                            phoneValue={data.school_phone}
                                            onPhoneChange={(val) => setData('school_phone', val)}
                                            zoneValue={data.school_phone_zone}
                                            onZoneChange={(val) => setData('school_phone_zone', val)}
                                            error={errors.school_phone || errors.school_phone_zone}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="school_country" className="text-foreground font-semibold text-sm mb-2.5 block">الدولة</Label>
                                        <CountrySelect
                                            value={data.school_country}
                                            onChange={(val) => setData('school_country', val)}
                                            error={errors.school_country}
                                        />
                                        {errors.school_country && <p className="text-red-500 text-xs mt-1">{errors.school_country}</p>}
                                    </div>

                                    {/* City */}
                                    <div className="space-y-1">
                                        <Label htmlFor="school_city" className="text-foreground font-semibold text-sm mb-2.5 block">المدينة</Label>
                                        <div className="relative group">
                                            <MapPin className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors duration-200" />
                                            <Input
                                                id="school_city"
                                                placeholder="الرياض"
                                                value={data.school_city}
                                                onChange={(e) => setData('school_city', e.target.value)}
                                                className="pr-11"
                                            />
                                        </div>
                                        {errors.school_city && <p className="text-red-500 text-xs mt-1">{errors.school_city}</p>}
                                    </div>

                                    {/* Location URL */}
                                    <div className="space-y-1">
                                        <Label htmlFor="school_location" className="text-foreground font-semibold text-sm mb-2.5 block">رابط الموقع (Google Maps)</Label>
                                        <div className="relative group">
                                            <MapPin className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground z-10 group-hover:text-blue-500 transition-colors duration-200" />
                                            <Input
                                                id="school_location"
                                                placeholder="https://maps.google.com/..."
                                                value={data.school_location}
                                                onChange={(e) => setData('school_location', e.target.value)}
                                                className="pr-11 text-left"
                                                dir="ltr"
                                            />
                                        </div>
                                        {errors.school_location && <p className="text-red-500 text-xs mt-1">{errors.school_location}</p>}
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-1 md:col-span-2">
                                        <Label htmlFor="school_address" className="text-foreground font-semibold text-sm mb-2.5 block">العنوان الوطني / التفصيلي</Label>
                                        <Input
                                            id="school_address"
                                            placeholder="الحي، الشارع، رقم المبنى..."
                                            value={data.school_address}
                                            onChange={(e) => setData('school_address', e.target.value)}
                                        />
                                        {errors.school_address && <p className="text-red-500 text-xs mt-1">{errors.school_address}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted/30 dark:bg-gray-800/20 p-8 md:p-12 border-t border-border">
                                <div className="flex items-center gap-4 mb-10 pb-4 border-b border-border">
                                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <UserCog className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">بيانات مدير النظام</h2>
                                        <p className="text-muted-foreground text-sm">المسؤول عن إدارة حساب المدرسة</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Admin Name */}
                                    <div className="space-y-1">
                                        <Label htmlFor="user_name" className="text-foreground font-semibold text-sm mb-2.5 block">الاسم الثلاثي</Label>
                                        <div className="relative group">
                                            <UserCog className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors duration-200" />
                                            <Input
                                                id="user_name"
                                                placeholder="اسم المدير المسؤول"
                                                value={data.user_name}
                                                onChange={(e) => setData('user_name', e.target.value)}
                                                className="pr-11"
                                                autoComplete="off"
                                            />
                                        </div>
                                        {errors.user_name && <p className="text-red-500 text-xs mt-1">{errors.user_name}</p>}
                                        {/* Username preview */}
                                        {(usernameSuggestion || usernameLoading) && (
                                            <p className="text-[11px] mt-1.5 flex items-center gap-1.5">
                                                {usernameLoading ? (
                                                    <>
                                                        <span className="inline-block w-3 h-3 border-2 border-emerald-400/40 border-t-emerald-500 rounded-full animate-spin" />
                                                        <span className="text-muted-foreground">جاري توليد اسم المستخدم...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-emerald-500">✦</span>
                                                        <span className="text-muted-foreground">سيكون اسم الدخول:</span>
                                                        <code className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded text-xs">
                                                            {usernameSuggestion}
                                                        </code>
                                                    </>
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1 space-y-1">
                                                <Label htmlFor="user_phone" className="text-foreground font-semibold text-sm mb-2.5 block">رقم الهاتف (للدخول)</Label>
                                                <PhoneInput
                                                    phoneValue={data.user_phone}
                                                    onPhoneChange={(val) => setData('user_phone', val)}
                                                    zoneValue={data.user_phone_zone}
                                                    onZoneChange={(val) => setData('user_phone_zone', val)}
                                                    error={errors.user_phone || errors.user_phone_zone}
                                                />
                                            </div>

                                            <div className="flex items-end pb-2.5">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <div className="relative">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={data.is_whatsapp_different}
                                                            onChange={(e) => setData('is_whatsapp_different', e.target.checked)}
                                                        />
                                                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground group-hover:text-emerald-500 transition-colors">رقم الواتساب مختلف؟</span>
                                                </label>
                                            </div>
                                        </div>

                                        {data.is_whatsapp_different && (
                                            <div className="mt-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Label htmlFor="user_whatsapp" className="text-foreground font-semibold text-sm mb-2.5 block">رقم الواتساب</Label>
                                                <PhoneInput
                                                    phoneValue={data.user_whatsapp}
                                                    onPhoneChange={(val) => setData('user_whatsapp', val)}
                                                    zoneValue={data.user_whatsapp_zone}
                                                    onZoneChange={(val) => setData('user_whatsapp_zone', val)}
                                                    error={errors.user_whatsapp || errors.user_whatsapp_zone}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="user_country" className="text-foreground font-semibold text-sm mb-2.5 block">الجنسية</Label>
                                        <CountrySelect
                                            value={data.user_country}
                                            onChange={(val) => setData('user_country', val)}
                                            error={errors.user_country}
                                        />
                                        {errors.user_country && <p className="text-red-500 text-xs mt-1">{errors.user_country}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="user_residence" className="text-foreground font-semibold text-sm mb-2.5 block">دولة الإقامة</Label>
                                        <CountrySelect
                                            value={data.user_residence}
                                            onChange={(val) => setData('user_residence', val)}
                                            error={errors.user_residence}
                                        />
                                        {errors.user_residence && <p className="text-red-500 text-xs mt-1">{errors.user_residence}</p>}
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <Label htmlFor="user_city" className="text-foreground font-semibold text-sm mb-2.5 block">المدينة</Label>
                                        <div className="relative group">
                                            <MapPin className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors duration-200" />
                                            <Input
                                                id="user_city"
                                                placeholder="الرياض"
                                                value={data.user_city}
                                                onChange={(e) => setData('user_city', e.target.value)}
                                                className="pr-11"
                                            />
                                        </div>
                                        {errors.user_city && <p className="text-red-500 text-xs mt-1">{errors.user_city}</p>}
                                    </div>

                                    {/* Admin Email */}
                                    <div className="space-y-1 md:col-span-2">
                                        <EmailInput
                                            value={data.user_email}
                                            onChange={(e) => setData('user_email', e.target.value)}
                                            error={errors.user_email}
                                        />
                                    </div>

                                    {/* Password Group */}
                                    <div className="space-y-1 md:col-span-2">
                                        <PasswordGroup
                                            passwordValue={data.user_password}
                                            onPasswordChange={(e) => setData('user_password', e.target.value)}
                                            passwordError={errors.user_password}
                                            
                                            confirmValue={data.user_password_confirmation}
                                            onConfirmChange={(e) => setData('user_password_confirmation', e.target.value)}
                                            confirmError={errors.user_password_confirmation}
                                            
                                            layout="row"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-8 md:p-12 border-t border-border bg-background">
                                <div className="flex items-center gap-4 mb-10 pb-4 border-b border-border">
                                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">الوثائق والشهادات</h2>
                                        <p className="text-muted-foreground text-sm">التراخيص والشهادات الرسمية للمنشأة</p>
                                    </div>
                                </div>

                                {errors.documents && (
                                    <Alert variant="destructive" className="mb-6 animate-fade-in">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>خطأ في الوثائق!</AlertTitle>
                                        <AlertDescription>{errors.documents}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-8">
                                    {data.documents.map((doc, index) => (
                                        <div key={index} className="p-6 rounded-2xl border border-border bg-muted/20 relative group hover:border-purple-500/30 hover:shadow-sm transition-all duration-300">
                                            {data.documents.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeCertificate(index)}
                                                    className="absolute top-4 left-4 p-2 text-red-400 hover:text-red-600 bg-white dark:bg-gray-800 hover:bg-red-50 rounded-xl shadow-sm border border-border/50 transition-all opacity-0 group-hover:opacity-100"
                                                    title="حذف الوثيقة"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="md:col-span-2">
                                                    <Label htmlFor={`doc_name_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">اسم الشهادة/الوثيقة</Label>
                                                    <Input
                                                        placeholder="مثال: رخصة التحفيظ، سجل مزاولة مهنية، شهادة إجازة المشرف"
                                                        value={doc.name}
                                                        onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                                                        className={errors[`documents.${index}.name`] ? 'border-destructive' : ''}
                                                    />
                                                    {errors[`documents.${index}.name`] && (
                                                        <p className="text-destructive text-xs mt-1 font-medium">{errors[`documents.${index}.name`]}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor={`certificate_type_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">نوع الوثيقة</Label>
                                                    <Select
                                                        onValueChange={(value) => handleDocumentChange(index, 'certificate_type', value)}
                                                        value={doc.certificate_type}
                                                    >
                                                        <SelectTrigger className={`text-right ${errors[`documents.${index}.certificate_type`] ? 'border-destructive' : ''}`} dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                                            <SelectValue placeholder="اختر النوع" />
                                                        </SelectTrigger>
                                                        <SelectContent dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                                            <SelectItem value="شهادة إجازة في القران">شهادة إجازة في القران</SelectItem>
                                                            <SelectItem value="رخصة">رخصة رسمية</SelectItem>
                                                            <SelectItem value="سجل مهني">سجل مهني</SelectItem>
                                                            <SelectItem value="سيرة ذاتية">سيرة المشرف الذاتية</SelectItem>
                                                            <SelectItem value="Other">أخرى</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors[`documents.${index}.certificate_type`] && (
                                                        <p className="text-destructive text-xs mt-1 font-medium">{errors[`documents.${index}.certificate_type`]}</p>
                                                    )}
                                                </div>

                                                {doc.certificate_type === 'Other' && (
                                                    <div>
                                                        <Label htmlFor={`certificate_type_other_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">النوع (آخر)</Label>
                                                        <Input
                                                            placeholder="يرجى التحديد"
                                                            value={doc.certificate_type_other}
                                                            onChange={(e) => handleDocumentChange(index, 'certificate_type_other', e.target.value)}
                                                            className={errors[`documents.${index}.certificate_type_other`] ? 'border-destructive' : ''}
                                                        />
                                                        {errors[`documents.${index}.certificate_type_other`] && (
                                                            <p className="text-destructive text-xs mt-1 font-medium">{errors[`documents.${index}.certificate_type_other`]}</p>
                                                        )}
                                                    </div>
                                                )}

                                                {(doc.certificate_type === 'شهادة حفظ قران' || doc.certificate_type === 'شهادة إجازة في القران') && (
                                                    <div>
                                                        <Label htmlFor={`riwayah_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">الرواية</Label>
                                                        <Select
                                                            onValueChange={(value) => handleDocumentChange(index, 'riwayah', value)}
                                                            value={doc.riwayah}
                                                        >
                                                            <SelectTrigger className={`text-right ${errors[`documents.${index}.riwayah`] ? 'border-destructive' : ''}`} dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                                            <SelectValue placeholder="اختر الرواية" />
                                                            </SelectTrigger>
                                                            <SelectContent dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                                                <SelectItem value="قراءة الإمام نافع المدني">قراءة الإمام نافع المدني</SelectItem>
                                                                <SelectItem value="قراءة الإمام عبد الله بن كثير المكي">قراءة الإمام عبد الله بن كثير المكي</SelectItem>
                                                                <SelectItem value="قراءة الإمام أبو عمرو البصري">قراءة الإمام أبو عمرو البصري</SelectItem>
                                                                <SelectItem value="قراءة الإمام بن عامر الدمشقي">قراءة الإمام بن عامر الدمشقي</SelectItem>
                                                                <SelectItem value="قراءة الإمام عاصم بن أبي النجود الكوفي">قراءة الإمام عاصم بن أبي النجود الكوفي</SelectItem>
                                                                <SelectItem value="قراءة الإمام حمزة الزيات">قراءة الإمام حمزة الزيات</SelectItem>
                                                                <SelectItem value="قراءة الإمام الكسائي">قراءة الإمام الكسائي</SelectItem>
                                                                <SelectItem value="قراءة الإمام أبو جعفر المدني">قراءة الإمام أبو جعفر المدني</SelectItem>
                                                                <SelectItem value="قراءة الإمام يعقوب الحضرمي">قراءة الإمام يعقوب الحضرمي</SelectItem>
                                                                <SelectItem value="قراءة الإمام خلف العاشر">قراءة الإمام خلف العاشر</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors[`documents.${index}.riwayah`] && (
                                                            <p className="text-destructive text-xs mt-1 font-medium">{errors[`documents.${index}.riwayah`]}</p>
                                                        )}
                                                    </div>
                                                )}

                                                {doc.certificate_type !== 'سيرة ذاتية' && (
                                                    <>
                                                        <div>
                                                            <Label htmlFor={`issuing_place_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">مكان الإصدار</Label>
                                                            <Input
                                                                placeholder="مثال: الجمعية الخيرية لتحفيظ القرآن"
                                                                value={doc.issuing_place}
                                                                onChange={(e) => handleDocumentChange(index, 'issuing_place', e.target.value)}
                                                                className={errors[`documents.${index}.issuing_place`] ? 'border-destructive' : ''}
                                                            />
                                                            {errors[`documents.${index}.issuing_place`] && (
                                                                <p className="text-destructive text-xs mt-1 font-medium">{errors[`documents.${index}.issuing_place`]}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`issuing_date_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">تاريخ الإصدار</Label>
                                                            <Input
                                                                type="date"
                                                                value={doc.issuing_date}
                                                                onChange={(e) => handleDocumentChange(index, 'issuing_date', e.target.value)}
                                                                dir="ltr"
                                                                className={`text-left ${errors[`documents.${index}.issuing_date`] ? 'border-destructive' : ''}`}
                                                            />
                                                            {errors[`documents.${index}.issuing_date`] && (
                                                                <p className="text-destructive text-xs mt-1 font-medium">{errors[`documents.${index}.issuing_date`]}</p>
                                                            )}
                                                        </div>
                                                    </>
                                                )}

                                                <div className="md:col-span-2">
                                                    <Label htmlFor={`file_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">رفع الملف</Label>
                                                    <div className={`border-2 border-dashed rounded-xl p-6 text-center hover:bg-muted/50 hover:border-primary/40 transition-all duration-300 relative cursor-pointer group bg-background/50 ${errors[`documents.${index}.file`] ? 'border-destructive' : 'border-border'}`}>
                                                        <input
                                                            type="file"
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                            onChange={(e) => handleDocumentChange(index, 'file', e.target.files ? e.target.files[0] : null)}
                                                        />
                                                        <div className="flex flex-col items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-1">
                                                                <Upload className="w-6 h-6" />
                                                            </div>
                                                            <p className="text-sm font-medium text-foreground truncate w-full px-2 group-hover:text-primary transition-colors">
                                                                {doc.file ? doc.file.name : "اختر ملف (PDF, JPG)"}
                                                            </p>
                                                            <span className="text-[10px] text-muted-foreground">الحد الأقصى 5 ميجابايت</span>
                                                        </div>
                                                    </div>
                                                    {errors[`documents.${index}.file`] && (
                                                        <p className="text-destructive text-xs mt-1 font-medium">{errors[`documents.${index}.file`]}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        onClick={addCertificate}
                                        variant="outline"
                                        className="w-full h-12 rounded-xl border-dashed border-2 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all gap-2 text-muted-foreground hover:bg-purple-50 dark:hover:bg-purple-900/10"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                        إضافة وثيقة أخرى
                                    </Button>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 dark:bg-black/20 border-t border-border flex items-center justify-between">
                                <p className="text-sm text-muted-foreground hidden md:block">
                                    جميع البيانات تخضع <a href="/privacy" className="text-primary hover:underline font-medium">لسياسة الخصوصية</a>
                                </p>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-primary hover:bg-primary/90 text-white h-12 px-10 rounded-xl text-lg shadow-lg hover:shadow-primary/25 transition-all w-full md:w-auto"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            جاري المعالجة...
                                        </span>
                                    ) : (
                                        <>
                                            إرسال طلب الانضمام
                                            <ArrowLeft className="w-5 h-5 mr-2 rtl:rotate-180" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </section>
        </SiteLayout>
    );
}
