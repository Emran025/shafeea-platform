import { Head, useForm, usePage } from '@inertiajs/react';
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
    Mail,
    Globe,
    Upload,
    Lock,
    Award,
    ArrowLeft,
    School,
    CheckCircle,
    PlusCircle,
    Trash2,
    FileText,
    Eye,
    EyeOff,
    AlertCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { SharedData } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Apply() {
    const { flash } = usePage<SharedData>().props;
    const { data, setData, post, errors, processing, wasSuccessful, reset } = useForm({
        error: '',
        name: '',
        logo: null as File | null,
        phone: '',
        country: '',
        city: '',
        location: '',
        address: '',
        admin_name: '',
        admin_email: '',
        admin_phone: '',
        admin_password: '',
        admin_password_confirmation: '',
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

    useEffect(() => {
        if (wasSuccessful) {
            reset();
        }
    }, [wasSuccessful]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('schools.store'));
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

    const handleDocumentChange = (index: number, field: string, value: any) => {
        const documents = [...data.documents];
        documents[index] = { ...documents[index], [field]: value };
        setData('documents', documents);
    };

    // --- Styles & Helpers ---
    const autofillFix = "transition-all duration-300 [&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--background))_inset] dark:[&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--background))_inset] [&:-webkit-autofill]:-webkit-text-fill-color-foreground";
    const autofillMuted = "transition-all duration-300 [&:-webkit-autofill]:shadow-[0_0_0_1000px_#f3f4f6_inset] dark:[&:-webkit-autofill]:shadow-[0_0_0_1000px_#1f2937_inset] [&:-webkit-autofill]:-webkit-text-fill-color-foreground";
    
    // Base input classes based on section color
    const getInputClass = (color: 'blue' | 'emerald' | 'purple', isMuted = false) => {
        const baseBg = isMuted ? 'bg-muted/30' : 'bg-background';
        const autofill = isMuted ? autofillMuted : autofillFix;
        return `h-12 rounded-xl ${baseBg} border-border focus:bg-background focus:border-${color}-500 focus:ring-2 focus:ring-${color}-500/10 hover:border-${color}-500/50 transition-all duration-200 ${autofill}`;
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
                        <School className="w-10 h-10 text-white" />
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
                        {/* Decorative Top Border */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>

                        <form onSubmit={handleSubmit} autoComplete="off">
                            
                            {/* 1. School Information Section (Blue Theme) */}
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* School Name */}
                                    <div className="space-y-3 md:col-span-2">
                                        <Label htmlFor="name" className="text-foreground font-semibold text-sm">اسم المدرسة / المنشأة</Label>
                                        <div className="relative group">
                                            <School className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                            <Input
                                                id="name"
                                                placeholder="مثال: مجمع النور القرآني"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`pr-11 ${getInputClass('blue', true)}`}
                                                autoComplete="off"
                                            />
                                        </div>
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Logo Upload - Visual Area */}
                                    <div className="space-y-3 md:col-span-2">
                                        <Label htmlFor="logo" className="text-foreground font-semibold text-sm">شعار المدرسة</Label>
                                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/50 hover:border-primary/40 transition-all duration-300 relative cursor-pointer group bg-card">
                                            <input
                                                id="logo"
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => setData('logo', e.target.files ? e.target.files[0] : null)}
                                            />
                                            <div className="flex flex-col items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                                                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mb-1 shadow-sm">
                                                    <Upload className="w-7 h-7" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {data.logo ? data.logo.name : "اضغط لرفع الشعار أو اسحبه هنا"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG حتى 5 ميجابايت</p>
                                                </div>
                                            </div>
                                        </div>
                                        {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
                                    </div>

                                    {/* Phone (LTR) */}
                                    <div className="space-y-3">
                                        <Label htmlFor="phone" className="text-foreground font-semibold text-sm">رقم الهاتف الرسمي</Label>
                                        <div className="relative group">
                                            <Phone className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200 z-10" />
                                            <Input
                                                id="phone"
                                                placeholder="05xxxxxxxx"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className={`pr-11 text-left ${getInputClass('blue', true)}`}
                                                dir="ltr"
                                                autoComplete="tel"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    {/* Country */}
                                    <div className="space-y-3">
                                        <Label htmlFor="country" className="text-foreground font-semibold text-sm">الدولة</Label>
                                        <div className="relative group">
                                            <Globe className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                            <Input
                                                id="country"
                                                placeholder="المملكة العربية السعودية"
                                                value={data.country}
                                                onChange={(e) => setData('country', e.target.value)}
                                                className={`pr-11 ${getInputClass('blue', true)}`}
                                            />
                                        </div>
                                        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                    </div>

                                    {/* City */}
                                    <div className="space-y-3">
                                        <Label htmlFor="city" className="text-foreground font-semibold text-sm">المدينة</Label>
                                        <div className="relative group">
                                            <MapPin className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                            <Input
                                                id="city"
                                                placeholder="الرياض"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                className={`pr-11 ${getInputClass('blue', true)}`}
                                            />
                                        </div>
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>

                                    {/* Location URL (LTR) */}
                                    <div className="space-y-3">
                                        <Label htmlFor="location" className="text-foreground font-semibold text-sm">رابط الموقع (Google Maps)</Label>
                                        <div className="relative group">
                                            <MapPin className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground z-10 group-hover:text-primary transition-colors duration-200" />
                                            <Input
                                                id="location"
                                                placeholder="https://maps.google.com/..."
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                className={`pr-11 text-left ${getInputClass('blue', true)}`}
                                                dir="ltr"
                                            />
                                        </div>
                                        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-3 md:col-span-2">
                                        <Label htmlFor="address" className="text-foreground font-semibold text-sm">العنوان الوطني / التفصيلي</Label>
                                        <Input
                                            id="address"
                                            placeholder="الحي، الشارع، رقم المبنى..."
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className={getInputClass('blue', true)}
                                        />
                                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Admin Information Section (Emerald Theme) */}
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
                                    <div className="space-y-3">
                                        <Label htmlFor="admin_name" className="text-foreground font-semibold text-sm">الاسم الثلاثي</Label>
                                        <div className="relative group">
                                            <UserCog className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors duration-200" />
                                            <Input
                                                id="admin_name"
                                                placeholder="اسم المدير المسؤول"
                                                value={data.admin_name}
                                                onChange={(e) => setData('admin_name', e.target.value)}
                                                className={`pr-11 ${getInputClass('emerald')}`}
                                                autoComplete="off"
                                            />
                                        </div>
                                        {errors.admin_name && <p className="text-red-500 text-xs mt-1">{errors.admin_name}</p>}
                                    </div>

                                    {/* Admin Phone (LTR) */}
                                    <div className="space-y-3">
                                        <Label htmlFor="admin_phone" className="text-foreground font-semibold text-sm">رقم الجوال (للدخول)</Label>
                                        <div className="relative group">
                                            <Phone className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground z-10 group-hover:text-emerald-500 transition-colors duration-200" />
                                            <Input
                                                id="admin_phone"
                                                placeholder="05xxxxxxxx"
                                                value={data.admin_phone}
                                                onChange={(e) => setData('admin_phone', e.target.value)}
                                                className={`pr-11 text-left ${getInputClass('emerald')}`}
                                                dir="ltr"
                                                autoComplete="tel"
                                            />
                                        </div>
                                        {errors.admin_phone && <p className="text-red-500 text-xs mt-1">{errors.admin_phone}</p>}
                                    </div>

                                    {/* Admin Email (LTR) */}
                                    <div className="space-y-3 md:col-span-2">
                                        <Label htmlFor="admin_email" className="text-foreground font-semibold text-sm">البريد الإلكتروني</Label>
                                        <div className="relative group">
                                            <Mail className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground z-10 group-hover:text-emerald-500 transition-colors duration-200" />
                                            <Input
                                                id="admin_email"
                                                type="email"
                                                placeholder="email@example.com"
                                                value={data.admin_email}
                                                onChange={(e) => setData('admin_email', e.target.value)}
                                                className={`pr-11 text-left ${getInputClass('emerald')}`}
                                                dir="ltr"
                                                autoComplete="new-password"
                                            />
                                        </div>
                                        {errors.admin_email && <p className="text-red-500 text-xs mt-1">{errors.admin_email}</p>}
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-3">
                                        <Label htmlFor="admin_password" className="text-foreground font-semibold text-sm">كلمة المرور</Label>
                                        <div className="relative group">
                                            <Lock className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground z-10 group-hover:text-emerald-500 transition-colors duration-200" />
                                            <Input
                                                id="admin_password"
                                                type={showPassword ? "text" : "password"}
                                                value={data.admin_password}
                                                onChange={(e) => setData('admin_password', e.target.value)}
                                                className={`pr-11 pl-11 text-left ${getInputClass('emerald')}`}
                                                dir="ltr"
                                                autoComplete="new-password"
                                            />
                                            {/* Eye Button */}
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute left-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.admin_password && <p className="text-red-500 text-xs mt-1">{errors.admin_password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-3">
                                        <Label htmlFor="admin_password_confirmation" className="text-foreground font-semibold text-sm">تأكيد كلمة المرور</Label>
                                        <div className="relative group">
                                            <CheckCircle className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground z-10 group-hover:text-emerald-500 transition-colors duration-200" />
                                            <Input
                                                id="admin_password_confirmation"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={data.admin_password_confirmation}
                                                onChange={(e) => setData('admin_password_confirmation', e.target.value)}
                                                className={`pr-11 pl-11 text-left ${getInputClass('emerald')}`}
                                                dir="ltr"
                                                autoComplete="new-password"
                                            />
                                            {/* Eye Button */}
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute left-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            

                            {/* 3. Documents Section (Purple Theme) */}
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

                                <div className="space-y-8">
                                    {data.documents.map((doc, index) => (
                                        <div key={index} className="p-6 rounded-2xl border border-border bg-muted/20 relative group hover:border-purple-500/30 hover:shadow-sm transition-all duration-300">
                                            {/* Remove Button */}
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
                                                {/* Document Name */}
                                                <div className="space-y-3 md:col-span-2">
                                                    <Label className="text-foreground font-semibold text-sm">اسم الوثيقة</Label>
                                                    <Input
                                                        placeholder="مثال: رخصة التحفيظ، سجل مزاولة مهنية، شهادة إجازة المشرف"
                                                        value={doc.name}
                                                        onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                                                        className={getInputClass('purple')}
                                                    />
                                                </div>
                                                
                                            {/* Document Name */}
                                            <div className="md:col-span-2">
                                                <Label htmlFor={`doc_name_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">اسم الشهادة/الوثيقة</Label>
                                                <Input
                                                    placeholder="مثال: رخصة التحفيظ، سجل مزاولة مهنية، شهادة إجازة المشرف"
                                                    value={doc.name}
                                                    onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                                                    className={getInputClass('purple')}
                                                />
                                            </div>

                                            {/* Certificate Type */}
                                            <div>
                                                <Label htmlFor={`certificate_type_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">نوع الوثيقة</Label>
                                                <Select
                                                    onValueChange={(value) => handleDocumentChange(index, 'certificate_type', value)}
                                                    value={doc.certificate_type}
                                                >
                                                    <SelectTrigger 
                                                        className={`text-right ${getInputClass('purple')}`} 
                                                        dir="rtl"
                                                        style={{ fontFamily: 'Cairo, sans-serif' }}
                                                    >
                                                        <SelectValue placeholder="اختر النوع" />
                                                    </SelectTrigger>
                                                    
                                                    <SelectContent 
                                                        dir="rtl" 
                                                        style={{ fontFamily: 'Cairo, sans-serif' }} 
                                                    >
                                                        <SelectItem value="شهادة إجازة في القران">شهادة إجازة في القران</SelectItem>
                                                        <SelectItem value="رخصة">رخصة رسمية</SelectItem>
                                                        <SelectItem value="سجل مهني">سجل مهني</SelectItem>
                                                        <SelectItem value="سيرة ذاتية">سيرة المشرف الذاتية</SelectItem>
                                                        <SelectItem value="Other">أخرى</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Other Certificate Type */}
                                            {doc.certificate_type === 'Other' && (
                                                <div>
                                                    <Label htmlFor={`certificate_type_other_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">النوع (آخر)</Label>
                                                    <Input
                                                        placeholder="يرجى التحديد"
                                                        value={doc.certificate_type_other}
                                                        onChange={(e) => handleDocumentChange(index, 'certificate_type_other', e.target.value)}
                                                        className={getInputClass('purple')}
                                                    />
                                                </div>
                                            )}

                                            {/* Riwayah */}
                                            {(doc.certificate_type === 'شهادة حفظ قران' || doc.certificate_type === 'شهادة إجازة في القران') && (
                                                <div>
                                                    <Label htmlFor={`riwayah_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">الرواية</Label>
                                                    <Select
                                                        onValueChange={(value) => handleDocumentChange(index, 'riwayah', value)}
                                                        value={doc.riwayah}
                                                    >
                                                        <SelectTrigger 
                                                            className={`text-right ${getInputClass('purple')}`} 
                                                            dir="rtl"
                                                            style={{ fontFamily: 'Cairo, sans-serif' }}
                                                        >
                                                        <SelectValue placeholder="اختر الرواية" />
                                                        </SelectTrigger>
                                                        <SelectContent dir="rtl">
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
                                                </div>
                                            )}

                                            {/* Issuing Place and Date */}
                                            {doc.certificate_type !== 'سيرة ذاتية' && (
                                                <>
                                                    <div>
                                                        <Label htmlFor={`issuing_place_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">مكان الإصدار</Label>
                                                        <Input
                                                            placeholder="مثال: الجمعية الخيرية لتحفيظ القرآن"
                                                            value={doc.issuing_place}
                                                            onChange={(e) => handleDocumentChange(index, 'issuing_place', e.target.value)}
                                                            className={getInputClass('purple')}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`issuing_date_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">تاريخ الإصدار</Label>
                                                        <Input
                                                            type="date"
                                                            value={doc.issuing_date}
                                                            onChange={(e) => handleDocumentChange(index, 'issuing_date', e.target.value)}
                                                            className={getInputClass('purple')}
                                                            dir="ltr"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {/* File Upload - FIXED COLORS to PRIMARY */}
                                            <div className="md:col-span-2">
                                                <Label htmlFor={`file_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">رفع الملف</Label>
                                                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/50 hover:border-primary/40 transition-all duration-300 relative cursor-pointer group bg-background/50">
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

                            {/* Footer Actions */}
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
