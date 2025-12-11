import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SiteLayout from '@/layouts/site-layout';
import {
    User,
    Mail,
    Lock,
    Upload,
    BookOpen,
    GraduationCap,
    Award,
    PlusCircle,
    Eye,
    EyeOff,
    Trash2,
    ArrowLeft,
    CheckCircle,
    Building2,
    AlertCircle,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { School, SharedData } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Apply({ schools }: { schools: School[] }) {
    const { flash } = usePage<SharedData>().props;
    const { data, setData, post, errors, processing, reset } = useForm({
        name: '',
        error: '',
        email: '',
        password: '',
        password_confirmation: '',
        bio: '',
        qualifications: '',
        memorization_level: 0,
        school_id: '',
        documents: [
            {
                name: '',
                certificate_type: '',
                certificate_type_other: '',
                riwayah: '',
                issuing_place: '',
                issuing_date: '',
                file: null as File | null,
            },
        ],
    });

    // تم إزالة useEffect القديم لأنه غير مضمون مع Inertia في حالات النجاح
    // الاعتماد سيكون على onSuccess داخل handleSubmit

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('teachers.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset(); 
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

    const handleDocumentChange = (index: number, field: string, value: any) => {
        const documents = [...data.documents];
        documents[index] = { ...documents[index], [field]: value };
        setData('documents', documents);
    };

    // --- Styles & Helpers ---

    const autofillFix = `
        transition-colors duration-[50000s] ease-in-out 0s
        [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#ffffff] 
        dark:[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#020817]
        [&:-webkit-autofill]:-webkit-text-fill-color-foreground
    `;
    
    const noSpinner = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

    const inputClasses = `h-12 rounded-xl bg-muted/30 border-border focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 hover:border-primary/50 transition-all duration-200 ${autofillFix}`;

    return (
        <SiteLayout>
            <Head title="الانضمام كمعلم - شفيع" />

            {/* --- Hero Section --- */}
            <section className="relative py-24 gradient-hero overflow-hidden animate-fade-in-up">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-transparent dark:bg-black/40 transition-colors duration-300"></div>
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    </div>
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl mb-6 shadow-2xl hover:scale-105 transition-transform duration-300">
                        <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        انضم لنخبة المعلمين
                    </h1>
                    <p className="text-xl text-blue-50/90 max-w-2xl mx-auto leading-relaxed font-light">
                        شارك في رسالة تعليم كتاب الله، وكن جزءاً من منظومة تعليمية تقنية متكاملة تخدم القرآن وأهله.
                    </p>
                </div>
            </section>

            {/* --- Form Section --- */}
            <section className="py-16 bg-background relative -mt-10">
                <div className="container mx-auto px-4">
                    <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-card overflow-hidden rounded-3xl relative z-20 ring-1 ring-border/50">
                        {/* Decorative Top Border */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500"></div>

                        <form onSubmit={handleSubmit} autoComplete="off">
                            
                            {/* 1. Personal Information Section */}
                            <div className="p-8 md:p-12">
                                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">البيانات الشخصية</h2>
                                        <p className="text-muted-foreground text-sm">عرفنا بنفسك وبخبراتك</p>
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
                                    {/* Name */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="name" className="text-foreground font-semibold text-sm mb-2.5 block">الاسم الرباعي</Label>
                                        <div className="relative group">
                                            <User className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                            <Input
                                                id="name"
                                                placeholder="الاسم كما يظهر في الهوية"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`pr-11 ${inputClasses}`}
                                                autoComplete="off"
                                            />
                                        </div>
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="email" className="text-foreground font-semibold text-sm mb-2.5 block">البريد الإلكتروني</Label>
                                        <div className="relative group">
                                            <Mail className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground z-10 group-hover:text-primary transition-colors duration-200" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="email@example.com"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`pr-11 text-left ${inputClasses}`}
                                                dir="ltr"
                                                autoComplete="new-password"
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    {/* School Selection */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="school_id" className="text-foreground font-semibold text-sm mb-2.5 block">
                                            الانضمام لمدرسة (اختياري)
                                        </Label>
                                        <div className="relative group">
                                            <Building2 className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                            <Select 
                                                onValueChange={(value) => setData('school_id', value === "none" ? "" : value)} 
                                                value={data.school_id ? String(data.school_id) : "none"}
                                            >
                                                <SelectTrigger 
                                                        className={`pr-11 ${inputClasses}`} 
                                                        dir="rtl"
                                                        style={{ fontFamily: 'Cairo, sans-serif' }}
                                                    >
                                                    <SelectValue placeholder="اختر مدرسة للانضمام إليها" />
                                                </SelectTrigger>
                                                <SelectContent 
                                                        dir="rtl" 
                                                        style={{ fontFamily: 'Cairo, sans-serif' }} 
                                                    >
                                                    <SelectItem value="none">لا أنتمي لمدرسة حالياً</SelectItem>
                                                    {schools.map((school) => (
                                                        <SelectItem key={school.id} value={String(school.id)}>
                                                            {school.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {errors.school_id && <p className="text-red-500 text-xs mt-1">{errors.school_id}</p>}
                                    </div>

                                    {/* Memorization Level - FIXED */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="memorization_level" className="text-foreground font-semibold text-sm mb-2.5 block">مستوى الحفظ (عدد الأجزاء)</Label>
                                        <div className="relative group">
                                            <BookOpen className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                            <Input
                                                id="memorization_level"
                                                type="number"
                                                min="0"
                                                max="30"
                                                placeholder="مثال: 30"
                                                value={data.memorization_level}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '') {
                                                        setData('memorization_level', '' as any);
                                                        return;
                                                    }
                                                    const num = parseInt(val);
                                                    // التحقق من أن الرقم بين 0 و 30
                                                    if (!isNaN(num) && num >= 0 && num <= 30) {
                                                        setData('memorization_level', num);
                                                    }
                                                }}
                                                className={`pr-11 text-left ${inputClasses} ${noSpinner}`}
                                                dir="ltr"
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-1.5 mr-1">أدخل رقماً بين 0 و 30 جزءاً</p>
                                        {errors.memorization_level && <p className="text-red-500 text-xs mt-1">{errors.memorization_level}</p>}
                                    </div>

                                    {/* Academic Qualification */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="qualifications" className="text-foreground font-semibold text-sm mb-2.5 block">المؤهل الأكاديمي (شهادة علمية)</Label>
                                        <div className="relative group">
                                            <BookOpen className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                            <Input
                                                id="qualifications"
                                                type="text"
                                                placeholder="مثال: ثانوية عامة علمي"
                                                value={data.qualifications}
                                                onChange={(e) => setData('qualifications', e.target.value)}
                                                className={`pr-11 ${inputClasses}`}
                                            />
                                        </div>
                                        {errors.qualifications && <p className="text-red-500 text-xs mt-1">{errors.qualifications}</p>}
                                    </div>

                                    {/* Bio */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="bio" className="text-foreground font-semibold text-sm mb-2.5 block">نبذة تعريفية (Bio)</Label>
                                        <div className="relative group">
                                            <Textarea
                                                id="bio"
                                                placeholder="تحدث بإيجاز عن خبرتك في تعليم القرآن الكريم..."
                                                value={data.bio}
                                                onChange={(e) => setData('bio', e.target.value)}
                                                className="min-h-[120px] rounded-xl bg-muted/30 border-border hover:border-primary/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 p-4"
                                            />
                                        </div>
                                        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Professional Details Section */}
                            <div className="bg-muted/30 dark:bg-gray-800/20 p-8 md:p-12 border-t border-border">
                                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border">
                                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">المؤهلات والخبرات</h2>
                                        <p className="text-muted-foreground text-sm">إثبات الكفاءة والحفظ</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {data.documents.map((doc, index) => (
                                        <div key={index} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-border/50 pb-8 mb-2 last:border-0 last:pb-0 last:mb-0 relative group/doc">
                                            {/* Remove Button */}
                                            {data.documents.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeCertificate(index)}
                                                    className="absolute top-0 left-0 p-2 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover/doc:opacity-100"
                                                    title="حذف الشهادة"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            {/* Document Name */}
                                            <div className="md:col-span-2">
                                                <Label htmlFor={`doc_name_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">اسم الشهادة/الوثيقة</Label>
                                                <Input
                                                    placeholder="مثال: شهادة حفظ القران"
                                                    value={doc.name}
                                                    onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                                                    className={inputClasses}
                                                />
                                            </div>

                                            {/* Certificate Type */}
                                            <div>
                                                <Label htmlFor={`certificate_type_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">نوع الشهادة</Label>
                                                <Select
                                                    onValueChange={(value) => handleDocumentChange(index, 'certificate_type', value)}
                                                    value={doc.certificate_type}
                                                >
                                                    <SelectTrigger 
                                                        className={`text-right ${inputClasses}`} 
                                                        dir="rtl"
                                                        style={{ fontFamily: 'Cairo, sans-serif' }}
                                                    >
                                                        <SelectValue placeholder="اختر النوع" />
                                                    </SelectTrigger>
                                                    
                                                    <SelectContent 
                                                        dir="rtl" 
                                                        style={{ fontFamily: 'Cairo, sans-serif' }} 
                                                    >
                                                        <SelectItem value="شهادة حفظ قران">شهادة حفظ قران</SelectItem>
                                                        <SelectItem value="شهادة إجازة في القران">شهادة إجازة في القران</SelectItem>
                                                        <SelectItem value="سيرة ذاتية">سيرة ذاتية</SelectItem>
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
                                                        className={inputClasses}
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
                                                            className={`text-right ${inputClasses}`} 
                                                            dir="rtl"
                                                            style={{ fontFamily: 'Cairo, sans-serif' }}
                                                        >
                                                            <SelectValue placeholder="اختر الرواية" />
                                                        </SelectTrigger>
                                                        <SelectContent 
                                                            dir="rtl"
                                                            style={{ fontFamily: 'Cairo, sans-serif' }} 
                                                        >
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
                                                            className={inputClasses}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`issuing_date_${index}`} className="text-foreground font-semibold text-sm mb-2.5 block">تاريخ الإصدار</Label>
                                                        <Input
                                                            type="date"
                                                            value={doc.issuing_date}
                                                            onChange={(e) => handleDocumentChange(index, 'issuing_date', e.target.value)}
                                                            className={`${inputClasses} text-left`}
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
                                    ))}

                                    <div className="md:col-span-2 mt-4">
                                        <Button
                                            type="button"
                                            onClick={addCertificate}
                                            variant="outline"
                                            className="w-full h-12 rounded-xl border-dashed border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all gap-2 text-muted-foreground"
                                        >
                                            <PlusCircle className="w-5 h-5" />
                                            إضافة شهادة أخرى
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Account Security (White Background) */}
                            <div className="p-8 md:p-12 border-t border-border">
                                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border">
                                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">بيانات الحساب</h2>
                                        <p className="text-muted-foreground text-sm">تأمين حسابك للدخول للمنصة</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Password */}
                                    <div>
                                        <Label htmlFor="password" className="text-foreground font-semibold text-sm mb-2.5 block">كلمة المرور</Label>
                                        <div className="relative group">
                                            <Lock className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground z-10 group-hover:text-primary transition-colors duration-200" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className={`pr-11 pl-11 text-left ${inputClasses}`}
                                                dir="ltr"
                                                autoComplete="new-password"
                                            />
                                            {/* Toggle Eye Button */}
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute left-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <Label htmlFor="password_confirmation" className="text-foreground font-semibold text-sm mb-2.5 block">تأكيد كلمة المرور</Label>
                                        <div className="relative group">
                                            <CheckCircle className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground z-10 group-hover:text-primary transition-colors duration-200" />
                                            <Input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className={`pr-11 pl-11 text-left ${inputClasses}`}
                                                dir="ltr"
                                                autoComplete="new-password"
                                            />
                                            {/* Toggle Eye Button */}
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

                            {/* Footer Actions */}
                            <div className="p-8 bg-gray-50 dark:bg-black/20 border-t border-border flex items-center justify-between">
                                <p className="text-sm text-muted-foreground hidden md:block">
                                    جميع البيانات تخضع <a href="/privacy" className="text-primary hover:underline">لسياسة الخصوصية</a>
                                </p>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-primary hover:bg-primary/90 text-white h-12 px-10 rounded-xl text-lg shadow-lg hover:shadow-primary/25 transition-all w-full md:w-auto"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            جاري الإرسال...
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