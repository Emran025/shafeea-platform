import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    HelpCircle,
    MessageCircle,
    BookOpen,
    Users,
    Settings,
    CreditCard,
    ChevronDown,
    ChevronUp,
    Star,
    CheckCircle,
    AlertCircle,
    Mail,
    Phone,
    Globe,
    Clock,
    Filter,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import SiteLayout from '@/layouts/site-layout';

export default function FAQ() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const categories = [
        { id: 'all', name: 'جميع الأسئلة', icon: HelpCircle },
        { id: 'general', name: 'عام', icon: Globe },
        { id: 'account', name: 'الحساب', icon: Settings },
        { id: 'features', name: 'الميزات', icon: BookOpen },
        { id: 'billing', name: 'الفواتير', icon: CreditCard }
    ];

    const faqData = [
        {
            id: 'what-is-shafeea',
            category: 'general',
            question: 'ما هي منصة شفيع؟',
            answer: 'شفيع هي منصة تعليمية متطورة مخصصة لإدارة الحلقات القرآنية والمؤسسات التعليمية الإسلامية. توفر أدوات شاملة لإدارة الطلاب والمعلمين ومتابعة التقدم في حفظ القرآن الكريم.',
            popular: true
        },
        {
            id: 'how-to-get-started',
            category: 'general',
            question: 'كيف يمكنني البدء باستخدام المنصة؟',
            answer: 'يمكنك البدء بإنشاء حساب مجاني من خلال صفحة التسجيل. ستحصل على فترة تجريبية مجانية لمدة 30 يوماً لاستكشاف جميع ميزات المنصة.',
            popular: true
        },
        {
            id: 'pricing-plans',
            category: 'general',
            question: 'ما هي خطط الأسعار المتاحة؟',
            answer: 'نوفر ثلاث خطط رئيسية: الأساسية (299 ريال)، المتقدمة (599 ريال)، والاحترافية (1299 ريال شهرياً). كل خطة تناسب حجم مؤسسة مختلف.',
            popular: true
        },
        {
            id: 'data-security',
            category: 'general',
            question: 'هل بياناتي آمنة على المنصة؟',
            answer: 'نعم، نستخدم تشفير متقدم ونسخ احتياطية منتظمة. نلتزم بأعلى معايير الأمان الدولية وقوانين حماية البيانات.',
            popular: true
        },
        {
            id: 'create-account',
            category: 'account',
            question: 'كيف أنشئ حساباً جديداً؟',
            answer: 'انقر على "التسجيل"، املأ البيانات المطلوبة، واتبع التعليمات. ستحصل على رابط تفعيل عبر البريد الإلكتروني.',
            popular: false
        },
        {
            id: 'forgot-password',
            category: 'account',
            question: 'نسيت كلمة المرور، ماذا أفعل؟',
            answer: 'انقر على "نسيت كلمة المرور" في صفحة تسجيل الدخول، أدخل بريدك الإلكتروني، وستصلك تعليمات إعادة التعيين.',
            popular: true
        },
        {
            id: 'student-management',
            category: 'features',
            question: 'كيف أدير بيانات الطلاب؟',
            answer: 'من لوحة التحكم، اذهب إلى "إدارة الطلاب" حيث يمكنك إضافة طلاب جدد، تعديل بياناتهم، وتتبع تقدمهم في الحفظ.',
            popular: true
        },
        {
            id: 'progress-tracking',
            category: 'features',
            question: 'كيف أتابع تقدم الطلاب؟',
            answer: 'نوفر نظام متابعة شامل يسجل ما تم حفظه ومراجعته ودرجات التقييم في رسوم بيانية واضحة وتقارير مفصلة.',
            popular: true
        },
        {
            id: 'reports-generation',
            category: 'features',
            question: 'ما أنواع التقارير المتاحة؟',
            answer: 'نوفر تقارير متنوعة: تقدم الطالب الفردي، تقارير الصف، الحضور والغياب، والأداء الشهري والسنوي.',
            popular: false
        },
        {
            id: 'payment-methods',
            category: 'billing',
            question: 'ما هي طرق الدفع المقبولة؟',
            answer: 'نقبل جميع البطاقات الائتمانية الرئيسية، التحويل البنكي، ومدى. الدفع آمن ومشفر بالكامل.',
            popular: false
        },
        {
            id: 'refund-policy',
            category: 'billing',
            question: 'ما هي سياسة الاسترداد؟',
            answer: 'نوفر ضمان استرداد لمدة 14 يوماً من تاريخ الاشتراك الأول. يمكنك إلغاء الاشتراك في أي وقت دون رسوم إضافية.',
            popular: false
        }
    ];

    const filteredFAQ = faqData.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const popularFAQ = faqData.filter(item => item.popular);

    const toggleExpanded = (id: string) => {
        setExpandedItems(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    return (
        <SiteLayout>
            <Head title="الأسئلة الشائعة - شفيع" />

            {/* Hero Section */}
            <section className="relative py-24 gradient-hero overflow-hidden animate-fade-in-up">
                
                <div className="absolute inset-0">

                    <div className="absolute inset-0 bg-transparent dark:bg-black/60 transition-colors duration-300"></div>
                    
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl mb-8 hover-scale-sm transition-all duration-300 shadow-xl">
                            <HelpCircle className="w-10 h-10 text-white" />
                        </div>
                        
                        <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md transition-all duration-300 text-sm px-4 py-2 shadow-sm glass-card hover-lift">
                            <Star className="w-4 h-4 ml-1 text-yellow-300" />
                            مركز المساعدة والدعم
                        </Badge>
                        
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight drop-shadow-sm">
                            الأسئلة الشائعة
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-blue-50/90 leading-relaxed mb-10 max-w-4xl mx-auto font-light">
                            نجيب على أكثر الأسئلة شيوعاً حول منصة شفيع لمساعدتك في الحصول على أفضل تجربة تعليمية
                        </p>
                        
                        <div className="max-w-lg mx-auto">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                
                                <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg transition-all duration-300 group-hover:bg-white/15">
                                    <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                    <Input
                                        type="text"
                                        placeholder="ابحث في الأسئلة والإجابات..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-4 pr-12 py-5 bg-transparent border-0 text-white placeholder:text-white text-lg focus:ring-0 focus-visible:ring-0 rounded-xl h-14"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Background Decorations: */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl mix-blend-screen"></div>
                </div>
            </section>

            {/* Popular Questions */}
            <section className="py-20 bg-white dark:bg-gray-900 animate-fade-in-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl mb-6">
                            <Star className="w-8 h-8 text-orange-600" />
                        </div>
                        <Badge className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 dark:bg-gradient-to-r dark:from-amber-900/20 dark:to-orange-900/20 dark:text-orange-300 transition-all duration-300 text-sm px-4 py-2">
                            <TrendingUp className="w-4 h-4 ml-1" />
                            الأكثر طلباً وبحثاً
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            الأسئلة الأكثر شيوعاً
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            إجابات سريعة وواضحة لأهم الاستفسارات حول منصتنا
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {popularFAQ.map((item, index) => (
                            <Card key={item.id} className="group p-8 hover:shadow-2xl transition-all duration-500 hover-lift glass-card-subtle animate-fade-in-up border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-white font-bold text-sm">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-300">
                                            {item.question}
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base pl-14">
                                    {item.answer}
                                </p>
                                <div className="absolute bottom-4 left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center text-primary text-sm font-medium">
                                        <CheckCircle className="w-4 h-4 ml-1" />
                                        إجابة مفيدة
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 animate-fade-in-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-4 lg:gap-12">
                        {/* Categories */}
                        <div className="lg:col-span-1 mb-12 lg:mb-0">
                            <div className="sticky top-8">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-primary" />
                                        تصنيف الأسئلة
                                    </h3>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <Button
                                                key={category.id}
                                                variant={activeCategory === category.id ? "default" : "ghost"}
                                                onClick={() => setActiveCategory(category.id)}
                                                className={`w-full justify-start text-right transition-all duration-300 hover-lift rounded-xl py-3 ${
                                                    activeCategory === category.id 
                                                        ? "bg-gradient-primary text-white shadow-lg scale-105" 
                                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                <category.icon className="w-5 h-5 ml-3" />
                                                <span className="font-medium">{category.name}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Items */}
                        <div className="lg:col-span-3">
                            <div className="space-y-6">
                                {filteredFAQ.length > 0 ? (
                                    filteredFAQ.map((item, index) => (
                                        <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-500 hover-lift glass-card-subtle animate-fade-in-up border-0 bg-white dark:bg-gray-800">
                                            <CardHeader
                                                className="cursor-pointer hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-300 hover-lift p-6"
                                                onClick={() => toggleExpanded(item.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                            <span className="text-white font-bold text-sm">{index + 1}</span>
                                                        </div>
                                                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300 leading-tight">
                                                            {item.question}
                                                        </CardTitle>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="flex-shrink-0 group-hover:bg-primary/10 rounded-xl">
                                                        {expandedItems.includes(item.id) ? (
                                                            <ChevronUp className="w-6 h-6 text-primary" />
                                                        ) : (
                                                            <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            
                                            {expandedItems.includes(item.id) && (
                                                <CardContent className="pt-0 pb-6 px-6">
                                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-6 pl-14">
                                                        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6">
                                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                                                                {item.answer}
                                                            </p>
                                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                                <div className="flex items-center text-primary text-sm font-medium">
                                                                    <CheckCircle className="w-4 h-4 ml-1" />
                                                                    إجابة مفيدة
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    تم التحديث: ديسمبر 2024
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    ))
                                ) : (
                                    <Card className="p-12 text-center glass-card-subtle animate-fade-in-up bg-white dark:bg-gray-800">
                                        <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <AlertCircle className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                            لم نجد نتائج مطابقة
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                                            لم نجد أسئلة تطابق معايير بحثك. جرب استخدام كلمات مختلفة.
                                        </p>
                                        <Button variant="outline" onClick={() => {setSearchQuery(''); setActiveCategory('all');}} className="bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white">
                                            إعادة تعيين البحث
                                        </Button>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Support */}
            <section className="py-16 bg-white dark:bg-gray-900 animate-fade-in-up">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/10 dark:to-emerald-900/10 rounded-2xl p-8 glass-card hover-lift transition-all duration-300">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6 hover-scale-sm transition-all duration-300">
                            <MessageCircle className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            لم تجد ما تبحث عنه؟
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            فريق الدعم جاهز لمساعدتك. تواصل معنا وسنجيب خلال ساعات قليلة.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild className="bg-gradient-primary hover:opacity-90 transition-all duration-300 hover-lift shadow-lg">
                                <Link href="/contact">
                                    <Mail className="w-4 h-4 ml-2" />
                                    إرسال رسالة
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 hover-lift">
                                <Link href="/contact">
                                    <Phone className="w-4 h-4 ml-2" />
                                    اتصل بنا
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-sm">
                            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                <span>رد خلال 24 ساعة</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                <span>دعم باللغة العربية</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                                <Users className="w-4 h-4 text-emerald-600" />
                                <span>فريق متخصص</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}