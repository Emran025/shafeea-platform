import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SiteLayout from '@/layouts/site-layout';
import {
    User,
    Mail,
    Lock,
    FileText,
    Upload,
    BookOpen,
    GraduationCap,
    CheckCircle,
    ArrowLeft,
    ScrollText,
    Award
} from 'lucide-react';

export default function Apply() {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        bio: '',
        qualifications: null as File | null,
        intent_statement: null as File | null,
        memorization_level: 0,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('teachers.store'));
    }

    return (
        <SiteLayout>
            <Head title="الانضمام كمعلم - شفيع" />

            {/* --- Hero Section --- */}
            <section className="relative py-24 gradient-hero overflow-hidden animate-fade-in-up">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-transparent dark:bg-black/40 transition-colors duration-300"></div>
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    </div>
                    {/* Floating Shapes */}
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

                        <form onSubmit={handleSubmit}>
                            
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="name" className="text-foreground font-medium">الاسم الرباعي</Label>
                                        <div className="relative">
                                            <User className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                placeholder="الاسم كما يظهر في الهوية"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="pr-10 h-12 rounded-xl bg-muted/30 focus:bg-background border-border hover:border-primary/50 transition-all"
                                            />
                                        </div>
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="email" className="text-foreground font-medium">البريد الإلكتروني</Label>
                                        <div className="relative">
                                            <Mail className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="email@example.com"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="pr-10 h-12 rounded-xl bg-muted/30 border-border hover:border-primary/50"
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Bio */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="bio" className="text-foreground font-medium">نبذة تعريفية (Bio)</Label>
                                        <div className="relative">
                                            <Textarea
                                                id="bio"
                                                placeholder="تحدث بإيجاز عن خبرتك في تعليم القرآن الكريم..."
                                                value={data.bio}
                                                onChange={(e) => setData('bio', e.target.value)}
                                                className="min-h-[120px] rounded-xl bg-muted/30 border-border hover:border-primary/50 p-4"
                                            />
                                        </div>
                                        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Professional Details Section (Distinct Background) */}
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
                                    {/* Memorization Level */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="memorization_level" className="text-foreground font-medium">مستوى الحفظ (عدد الأجزاء)</Label>
                                        <div className="relative">
                                            <BookOpen className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="memorization_level"
                                                type="number"
                                                min="0"
                                                max="30"
                                                placeholder="مثال: 30"
                                                value={data.memorization_level}
                                                onChange={(e) => setData('memorization_level', parseInt(e.target.value, 10))}
                                                className="pr-10 h-12 rounded-xl bg-background border-border hover:border-emerald-500/50"
                                            />
                                        </div>
                                        {errors.memorization_level && <p className="text-red-500 text-xs mt-1">{errors.memorization_level}</p>}
                                    </div>

                                    {/* Qualifications File Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="qualifications" className="text-foreground font-medium">المؤهلات والشهادات</Label>
                                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-background transition-colors relative cursor-pointer group bg-background/50">
                                            <input
                                                id="qualifications"
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => setData('qualifications', e.target.files ? e.target.files[0] : null)}
                                            />
                                            <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
                                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mb-1">
                                                    <ScrollText className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs font-medium text-foreground truncate w-full px-2">
                                                    {data.qualifications ? data.qualifications.name : "رفع الشهادات"}
                                                </p>
                                                <span className="text-[10px] text-muted-foreground">PDF, JPG (Max 5MB)</span>
                                            </div>
                                        </div>
                                        {errors.qualifications && <p className="text-red-500 text-xs mt-1">{errors.qualifications}</p>}
                                    </div>

                                    {/* Intent Statement Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="intent_statement" className="text-foreground font-medium">خطاب النية / رسالة الانضمام</Label>
                                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-background transition-colors relative cursor-pointer group bg-background/50">
                                            <input
                                                id="intent_statement"
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => setData('intent_statement', e.target.files ? e.target.files[0] : null)}
                                            />
                                            <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mb-1">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs font-medium text-foreground truncate w-full px-2">
                                                    {data.intent_statement ? data.intent_statement.name : "رفع الخطاب"}
                                                </p>
                                                <span className="text-[10px] text-muted-foreground">PDF, DOCX</span>
                                            </div>
                                        </div>
                                        {errors.intent_statement && <p className="text-red-500 text-xs mt-1">{errors.intent_statement}</p>}
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
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-foreground font-medium">كلمة المرور</Label>
                                        <div className="relative">
                                            <Lock className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="pr-10 h-11 rounded-xl bg-muted/30 border-border hover:border-purple-500/50"
                                            />
                                        </div>
                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-foreground font-medium">تأكيد كلمة المرور</Label>
                                        <div className="relative">
                                            <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className="pr-10 h-11 rounded-xl bg-muted/30 border-border hover:border-purple-500/50"
                                            />
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