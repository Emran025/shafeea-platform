import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    BookOpen, Users, BarChart3, Shield, Calendar, Smartphone,
    Globe, MessageCircle, Star, Target, Zap, Headphones,
    TrendingUp, RefreshCw, Cloud, LucideIcon
} from 'lucide-react';
import { useState } from 'react';
import SiteLayout from '@/layouts/site-layout';
import ServiceCard, { ServiceData } from '@/components/shared/service-card';
import SubscriptionPlanSelection from '@/components/Pricing/subscription-plan-selection';

// Icon mapping function to convert string to icon component
const getIconComponent = (iconName: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
        'Users': Users,
        'BookOpen': BookOpen,
        'BarChart3': BarChart3,
        'Shield': Shield,
        'Calendar': Calendar,
        'MessageCircle': MessageCircle,
        'Globe': Globe,
    };
    return iconMap[iconName] || Users; // Default to Users if icon not found
};

interface ServicesPageProps {
    services: Array<{
        id: number;
        category: string;
        title: string;
        description: string;
        icon: string;
        image: string;
        features: string[];
        benefits: string[];
        popular: boolean;
        theme: string;
    }>;
    subscriptionPlans: Array<{
        id: number;
        name: string;
        slug: string;
        price: string;
        currency: string;
        billing_period: string;
        features: string[];
        is_recommended: boolean;
    }>;
}

export default function Services({ services, subscriptionPlans }: ServicesPageProps) {
    const [activeCategory, setActiveCategory] = useState('all');

    const serviceCategories = [
        { id: 'all', name: 'جميع الخدمات', icon: Globe },
        { id: 'management', name: 'إدارة الحلقات ', icon: Users },
        { id: 'education', name: 'التعليم والمنهجية', icon: BookOpen },
        { id: 'analytics', name: 'التقارير والإحصائيات', icon: BarChart3 },
        { id: 'communication', name: 'التواصل', icon: MessageCircle },
        { id: 'technology', name: 'التقنية والأمان', icon: Shield }
    ];

    // Transform services from backend to ServiceData format
    const mainServices: ServiceData[] = services.map(service => ({
        category: service.category,
        title: service.title,
        description: service.description,
        icon: getIconComponent(service.icon),
        features: service.features || [],
        benefits: service.benefits || [],
        image: service.image,
        popular: service.popular,
        theme: service.theme as ServiceData['theme']
    }));

    const additionalFeatures = [
        { icon: Smartphone, title: "تطبيق جوال متطور", description: "تطبيق سهل الاستخدام للأجهزة الذكية مع جميع الميزات", bg: "bg-purple-100 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400" },
        { icon: Globe, title: "دعم متعدد اللغات", description: "واجهة بالعربية والإنجليزية مع إمكانية إضافة لغات أخرى", bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400" },
        { icon: Cloud, title: "التخزين السحابي", description: "حفظ آمن للبيانات في السحابة مع وصول من أي مكان", bg: "bg-sky-100 dark:bg-sky-900/20", text: "text-sky-600 dark:text-sky-400" },
        { icon: Headphones, title: "دعم فني متخصص", description: "فريق دعم متاح 24/7 لمساعدتك في أي وقت", bg: "bg-pink-100 dark:bg-pink-900/20", text: "text-pink-600 dark:text-pink-400" },
        { icon: RefreshCw, title: "تحديثات منتظمة", description: "تحديثات دورية مجانية لإضافة ميزات جديدة وتحسينات", bg: "bg-emerald-100 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400" },
        { icon: Target, title: "تخصيص شامل", description: "إمكانية تخصيص المنصة لتناسب احتياجات مؤسستك", bg: "bg-amber-100 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400" }
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

            {/* Main Services (Refactored) */}
            <section className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {filteredServices.map((service, index) => (
                            // هنا نستخدم المكون الجديد فقط
                            <ServiceCard key={index} service={service} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Features */}
            <section className="py-24 bg-white dark:bg-gray-950 animate-fade-in-up">
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

            {/* Pricing SubscriptionPlans */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-muted/30 dark:bg-black/20 -skew-y-3 transform origin-top-left z-0"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-border dark:border-white/10 shadow-sm mb-6 text-primary font-medium text-sm backdrop-blur-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>استثمار ذكي لمستقبل أفضل</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                            باقات مصممة لتناسب <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400">احتياجاتكم</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            اختر الباقة التي تناسب حجم مؤسستك، وابدأ رحلة التحول الرقمي مع شفيع بكل يسر وسهولة.
                        </p>
                    </div>

                    <SubscriptionPlanSelection 
                        subscriptionPlans={subscriptionPlans} 
                        onSelectSubscriptionPlan={(subscriptionPlanId) => {
                            router.visit('/register', { data: { subscriptionPlan_id: subscriptionPlanId } });
                        }} 
                    />

                    <div className="mt-16 text-center">
                        <div className="inline-block p-1 rounded-2xl bg-white dark:bg-gray-900 border border-border dark:border-white/10 shadow-sm">
                            <div className="flex flex-col sm:flex-row items-center gap-6 px-8 py-6 rounded-xl bg-muted/20 dark:bg-white/5">
                                <div className="text-right">
                                    <h4 className="font-bold text-foreground text-lg mb-1">مؤسسة تعليمية كبرى؟</h4>
                                    <p className="text-muted-foreground text-sm">لدينا حلول مخصصة للجمعيات والمجمعات الكبيرة</p>
                                </div>
                                <div className="h-10 w-px bg-border dark:bg-white/10 hidden sm:block"></div>
                                <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-all">
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
                            <Link href="/register">
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