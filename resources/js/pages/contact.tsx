import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    MessageCircle,
    Send,
    Building,
    Headphones,
    CheckCircle,
    Star,
    Users,
    BookOpen
} from 'lucide-react';
import { useState } from 'react';
import SiteLayout from '@/layouts/site-layout';

export default function Contact() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message_type: '',
        message: '',
        organization: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => {
                setIsSubmitted(true);
                reset();
            }
        });
    };

    const contactMethods = [
        {
            icon: Phone,
            title: "الهاتف",
            description: "تواصل معنا مباشرة",
            details: ["+966 11 234 5678", "+966 50 123 4567"],
            available: "السبت - الخميس: 8:00 ص - 6:00 م",
            color: "blue"
        },
        {
            icon: Mail,
            title: "البريد الإلكتروني",
            description: "راسلنا في أي وقت",
            details: ["info@shafeea.com", "support@shafeea.com"],
            available: "نرد خلال 24 ساعة",
            color: "emerald"
        },
        {
            icon: MessageCircle,
            title: "الدردشة المباشرة",
            description: "دعم فوري ومباشر",
            details: ["متاح على الموقع", "استجابة فورية"],
            available: "السبت - الخميس: 9:00 ص - 5:00 م",
            color: "purple"
        },
        {
            icon: MapPin,
            title: "العنوان",
            description: "زيارة المكتب الرئيسي",
            details: ["الرياض، المملكة العربية السعودية", "حي الملك فهد، طريق الملك عبدالعزيز"],
            available: "مواعيد بحجز مسبق",
            color: "orange"
        }
    ];

    const departments = [
        {
            name: "الدعم الفني",
            description: "مساعدة في استخدام المنصة",
            icon: Headphones,
            email: "support@shafeea.com"
        },

        {
            name: "الشراكات",
            description: "فرص التعاون والشراكة",
            icon: Users,
            email: "partnerships@shafeea.com"
        },
        {
            name: "المحتوى التعليمي",
            description: "استفساراتإمكانيات إضافة المناهج والمحتوى",
            icon: BookOpen,
            email: "content@shafeea.com"
        }
    ];

    const officeHours = [
        { day: "السبت - الأربعاء", hours: "8:00 ص - 6:00 م" },
        { day: "الخميس", hours: "8:00 ص - 2:00 م" },
        { day: "الجمعة", hours: "مغلق" }
    ];

    if (isSubmitted) {
        return (
            <SiteLayout>
                <Head title="تم إرسال رسالتك - شفيع" />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <Card className="p-8 max-w-md mx-auto text-center">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            تم إرسال رسالتك بنجاح
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن خلال 24 ساعة.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} className="w-full">
                            إرسال رسالة أخرى
                        </Button>
                    </Card>
                </div>
            </SiteLayout>
        );
    }

    return (
        <SiteLayout>
            <Head title="تواصل معنا - شفيع" />

            {/* Hero Section */}
            <section className="relative py-20 gradient-primary overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.2'%3E%3Cpath d='m0 40 40-40V0H0v40z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                            <MessageCircle className="w-4 h-4 ml-1" />
                            نسعد بتواصلكم
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            تواصل معنا
                        </h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                            فريقنا جاهز لمساعدتك ودعمك في رحلتك مع منصة شفيع. تواصل معنا بالطريقة التي تناسبك
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactMethods.map((method, index) => (
                            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 group">
                                <div className={`w-12 h-12 bg-${method.color}-100 dark:bg-${method.color}-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <method.icon className={`w-6 h-6 text-${method.color}-600`} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {method.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                    {method.description}
                                </p>
                                <div className="space-y-1">
                                    {method.details.map((detail, detailIndex) => (
                                        <p key={detailIndex} className="text-sm font-medium text-gray-900 dark:text-white">
                                            {detail}
                                        </p>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    {method.available}
                                </p>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <div className="mb-8">
                                <Badge className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300">
                                    <Send className="w-4 h-4 ml-1" />
                                    نموذج التواصل
                                </Badge>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    أرسل رسالتك
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
                                </p>
                            </div>

                            <Card className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">الاسم الكامل *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="mt-1"
                                                placeholder="أدخل اسمك الكامل"
                                                required
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="email">البريد الإلكتروني *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="mt-1"
                                                placeholder="example@email.com"
                                                required
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="phone">رقم الهاتف</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="mt-1"
                                                placeholder="+966 5X XXX XXXX"
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="organization">المؤسسة</Label>
                                            <Input
                                                id="organization"
                                                type="text"
                                                value={data.organization}
                                                onChange={(e) => setData('organization', e.target.value)}
                                                className="mt-1"
                                                placeholder="اسم المؤسسة التعليمية"
                                            />
                                            {errors.organization && <p className="text-red-500 text-sm mt-1">{errors.organization}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="message_type">نوع الرسالة *</Label>
                                        <Select value={data.message_type} onValueChange={(value) => setData('message_type', value)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="اختر نوع الرسالة" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="support">دعم فني</SelectItem>
                                                <SelectItem value="sales">استفسار مبيعات</SelectItem>
                                                <SelectItem value="partnership">شراكة</SelectItem>
                                                <SelectItem value="feedback">اقتراح أو ملاحظة</SelectItem>
                                                <SelectItem value="other">أخرى</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.message_type && <p className="text-red-500 text-sm mt-1">{errors.message_type}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="subject">عنوان الرسالة *</Label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            className="mt-1"
                                            placeholder="عنوان مختصر لرسالتك"
                                            required
                                        />
                                        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="message">الرسالة *</Label>
                                        <Textarea
                                            id="message"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className="mt-1 min-h-[120px]"
                                            placeholder="اكتب رسالتك هنا..."
                                            required
                                        />
                                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                                                جاري الإرسال...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 ml-2" />
                                                إرسال الرسالة
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Card>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            {/* Departments */}
                            <div>
                                <Badge className="mb-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300">
                                    <Building className="w-4 h-4 ml-1" />
                                    الأقسام المتخصصة
                                </Badge>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    تواصل مع القسم المناسب
                                </h3>
                                <div className="space-y-4">
                                    {departments.map((dept, index) => (
                                        <Card key={index} className="p-4 hover:shadow-md transition-shadow duration-300">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <dept.icon className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                        {dept.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                                        {dept.description}
                                                    </p>
                                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                        {dept.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Office Hours */}
                            <Card className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        أوقات العمل
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {officeHours.map((schedule, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                            <span className="text-gray-600 dark:text-gray-300">{schedule.day}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{schedule.hours}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Quick Response Promise */}
                            <Card className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/10 dark:to-emerald-900/10 border-t-4 border-t-blue-500">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                        <Star className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        التزامنا معك
                                    </h3>
                                </div>
                                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        <span>رد خلال 24 ساعة كحد أقصى</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        <span>دعم باللغة العربية</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        <span>فريق متخصص ومدرب</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        <span>حلول مخصصة لاحتياجاتك</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}