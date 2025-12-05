import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
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
    Award,
    Clock,
    MessageCircle,
    CheckCircle,
    Star,
    Target,
    Zap,
    Settings,
    Database,
    Video,
    Download,
    Upload,
    FileText,
    Brain,
    Headphones,
    Lock,
    TrendingUp,
    Bell,
    Search,
    Filter,
    PieChart,
    BarChart,
    LineChart,
    Map,
    Camera,
    Mic,
    PlayCircle,
    Monitor,
    Tablet,
    Phone as PhoneIcon,
    Wifi,
    CloudSync,
    Backup,
    RefreshCw,
    Cloud
} from 'lucide-react';
import { useState } from 'react';
import SiteLayout from '@/layouts/site-layout';

export default function Services() {
    const { auth } = usePage<SharedData>().props;
    const [activeCategory, setActiveCategory] = useState('all');

    const serviceCategories = [
        { id: 'all', name: 'جميع الخدمات', icon: Globe },
        { id: 'management', name: 'إدارة الحلقات ', icon: Users },
        { id: 'education', name: 'التعليم والمناهج', icon: BookOpen },
        { id: 'analytics', name: 'التقارير والإحصائيات', icon: BarChart3 },
        { id: 'communication', name: 'التواصل', icon: MessageCircle },
        { id: 'technology', name: 'التقنية والأمان', icon: Shield }
    ];

    const mainServices = [
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
                "نظام إشعارات للأهالي",
                "إدارة الصلاحيات والأدوار"
            ],
            benefits: ["توفير 70% من الوقت الإداري", "دقة 99% في البيانات", "سهولة في المتابعة"],
            image: "👥",
            popular: true
        },
        {
            category: 'education',
            title: "منهج قرآني تفاعلي ومتطور",
            description: "منهج تعليمي شامل مع أدوات تفاعلية لتحفيظ القرآن الكريم وتعليم التلاوة والتجويد",
            icon: BookOpen,
            features: [
                "مصحف إلكتروني بالرسم العثماني",
                "تسجيلات صوتية لأشهر القراء",
                "دروس تجويد تفاعلية",
                "اختبارات وتقييمات ذكية",
                "برامج حفظ مخصصة",
                "متابعة التقدم الفردي"
            ],
            benefits: ["تحسن الحفظ بنسبة 85%", "تفاعل أكبر مع المحتوى", "تعلم أسرع وأكثر متعة"],
            image: "📖",
            popular: false
        },
        {
            category: 'analytics',
            title: "تقارير ذكية وإحصائيات متقدمة",
            description: "نظام تقارير شامل يوفر رؤى عميقة حول أداء الطلاب وتقدمهم في الحفظ",
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
                "منتديات نقاش تعليمية",
                "مكالمات صوتية ومرئية",
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
                "جدولة تلقائية للحصص",
                "إدارة القاعات والموارد",
                "تنبيهات للمواعيد المهمة",
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
            price: "299",
            period: "شهرياً",
            description: "مثالية للمؤسسات الصغيرة",
            features: [
                "حتى 100 طالب",
                "5 معلمين",
                "التقارير الأساسية",
                "دعم فني بالإيميل",
                "التخزين: 10 جيجا"
            ],
            recommended: false,
            color: "blue"
        },
        {
            name: "الخطة المتقدمة",
            price: "599",
            period: "شهرياً",
            description: "الأنسب للمؤسسات المتوسطة",
            features: [
                "حتى 500 طالب",
                "20 معلم",
                "جميع التقارير",
                "دعم فني مباشر",
                "التخزين: 50 جيجا",
                "تطبيق الجوال"
            ],
            recommended: true,
            color: "emerald"
        },
        {
            name: "الخطة الاحترافية",
            price: "1299",
            period: "شهرياً",
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
            color: "purple"
        }
    ];

    const filteredServices = activeCategory === 'all' 
        ? mainServices 
        : mainServices.filter(service => service.category === activeCategory);

    return (
        <SiteLayout title="خدماتنا">
            <Head title="خدماتنا - شفيع" />

            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 overflow-hidden">
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
                        <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                            مجموعة شاملة من الخدمات والحلول التقنية المتطورة لتطوير وإدارة التعليم القرآني بأحدث المعايير العالمية
                        </p>
                    </div>
                </div>
            </section>

            {/* Service Categories Filter */}
            <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-4">
                        {serviceCategories.map((category) => (
                            <Button
                                key={category.id}
                                variant={activeCategory === category.id ? "default" : "outline"}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center gap-2 ${
                                    activeCategory === category.id 
                                        ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white" 
                                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
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
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {filteredServices.map((service, index) => (
                            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                                    <div className={`p-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                                        <div className="flex items-center gap-3 mb-4">
                                            {service.popular && (
                                                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                                    <Star className="w-3 h-3 ml-1" />
                                                    الأكثر طلباً
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center">
                                                <service.icon className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                                {service.title}
                                            </h3>
                                        </div>
                                        
                                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                            {service.description}
                                        </p>

                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">المميزات الرئيسية:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {service.features.map((feature, featureIndex) => (
                                                    <div key={featureIndex} className="flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">الفوائد:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {service.benefits.map((benefit, benefitIndex) => (
                                                    <Badge key={benefitIndex} variant="outline" className="text-xs">
                                                        {benefit}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                                            <PlayCircle className="w-4 h-4 ml-2" />
                                            تجربة مجانية
                                        </Button>
                                    </div>

                                    <div className={`bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/10 dark:to-emerald-900/10 p-8 flex items-center justify-center ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                                        <div className="text-center">
                                            <div className="text-8xl mb-4">{service.image}</div>
                                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
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
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300">
                            <Zap className="w-4 h-4 ml-1" />
                            مميزات إضافية
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            المزيد من المميزات القوية
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            ميزات إضافية تجعل تجربتك مع منصة شفيع استثنائية ومتكاملة
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {additionalFeatures.map((feature, index) => (
                            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 group">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Plans */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300">
                            <TrendingUp className="w-4 h-4 ml-1" />
                            خطط الاشتراك
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            اختر الخطة المناسبة لك
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            خطط مرنة تناسب جميع أحجام المؤسسات التعليمية مع إمكانية الترقية في أي وقت
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <Card key={index} className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 ${
                                plan.recommended ? 'border-2 border-emerald-500 scale-105' : 'hover:scale-105'
                            }`}>
                                {plan.recommended && (
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-center py-2 text-sm font-medium">
                                        الأكثر اختياراً
                                    </div>
                                )}
                                
                                <CardHeader className={`text-center ${plan.recommended ? 'pt-8' : 'pt-6'}`}>
                                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {plan.name}
                                    </CardTitle>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                                        <span className="text-gray-600 dark:text-gray-300 mr-2">ريال</span>
                                        <div className="text-sm text-gray-500">{plan.period}</div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {plan.description}
                                    </p>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                    {plan.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-center gap-2">
                                            <CheckCircle className={`w-4 h-4 text-${plan.color}-600 flex-shrink-0`} />
                                            <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                    
                                    <Button 
                                        className={`w-full mt-6 ${
                                            plan.recommended 
                                                ? 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700' 
                                                : `bg-${plan.color}-600 hover:bg-${plan.color}-700`
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
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            هل تحتاج خطة مخصصة لمؤسستك الكبيرة؟
                        </p>
                        <Button variant="outline" asChild>
                            <Link href="/contact">
                                <MessageCircle className="w-4 h-4 ml-2" />
                                تواصل معنا لعرض مخصص
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        جاهز لتحويل مؤسستك التعليمية؟
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                        ابدأ رحلتك مع شفيع اليوم واكتشف كيف يمكن لمنصتنا تطوير تعليم القرآن الكريم في مؤسستك
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
                            <Link href={route('register')}>
                                <Users className="w-5 h-5 ml-2" />
                                ابدأ تجربة مجانية
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
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