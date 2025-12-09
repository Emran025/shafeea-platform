import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BookOpen,
    Users,
    BarChart3,
    Shield,
    Calendar,
    Smartphone,
    Globe,
    MessageCircle,
    CheckCircle,
    Star,
    Target,
    Zap,
    Headphones,
    TrendingUp,
    PlayCircle,
    RefreshCw,
    Cloud
} from 'lucide-react';
import { useState } from 'react';
import SiteLayout from '@/layouts/site-layout';

// مسارات الصور (تأكد من وجودها في المجلد public)
const SERVICE_IMAGES = {
    studentsManagement: "/images/services/students-management.jpg",
    musHafInteractive: "/images/services/mus-haf-interactive.jpg",
    reportsAnalytics: "/images/services/reports-analytics.jpg",
    communicationPlatform: "/images/services/communication-platform.jpg",
    securityTech: "/images/services/security-tech.jpg",
    schedulingSystem: "/images/services/scheduling-system.jpg",
    followUp: "/images/services/follow-up.jpg",
};

export default function Services() {
    const [activeCategory, setActiveCategory] = useState('all');

    const serviceCategories = [
        { id: 'all', name: 'جميع الخدمات', icon: Globe },
        { id: 'management', name: 'إدارة الحلقات ', icon: Users },
        { id: 'education', name: 'التعليم والمنهجية', icon: BookOpen },
        { id: 'analytics', name: 'التقارير والإحصائيات', icon: BarChart3 },
        { id: 'communication', name: 'التواصل', icon: MessageCircle },
        { id: 'technology', name: 'التقنية والأمان', icon: Shield }
    ];

  
    const getThemeStyles = (theme: any) => {
        const styles: any = {
            blue: {
                bg: "bg-blue-50 dark:bg-blue-900/20",
                text: "text-blue-600 dark:text-blue-400",
                shadow: "shadow-blue-500/20",
                border: "border-blue-100 dark:border-blue-800",
                gradient: "from-blue-500/20"
            },
            indigo: {
                bg: "bg-indigo-50 dark:bg-indigo-900/20",
                text: "text-indigo-600 dark:text-indigo-400",
                shadow: "shadow-indigo-500/20",
                border: "border-indigo-100 dark:border-indigo-800",
                gradient: "from-indigo-500/20"
            },
            emerald: {
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
                text: "text-emerald-600 dark:text-emerald-400",
                shadow: "shadow-emerald-500/20",
                border: "border-emerald-100 dark:border-emerald-800",
                gradient: "from-emerald-500/20"
            },
            rose: {
                bg: "bg-rose-50 dark:bg-rose-900/20",
                text: "text-rose-600 dark:text-rose-400",
                shadow: "shadow-rose-500/20",
                border: "border-rose-100 dark:border-rose-800",
                gradient: "from-rose-500/20"
            },
            amber: {
                bg: "bg-amber-50 dark:bg-amber-900/20",
                text: "text-amber-600 dark:text-amber-400",
                shadow: "shadow-amber-500/20",
                border: "border-amber-100 dark:border-amber-800",
                gradient: "from-amber-500/20"
            },
            violet: {
                bg: "bg-violet-50 dark:bg-violet-900/20",
                text: "text-violet-600 dark:text-violet-400",
                shadow: "shadow-violet-500/20",
                border: "border-violet-100 dark:border-violet-800",
                gradient: "from-violet-500/20"
            },
            cyan: {
                bg: "bg-cyan-50 dark:bg-cyan-900/20",
                text: "text-cyan-600 dark:text-cyan-400",
                shadow: "shadow-cyan-500/20",
                border: "border-cyan-100 dark:border-cyan-800",
                gradient: "from-cyan-500/20"
            },
            orange: {
                bg: "bg-orange-50 dark:bg-orange-900/20",
                text: "text-orange-600 dark:text-orange-400",
                shadow: "shadow-orange-500/20",
                border: "border-orange-100 dark:border-orange-800",
                gradient: "from-orange-500/20"
            }
        };
        return styles[theme] || styles.blue;
    };

    const mainServices = [
        {
            category: 'management',
            title: "إدارة شاملة للمتقدمين الطلاب والمعلمين",
            description: "نظام متكامل لإدارة بيانات الطلاب والمعلمين مع إمكانيات متقدمة للتتبع والمراقبة",
            icon: Users,
            features: [
                "ملفات شخصية تفصيلية للطلاب والمعلمين",
                "نظام تسجيل وقبول إلكتروني",
                "توزيع آلي للمتقدمين",
                "أرشفة ذكية للسجلات",
                "توزيع المتقدمين على الحلقات",
            ],
            benefits: ["توفير 70% من الوقت الإداري", "دقة 99% في البيانات", "سهولة في المتابعة"],
            image: SERVICE_IMAGES.studentsManagement,
            popular: true,
            theme: "blue"
        },
        {
            category: 'management',
            title: "إدارة شاملة للطلاب والمعلمين",
            description: "نظام متكامل لإدارة بيانات الطلاب والمعلمين مع إمكانيات متقدمة للتتبع والمراقبة",
            icon: Users,
            features: [
                "ملفات شخصية تفصيلية للطلاب والمعلمين",
                "نظام تسجيل وقبول إلكتروني",
                "إدارة المجموعات والصفوف",
                "تتبع الحضور والغياب",
                "إدارة الصلاحيات والأدوار"
            ],
            benefits: ["توفير 70% من الوقت الإداري", "دقة 99% في البيانات", "سهولة في المتابعة"],
            image: SERVICE_IMAGES.studentsManagement,
            popular: true,
            theme: "indigo"
        },
        {
            category: 'education',
            title: "مصحف تفاعلي ومتطور",
            description: "مصحف تفاعلي يوفر أدوات تفاعلية لتقييد أخطاء الطلاب وملاحظاتهم والرجوع اليها",
            icon: BookOpen,
            features: [
                "مصحف إلكتروني بالرسم العثماني",
                "تسجيلات صوتية لأشهر القراء",
                "تقييد أخطاء بطريقة ذكية",
                "تظليل الكلمة بلون لكل خطأ",
                "تقييمات ذكية ومراجعة",
            ],
            benefits: ["تحسن متابعات الحفظ بنسبة 85%", "تفاعل أكبر مع المحتوى", "تعلم أسرع"],
            image: SERVICE_IMAGES.musHafInteractive,
            popular: false,
            theme: "emerald"
        },
        {
            category: 'education',
            title: "متابعة مستمرة",
            description: "توفير متابعة مستمرة من خلال المطالبة اليومية من جميع الأطراف لإنجاز الخطط",
            icon: BookOpen,
            features: [
                "وضع وتعديل خطط مرنة",
                "لوحة تحكم للمتابعة",
                "متابعة التقدم في المواعيد",
                "توفير مرونة عبر Offline/online",
                "سير العمل بدون انترنت"
            ],
            benefits: ["تحسن المتابعة 85%", "مرونة مع ضعف الإنترنت", "سهولة المتابعة"],
            image: SERVICE_IMAGES.followUp,
            popular: false,
            theme: "rose"
        },
        {
            category: 'analytics',
            title: "تقارير ذكية وإحصائيات متقدمة",
            description: "نظام تقارير شامل يوفر رؤى عميقة حول أداء الطلاب وتقدمهم في الحفظ وأخطائهم",
            icon: BarChart3,
            features: [
                "لوحة تحكم تفاعلية",
                "تقارير تفصيلية قابلة للتخصيص",
                "إحصائيات في الوقت الفعلي",
                "مقارنات وتحليلات متقدمة",
                "تنبيهات ذكية للمتابعة"
            ],
            benefits: ["رؤية واضحة للأداء", "اتخاذ قرارات مدروسة", "تحسين النتائج"],
            image: SERVICE_IMAGES.reportsAnalytics,
            popular: true,
            theme: "amber"
        },
        {
            category: 'communication',
            title: "تواصل فعال ومتعدد القنوات",
            description: "منصة تواصل متكاملة تربط المعلمين بالطلاب وأولياء الأمور بطرق حديثة وآمنة",
            icon: MessageCircle,
            features: [
                "رسائل فورية آمنة",
                "إشعارات ذكية ومخصصة",
                "مشاركة الملفات والمستندات",
                "تقويم فعاليات مشترك"
            ],
            benefits: ["تواصل أسرع", "مشاركة أفضل للأهالي", "بيئة متصلة"],
            image: SERVICE_IMAGES.communicationPlatform,
            popular: false,
            theme: "violet"
        },
        {
            category: 'technology',
            title: "تقنية متقدمة وأمان عالي",
            description: "بنية تقنية حديثة مع أعلى معايير الأمان لضمان حماية البيانات والخصوصية",
            icon: Shield,
            features: [
                "تشفير متقدم للبيانات",
                "نسخ احتياطية تلقائية",
                "حماية من الاختراق",
                "امتثال للمعايير الدولية",
                "استرداد البيانات السريع"
            ],
            benefits: ["أمان 100%", "توفر مستمر للخدمة", "راحة بال كاملة"],
            image: SERVICE_IMAGES.securityTech,
            popular: false,
            theme: "cyan"
        },
        {
            category: 'management',
            title: "جدولة ذكية ومرنة",
            description: "نظام جدولة متطور لتنظيم الحصص والأنشطة مع إمكانيات التخصيص والتنبيهات",
            icon: Calendar,
            features: [
                "جدولة تلقائية للمتابعة",
                "إدارة الحلقات والموارد",
                "تقويم شخصي لكل مستخدم",
                "مزامنة مع تقويمات خارجية",
                "إدارة الإجازات والعطل"
            ],
            benefits: ["تنظيم أفضل للوقت", "تقليل التضارب", "كفاءة عالية"],
            image: SERVICE_IMAGES.schedulingSystem,
            popular: true,
            theme: "orange"
        }
    ];

    const additionalFeatures = [
        {
            icon: Smartphone,
            title: "تطبيق جوال متطور",
            description: "تطبيق سهل الاستخدام للأجهزة الذكية مع جميع الميزات",
            bg: "bg-purple-100 dark:bg-purple-900/20",
            text: "text-purple-600 dark:text-purple-400"
        },
        {
            icon: Globe,
            title: "دعم متعدد اللغات",
            description: "واجهة بالعربية والإنجليزية مع إمكانية إضافة لغات أخرى",
            bg: "bg-blue-100 dark:bg-blue-900/20",
            text: "text-blue-600 dark:text-blue-400"
        },
        {
            icon: Cloud,
            title: "التخزين السحابي",
            description: "حفظ آمن للبيانات في السحابة مع وصول من أي مكان",
            bg: "bg-sky-100 dark:bg-sky-900/20",
            text: "text-sky-600 dark:text-sky-400"
        },
        {
            icon: Headphones,
            title: "دعم فني متخصص",
            description: "فريق دعم متاح 24/7 لمساعدتك في أي وقت",
            bg: "bg-pink-100 dark:bg-pink-900/20",
            text: "text-pink-600 dark:text-pink-400"
        },
        {
            icon: RefreshCw,
            title: "تحديثات منتظمة",
            description: "تحديثات دورية مجانية لإضافة ميزات جديدة وتحسينات",
            bg: "bg-emerald-100 dark:bg-emerald-900/20",
            text: "text-emerald-600 dark:text-emerald-400"
        },
        {
            icon: Target,
            title: "تخصيص شامل",
            description: "إمكانية تخصيص المنصة لتناسب احتياجات مؤسستك",
            bg: "bg-amber-100 dark:bg-amber-900/20",
            text: "text-amber-600 dark:text-amber-400"
        }
    ];

    const pricingPlans = [
        {
            name: "الخطة الأساسية",
            price: "0",
            period: "سنويًا",
            description: "مثالية للمؤسسات الصغيرة",
            features: [
                "حتى 100 طالب",
                "10 معلمين",
                "التقارير الأساسية",
                "دعم فني بالإيميل",
                "التخزين: 5 جيجا"
            ],
            recommended: false,
        },
        {
            name: "الخطة المتوسطة",
            price: "249",
            period: "سنويًا",
            description: "مثالية للمؤسسات الصغيرة",
            features: [
                "حتى 250 طالب",
                "25 معلمين",
                "التقارير الأساسية",
                "دعم فني بالإيميل",
                "التخزين: 5 جيجا"
            ],
            recommended: false,
        },
        {
            name: "الخطة المتقدمة",
            price: "490",
            period: "سنويًا",
            description: "الأنسب للمؤسسات المتوسطة",
            features: [
                "حتى 1000 طالب",
                "75 معلم",
                "جميع التقارير",
                "دعم فني مباشر",
                "التخزين: 50 جيجا",
                "تطبيق الجوال"
            ],
            recommended: true,
        },
        {
            name: "الخطة الاحترافية",
            price: "990",
            period: "سنويًا",
            description: "للمؤسسات الكبيرة والمتقدمة",
            features: [
                "طلاب غير محدود",
                "معلمين غير محدود",
                "تقارير مخصصة",
                "دعم فني أولوية",
                "تخزين غير محدود",
                "تخصيص كامل",
                "تدريب مخصص"
            ],
            recommended: false,
        }
    ];

    const filteredServices = activeCategory === 'all' 
        ? mainServices 
        : mainServices.filter(service => service.category === activeCategory);

    return (
        <SiteLayout>
            <Head title="خدماتنا - شفيع" />

            {/* Hero Section */}
            <section className="relative py-20 gradient-hero overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.2'%3E%3Cpath d='m0 40 40-40V0H0v40z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                            <Star className="w-4 h-4 ml-1" />
                            خدمات متكاملة ومتطورة
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            خدماتنا المتميزة
                        </h1>
                        <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                            مجموعة شاملة من الخدمات والحلول التقنية المتطورة لتطوير وإدارة التعليم القرآني بأحدث المعايير العالمية
                        </p>
                    </div>
                </div>
            </section>

            {/* Service Categories Filter */}
            <section className="py-8 bg-background border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-4">
                        {serviceCategories.map((category) => (
                            <Button
                                key={category.id}
                                variant={activeCategory === category.id ? "default" : "outline"}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center gap-2 transition-all duration-300 ${
                                    activeCategory === category.id 
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                        : "bg-background text-foreground hover:bg-secondary hover:text-primary border-border"
                                }`}
                            >
                                <category.icon className="w-4 h-4" />
                                {category.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Services */}
            <section className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {filteredServices.map((service, index) => {
                            const themeStyle = getThemeStyles(service.theme);
                            
                            return (
                                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border bg-card">
                                    <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                                        <div className={`p-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                                            <div className="flex items-center gap-3 mb-4">
                                                {service.popular && (
                                                    <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                                                        <Star className="w-3 h-3 ml-1" />
                                                        الأكثر طلباً
                                                    </Badge>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border shadow-lg ${themeStyle.bg} ${themeStyle.border} ${themeStyle.shadow}`}>
                                                    <service.icon className={`w-7 h-7 ${themeStyle.text}`} />
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                                                    {service.title}
                                                </h3>
                                            </div>
                                            
                                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                                {service.description}
                                            </p>

                                            <div className="mb-6">
                                                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                                    <div className={`w-1 h-5 rounded-full ${themeStyle.bg.replace('/20', '')}`}></div>
                                                    المميزات الرئيسية:
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {service.features.map((feature, featureIndex) => (
                                                        <div key={featureIndex} className="flex items-center gap-2">
                                                            <CheckCircle className={`w-4 h-4 ${themeStyle.text} flex-shrink-0`} />
                                                            <span className="text-sm text-muted-foreground">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="font-semibold text-foreground mb-3">الفوائد:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {service.benefits.map((benefit, benefitIndex) => (
                                                        <Badge key={benefitIndex} variant="outline" className="text-xs border-border text-muted-foreground bg-muted/20">
                                                            {benefit}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                                                <PlayCircle className="w-4 h-4 ml-2" />
                                                تجربة مجانية
                                            </Button>
                                        </div>

                                        {/* قسم الصورة المعدل: أزلت البادينج وأزلت النص السفلي */}
                                        <div className={`bg-muted/30 p-0 flex items-center justify-center overflow-hidden h-full ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                                            <div className="relative w-full h-full min-h-[300px] group">
                                                <img 
                                                    src={service.image} 
                                                    alt={service.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[0.1] hover:grayscale-0"
                                                    loading="lazy"
                                                />
                                                {/* طبقة تدرج لوني خفيف من نفس لون الثيم لإعطاء عمق */}
                                                <div className={`absolute inset-0 bg-gradient-to-t ${themeStyle.gradient || 'from-black/20'} via-transparent to-transparent opacity-60`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Additional Features */}
            <section className="py-16 bg-muted/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-secondary text-primary hover:bg-secondary/80 border border-border">
                            <Zap className="w-4 h-4 ml-1" />
                            مميزات إضافية
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            المزيد من المميزات القوية
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            ميزات إضافية تجعل تجربتك مع منصة شفيع استثنائية ومتكاملة
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {additionalFeatures.map((feature, index) => (
                            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 group border-border bg-card">
                                <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    <feature.icon className={`w-6 h-6 ${feature.text}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Plans - Redesigned Modern Look */}
            <section className="py-24 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-muted/30 -skew-y-3 transform origin-top-left z-0"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm mb-6 text-primary font-medium text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>استثمار ذكي لمستقبل أفضل</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                            باقات مصممة لتناسب <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">احتياجاتكم</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            اختر الباقة التي تناسب حجم مؤسستك، وابدأ رحلة التحول الرقمي مع شفيع بكل يسر وسهولة.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {pricingPlans.map((plan, index) => (
                            <div 
                                key={index} 
                                className={`relative group transition-all duration-300 ${
                                    plan.recommended 
                                    ? 'z-10 -mt-4 mb-4 md:-mt-8 md:mb-0' 
                                    : 'hover:-translate-y-2'
                                }`}
                            >
                                {/* Glow Effect for Recommended */}
                                {plan.recommended && (
                                    <div className="absolute -inset-[2px] bg-gradient-to-r from-primary via-blue-500 to-primary rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition duration-500"></div>
                                )}

                                <Card className={`h-full relative overflow-hidden border-0 ${
                                    plan.recommended 
                                        ? 'bg-card shadow-2xl rounded-xl' 
                                        : 'bg-white/50 backdrop-blur-sm border border-border/60 hover:border-primary/30 shadow-lg hover:shadow-xl rounded-xl'
                                }`}>
                                    {plan.recommended && (
                                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary to-blue-600"></div>
                                    )}

                                    {plan.recommended && (
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                                <Star className="w-3 h-3 ml-1 fill-primary" />
                                                الأكثر طلباً
                                            </span>
                                        </div>
                                    )}

                                    <CardHeader className={`text-center pb-8 pt-10 ${plan.recommended ? 'bg-muted/30' : ''}`}>
                                        <h3 className={`text-xl font-bold mb-2 ${plan.recommended ? 'text-primary' : 'text-foreground'}`}>
                                            {plan.name}
                                        </h3>
                                        <div className="flex items-baseline justify-center gap-1 mb-4">
                                            <span className="text-5xl font-extrabold text-foreground tracking-tight">{plan.price}</span>
                                            <div className="flex flex-col items-start text-xs text-muted-foreground font-medium">
                                                <span>ريال</span>
                                                <span>{plan.period}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground px-4">
                                            {plan.description}
                                        </p>
                                    </CardHeader>
                                    
                                    <div className="px-6 py-2">
                                        <div className="w-full h-px bg-border/50"></div>
                                    </div>

                                    <CardContent className="pt-6 pb-8 px-8">
                                        <ul className="space-y-4 mb-8">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start gap-3 text-sm">
                                                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                        plan.recommended ? 'bg-primary text-white' : 'bg-secondary text-primary'
                                                    }`}>
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-foreground/80">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <Button 
                                            className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
                                                plan.recommended 
                                                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40' 
                                                    : 'bg-white border-2 border-muted hover:border-primary hover:text-primary text-muted-foreground'
                                            }`}
                                            asChild
                                        >
                                            <Link href={route('register')}>
                                                {plan.price === "0" ? "ابدأ مجاناً" : "اشترك الآن"}
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-block p-1 rounded-2xl bg-white border border-border shadow-sm">
                            <div className="flex flex-col sm:flex-row items-center gap-6 px-8 py-6 rounded-xl bg-muted/20">
                                <div className="text-right">
                                    <h4 className="font-bold text-foreground text-lg mb-1">مؤسسة تعليمية كبرى؟</h4>
                                    <p className="text-muted-foreground text-sm">لدينا حلول مخصصة للجمعيات والمجمعات الكبيرة</p>
                                </div>
                                <div className="h-10 w-px bg-border hidden sm:block"></div>
                                <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-white transition-all">
                                    <Link href="/contact">
                                        <MessageCircle className="w-4 h-4 ml-2" />
                                        تواصل معنا لعرض خاص
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 gradient-primary">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        جاهز لتحويل مؤسستك التعليمية؟
                    </h2>
                    <p className="text-xl text-white/90 mb-8 leading-relaxed">
                        ابدأ رحلتك مع شفيع اليوم واكتشف كيف يمكن لمنصتنا تطوير تعليم القرآن الكريم في مؤسستك
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild className="bg-background text-foreground hover:bg-muted border-none shadow-lg">
                            <Link href={route('register')}>
                                <Users className="w-5 h-5 ml-2" />
                                ابدأ تجربة مجانية
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="bg-transparent border-white/30 text-white hover:bg-white/10">
                            <Link href="/contact">
                                <MessageCircle className="w-5 h-5 ml-2" />
                                تحدث مع فريق المبيعات
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}