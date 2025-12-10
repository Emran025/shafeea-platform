import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    BookOpen,
    Upload,
    Lock,
    Award,
    ArrowLeft,
    School,
    CheckCircle,
    LayoutDashboard,
    PlusCircle
} from 'lucide-react';

export default function Apply() {
    const { data, setData, post, errors, processing } = useForm({
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

    const handleDocumentChange = (index: number, field: string, value: any) => {
        const documents = [...data.documents];
        documents[index] = { ...documents[index], [field]: value };
        setData('documents', documents);
    };

    return (
        <SiteLayout>
            <Head title="تسجيل منشأة تعليمية - شفيع" />

            {/* --- Hero Section --- */}
            <section className="relative py-24 gradient-hero overflow-hidden animate-fade-in-up">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-transparent dark:bg-black/40 transition-colors duration-300"></div>
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    </div>
                    {/* Floating Shapes */}
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

                        <form onSubmit={handleSubmit}>
                            
                            {/* 1. School Information Section */}
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* School Name */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="name" className="text-foreground font-medium">اسم المدرسة / المنشأة</Label>
                                        <div className="relative">
                                            <School className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                placeholder="مثال: مجمع النور القرآني"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="pr-10 h-12 rounded-xl bg-muted/30 focus:bg-background border-border hover:border-primary/50 transition-all"
                                            />
                                        </div>
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Logo Upload - Visual Area */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="logo" className="text-foreground font-medium">شعار المدرسة</Label>
                                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/50 transition-colors relative cursor-pointer group">
                                            <input
                                                id="logo"
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => setData('logo', e.target.files ? e.target.files[0] : null)}
                                            />
                                            <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                                                    <Upload className="w-6 h-6" />
                                                </div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {data.logo ? data.logo.name : "اضغط لرفع الشعار أو اسحبه هنا"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG حتى 5 ميجابايت</p>
                                            </div>
                                        </div>
                                        {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-foreground font-medium">رقم الهاتف الرسمي</Label>
                                        <div className="relative">
                                            <Phone className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                placeholder="05xxxxxxxx"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="pr-10 h-11 rounded-xl bg-muted/30 border-border hover:border-primary/50"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    {/* Country */}
                                    <div className="space-y-2">
                                        <Label htmlFor="country" className="text-foreground font-medium">الدولة</Label>
                                        <div className="relative">
                                            <Globe className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="country"
                                                placeholder="المملكة العربية السعودية"
                                                value={data.country}
                                                onChange={(e) => setData('country', e.target.value)}
                                                className="pr-10 h-11 rounded-xl bg-muted/30 border-border hover:border-primary/50"
                                            />
                                        </div>
                                        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                    </div>

                                    {/* City */}
                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="text-foreground font-medium">المدينة</Label>
                                        <div className="relative">
                                            <MapPin className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="city"
                                                placeholder="الرياض"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                className="pr-10 h-11 rounded-xl bg-muted/30 border-border hover:border-primary/50"
                                            />
                                        </div>
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>

                                    {/* Location URL */}
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-foreground font-medium">رابط الموقع (Google Maps)</Label>
                                        <div className="relative">
                                            <MapPin className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="location"
                                                placeholder="https://maps.google.com/..."
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                className="pr-10 h-11 rounded-xl bg-muted/30 border-border hover:border-primary/50 text-left dir-ltr"
                                                style={{direction: 'ltr', textAlign: 'right'}}
                                            />
                                        </div>
                                        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address" className="text-foreground font-medium">العنوان الوطني / التفصيلي</Label>
                                        <Input
                                            id="address"
                                            placeholder="الحي، الشارع، رقم المبنى..."
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="h-11 rounded-xl bg-muted/30 border-border hover:border-primary/50"
                                        />
                                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Admin Information Section (Distinct Background) */}
                            <div className="bg-muted/30 dark:bg-gray-800/20 p-8 md:p-12 border-t border-border">
                                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border">
                                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <UserCog className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">بيانات مدير النظام</h2>
                                        <p className="text-muted-foreground text-sm">المسؤول عن إدارة حساب المدرسة</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Admin Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admin_name" className="text-foreground font-medium">الاسم الثلاثي</Label>
                                        <div className="relative">
                                            <UserCog className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="admin_name"
                                                placeholder="اسم المدير المسؤول"
                                                value={data.admin_name}
                                                onChange={(e) => setData('admin_name', e.target.value)}
                                                className="pr-10 h-11 rounded-xl bg-background border-border hover:border-emerald-500/50 focus:ring-emerald-500/20"
                                            />
                                        </div>
                                        {errors.admin_name && <p className="text-red-500 text-xs mt-1">{errors.admin_name}</p>}
                                    </div>

                                    {/* Admin Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admin_phone" className="text-foreground font-medium">رقم الجوال (للدخول)</Label>
                                        <div className="relative">
                                            <Phone className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="admin_phone"
                                                placeholder="05xxxxxxxx"
                                                value={data.admin_phone}
                                                onChange={(e) => setData('admin_phone', e.target.value)}
                                                className="pr-10 h-11 rounded-xl bg-background border-border hover:border-emerald-500/50 focus:ring-emerald-500/20"
                                            />
                                        </div>
                                        {errors.admin_phone && <p className="text-red-500 text-xs mt-1">{errors.admin_phone}</p>}
                                    </div>

                                    {/* Admin Email */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="admin_email" className="text-foreground font-medium">البريد الإلكتروني</Label>
                                        <div className="relative">
                                            <Mail className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="admin_email"
                                                type="email"
                                                placeholder="email@example.com"
                                                value={data.admin_email}
                                                onChange={(e) => setData('admin_email', e.target.value)}
                                                className="pr-10 h-11 rounded-xl bg-background border-border hover:border-emerald-500/50 focus:ring-emerald-500/20"
                                            />
                                        </div>
                                        {errors.admin_email && <p className="text-red-500 text-xs mt-1">{errors.admin_email}</p>}
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admin_password" className="text-foreground font-medium">كلمة المرور</Label>
                                        <div className="relative">
                                            <Lock className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="admin_password"
                                                type="password"
                                                value={data.admin_password}
                                                onChange={(e) => setData('admin_password', e.target.value)}
                                                className="pr-10 h-11 rounded-xl bg-background border-border hover:border-emerald-500/50 focus:ring-emerald-500/20"
                                            />
                                        </div>
                                        {errors.admin_password && <p className="text-red-500 text-xs mt-1">{errors.admin_password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admin_password_confirmation" className="text-foreground font-medium">تأكيد كلمة المرور</Label>
                                        <div className="relative">
                                            <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="admin_password_confirmation"
                                                type="password"
                                                value={data.admin_password_confirmation}
                                                onChange={(e) => setData('admin_password_confirmation', e.target.value)}
                                                className="pr-10 h-11 rounded-xl bg-background border-border hover:border-emerald-500/50 focus:ring-emerald-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Documents */}
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

                                        {data.documents.map((doc, index) => (
                                            <div key={index} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-border pb-6 mb-6">
                                                {/* Document Name */}
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label htmlFor={`doc_name_${index}`} className="text-foreground font-medium">اسم الشهادة/الوثيقة</Label>
                                                    <Input
                                                        id={`doc_name_${index}`}
                                                        placeholder="مثال: شهادة حفظ القران"
                                                        value={doc.name}
                                                        onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                                                        className="h-12 rounded-xl bg-background border-border"
                                                    />
                                                </div>

                                                {/* Certificate Type */}
                                                <div className="space-y-2">
                                                    <Label htmlFor={`certificate_type_${index}`}>نوع الشهادة</Label>
                                                    <Select
                                                        onValueChange={(value) => handleDocumentChange(index, 'certificate_type', value)}
                                                        value={doc.certificate_type}
                                                    >
                                                        <SelectTrigger className="h-12 rounded-xl bg-background border-border">
                                                            <SelectValue placeholder="اختر النوع" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="شهادة حفظ قران">شهادة حفظ قران</SelectItem>
                                                            <SelectItem value="شهادة إجازة في القران">شهادة إجازة في القران</SelectItem>
                                                            <SelectItem value="سيرة ذاتية">سيرة ذاتية</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Other Certificate Type */}
                                                {doc.certificate_type === 'Other' && (
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`certificate_type_other_${index}`}>النوع (آخر)</Label>
                                                        <Input
                                                            id={`certificate_type_other_${index}`}
                                                            placeholder="يرجى التحديد"
                                                            value={doc.certificate_type_other}
                                                            onChange={(e) => handleDocumentChange(index, 'certificate_type_other', e.target.value)}
                                                            className="h-12 rounded-xl bg-background border-border"
                                                        />
                                                    </div>
                                                )}

                                                {/* Riwayah */}
                                                {(doc.certificate_type === 'شهادة حفظ قران' || doc.certificate_type === 'شهادة إجازة في القران') && (
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`riwayah_${index}`}>الرواية</Label>
                                                        <Select
                                                            onValueChange={(value) => handleDocumentChange(index, 'riwayah', value)}
                                                            value={doc.riwayah}
                                                        >
                                                            <SelectTrigger className="h-12 rounded-xl bg-background border-border">
                                                                <SelectValue placeholder="اختر الرواية" />
                                                            </SelectTrigger>
                                                            <SelectContent>
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
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`issuing_place_${index}`}>مكان الإصدار</Label>
                                                            <Input
                                                                id={`issuing_place_${index}`}
                                                                placeholder="مثال: الجمعية الخيرية لتحفيظ القرآن"
                                                                value={doc.issuing_place}
                                                                onChange={(e) => handleDocumentChange(index, 'issuing_place', e.target.value)}
                                                                className="h-12 rounded-xl bg-background border-border"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`issuing_date_${index}`}>تاريخ الإصدار</Label>
                                                            <Input
                                                                id={`issuing_date_${index}`}
                                                                type="date"
                                                                value={doc.issuing_date}
                                                                onChange={(e) => handleDocumentChange(index, 'issuing_date', e.target.value)}
                                                                className="h-12 rounded-xl bg-background border-border"
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                                {/* File Upload */}
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label htmlFor={`file_${index}`}>رفع الملف</Label>
                                                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-background transition-colors relative cursor-pointer group bg-background/50">
                                                        <input
                                                            id={`file_${index}`}
                                                            type="file"
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                            onChange={(e) => handleDocumentChange(index, 'file', e.target.files ? e.target.files[0] : null)}
                                                        />
                                                        <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
                                                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mb-1">
                                                                <Upload className="w-5 h-5" />
                                                            </div>
                                                            <p className="text-xs font-medium text-foreground truncate w-full px-2">
                                                                {doc.file ? doc.file.name : "اختر ملف"}
                                                            </p>
                                                            <span className="text-[10px] text-muted-foreground">PDF, JPG (Max 5MB)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="md:col-span-2">
                                            <Button
                                                type="button"
                                                onClick={addCertificate}
                                                variant="outline"
                                                className="w-full h-12 rounded-xl border-dashed"
                                            >
                                                <PlusCircle className="w-5 h-5 mr-2" />
                                                إضافة شهادة أخرى
                                            </Button>
                                        </div>
                                    </div>
                                </div>                                    
                            </div>

                            {/* Footer Actions */}
                            <div className="p-8 bg-gray-50 dark:bg-black/20 border-t border-border flex items-center justify-between">
                                <p className="text-sm text-muted-foreground hidden md:block">
                                    بالتسجيل أنت توافق على <a href="/terms" className="text-primary hover:underline">الشروط والأحكام</a>
                                </p>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-xl text-lg shadow-lg hover:shadow-primary/25 transition-all w-full md:w-auto"
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