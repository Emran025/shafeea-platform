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

    const mainServices = [
        {
            category: 'management',
            title: "إدارة شاملة للمتقدمين الطلاب والمعلمين",
            description: "نظام متكامل لإدارة بيانات الطلاب والمعلمين مع إمكانيات متقدمة للتتبع والمراقبة",
            icon: Users,
            features: [
                "ملفات شخصية تفصيلية للطلاب والمعلمين",
                "نظام تسجيل وقبول إلكتروني",
                "إمكانية اختيار رفض متقدم في حال تخصيص المدرسة",
                "في حال رفض متقدم يتحول لمتقدم عم ولن يظهر للمدرسة",
                "إمكانية توزيع المتقدم الجديد على حلقة بعد قبوله",
            ],
            benefits: ["توفير 70% من الوقت الإداري", "دقة 99% في البيانات", "سهولة في المتابعة"],
            image: "👥",
            popular: true
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
                "تتبع الحضور والغياب التلقائي",
                "إدارة الصلاحيات والأدوار"
            ],
            benefits: ["توفير 70% من الوقت الإداري", "دقة 99% في البيانات", "سهولة في المتابعة"],
            image: "👥",
            popular: true
        },
        {
            category: 'education',
            title: "مصحف تفاعلي ومتطور",
            description: "مصحف تفاعلي يوفر أدوات تفاعلية لتقييد أخطاء الطلاب وملاحظاتهم والرجوع اليها من قبل الطلاب والمعلمين",
            icon: BookOpen,
            features: [
                "مصحف إلكتروني بالرسم العثماني",
                "تسجيلات صوتية لأشهر القراء",
                "تقييد أخطاء بطريقة ذكية",
                "تظليل الكلمة بلون لكل خطأ",
                "تقييمات ذكية",
                "برامج متنوعة (حفظ، مراجقة ، ..)",
                "الولوج لآخر متابعة والمواصلة"
            ],
            benefits: ["تحسن متابعات الحفظ بنسبة 85%", "تفاعل أكبر مع المحتوى", "تعلم أسرع وأكثر متعة"],
            image: "📖",
            popular: false
        },
        {
            category: 'education',
            title: "متابعة مستمرة",
            description: "توفير متابعة مستمرة من خلال المطالبة اليومية من جميع الأطراف من إنجاز ما تم التخطيط له من قبل الطلاب",
            icon: BookOpen,
            features: [
                "إمكانية وضع وتعديل خطط مرنة للطلاب",
                "لوحة تحكم ومراقبة المتابعة للمشرفين والمعلمين",
                "متابعة التقدم في المواعيد المحددة للمتابعة",
                "توفير مرونة عبر Offline/online",
                "سير العمل بدون انترنت حتى توفره",
                "متابعة التقدم الفردي وللحلقات"
            ],
            benefits: ["تحسن متابعات الحفظ بنسبة 85%", "مرونة أكبر للتعامل مع الخطط وضعف الإنترنت", "سهولة متابعة في الوقت الفعلي"],
            image: "📖",
            popular: false
        },
        {
            category: 'analytics',
            title: "تقارير ذكية وإحصائيات متقدمة",
            description: "نظام تقارير شامل يوفر رؤى عميقة حول أداء الطلاب وتقدمهم في الحفظ وأخطائهم سواء عبر الفترات الزمنية أو عبر الأجزاء في القران",
            icon: BarChart3,
            features: [
                "لوحة تحكم تفاعلية",
                "تقارير تفصيلية قابلة للتخصيص",
                "إحصائيات في الوقت الفعلي",
                "مقارنات وتحليلات متقدمة",
                "تصدير التقارير بصيغ متعددة",
                "تنبيهات ذكية للمتابعة"
            ],
            benefits: ["رؤية واضحة للأداء", "اتخاذ قرارات مدروسة", "تحسين النتائج"],
            image: "📊",
            popular: true
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
            benefits: ["تواصل أسرع وأكثر فعالية", "مشاركة أفضل للأهالي", "بيئة تعليمية متصلة"],
            image: "💬",
            popular: false
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
                "مراقبة أمنية مستمرة",
                "استرداد البيانات السريع"
            ],
            benefits: ["أمان 100% للبيانات", "توفر مستمر للخدمة", "راحة بال كاملة"],
            image: "🔒",
            popular: false
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
            benefits: ["تنظيم أفضل للوقت", "تقليل التضارب في المواعيد", "كفاءة إدارية عالية"],
            image: "📅",
            popular: true
        }
    ];

    const additionalFeatures = [
        {
            icon: Smartphone,
            title: "تطبيق جوال متطور",
            description: "تطبيق سهل الاستخدام للأجهزة الذكية مع جميع الميزات"
        },
        {
            icon: Globe,
            title: "دعم متعدد اللغات",
            description: "واجهة بالعربية والإنجليزية مع إمكانية إضافة لغات أخرى"
        },
        {
            icon: Cloud,
            title: "التخزين السحابي",
            description: "حفظ آمن للبيانات في السحابة مع وصول من أي مكان"
        },
        {
            icon: Headphones,
            title: "دعم فني متخصص",
            description: "فريق دعم متاح 24/7 لمساعدتك في أي وقت"
        },
        {
            icon: RefreshCw,
            title: "تحديثات منتظمة",
            description: "تحديثات دورية مجانية لإضافة ميزات جديدة وتحسينات"
        },
        {
            icon: Target,
            title: "تخصيص شامل",
            description: "إمكانية تخصيص المنصة لتناسب احتياجات مؤسستك"
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
            <section className="relative py-20 gradient-primary overflow-hidden">
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
                        {filteredServices.map((service, index) => (
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
                                        
                                        <div className="flex items-center gap-3 mb-4">
                                            {/* Icon container using secondary background to make primary icon pop */}
                                            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center border border-border">
                                                <service.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                                                {service.title}
                                            </h3>
                                        </div>
                                        
                                        <p className="text-muted-foreground mb-6 leading-relaxed">
                                            {service.description}
                                        </p>

                                        <div className="mb-6">
                                            <h4 className="font-semibold text-foreground mb-3">المميزات الرئيسية:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {service.features.map((feature, featureIndex) => (
                                                    <div key={featureIndex} className="flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
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

                                    {/* Image Section Background changed to muted/secondary mix for softness */}
                                    <div className={`bg-muted/30 p-8 flex items-center justify-center ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                                        <div className="text-center">
                                            <div className="text-8xl mb-4 drop-shadow-sm filter grayscale-[0.2] hover:grayscale-0 transition-all duration-300">{service.image}</div>
                                            <div className="text-4xl font-bold text-primary">
                                                {service.title.split(' ')[0]}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
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
                                {/* Using accent background for these icons to break monotony */}
                                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6 text-primary" />
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

            {/* Pricing Plans */}
            <section className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-secondary text-primary hover:bg-secondary/80 border border-border">
                            <TrendingUp className="w-4 h-4 ml-1" />
                            خطط الاشتراك
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            اختر الخطة المناسبة لك
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            خطط مرنة تناسب جميع أحجام المؤسسات التعليمية مع إمكانية الترقية في أي وقت
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <Card key={index} className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 border-border bg-card ${
                                plan.recommended ? 'border-2 border-primary scale-105 shadow-md' : 'hover:scale-105'
                            }`}>
                                {plan.recommended && (
                                    <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                                        الأكثر اختياراً
                                    </div>
                                )}
                                
                                <CardHeader className={`text-center ${plan.recommended ? 'pt-8' : 'pt-6'}`}>
                                    <CardTitle className="text-2xl font-bold text-foreground mb-2">
                                        {plan.name}
                                    </CardTitle>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                        <span className="text-muted-foreground mr-2">ريال</span>
                                        <div className="text-sm text-muted-foreground">{plan.period}</div>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        {plan.description}
                                    </p>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                    {plan.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                            <span className="text-sm text-muted-foreground">{feature}</span>
                                        </div>
                                    ))}
                                    
                                    <Button 
                                        className={`w-full mt-6 ${
                                            plan.recommended 
                                                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                                : 'bg-secondary text-primary hover:bg-accent border border-border'
                                        }`}
                                        asChild
                                    >
                                        <Link href={route('register')}>
                                            ابدأ الآن
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-muted-foreground mb-4">
                            هل تحتاج خطة مخصصة لمؤسستك الكبيرة؟
                        </p>
                        <Button variant="outline" asChild className="border-border text-foreground hover:bg-muted hover:text-primary">
                            <Link href="/contact">
                                <MessageCircle className="w-4 h-4 ml-2" />
                                تواصل معنا لعرض مخصص
                            </Link>
                        </Button>
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