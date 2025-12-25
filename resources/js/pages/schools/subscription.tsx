import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Users, MessageCircle, Star,
    TrendingUp, CheckCircle
} from 'lucide-react';
import SiteLayout from '@/layouts/site-layout';

// Icon mapping function to convert string to icon component

export default function Subscription() {


    const subscriptions = [
        {
            name: "الخطة الأساسية", price: "0", period: "سنويًا", description: "مثالية للمؤسسات الصغيرة",
            features: ["حتى 100 طالب", "10 معلمين", "التقارير الأساسية", "دعم فني بالإيميل", "التخزين: 5 جيجا"],
            recommended: false,
        },
        {
            name: "الخطة المتوسطة", price: "249", period: "سنويًا", description: "مثالية للمؤسسات الصغيرة",
            features: ["حتى 250 طالب", "25 معلمين", "التقارير الأساسية", "دعم فني بالإيميل", "التخزين: 5 جيجا"],
            recommended: false,
        },
        {
            name: "الخطة المتقدمة", price: "490", period: "سنويًا", description: "الأنسب للمؤسسات المتوسطة",
            features: ["حتى 1000 طالب", "75 معلم", "جميع التقارير", "دعم فني مباشر", "التخزين: 50 جيجا", "تطبيق الجوال"],
            recommended: true,
        },
        {
            name: "الخطة الاحترافية", price: "990", period: "سنويًا", description: "للمؤسسات الكبيرة والمتقدمة",
            features: ["طلاب غير محدود", "معلمين غير محدود", "تقارير مخصصة", "دعم فني أولوية", "تخزين غير محدود", "تخصيص كامل", "تدريب مخصص"],
            recommended: false,
        }
    ];


    return (
        <SiteLayout>
            <Head title="خدماتنا - شفيع" />

            {/* Pricing Plans */}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                        {subscriptions.map((plan, index) => (
                            <div 
                                key={index} 
                                className={`relative group transition-all duration-300 ${
                                    plan.recommended ? 'z-10 -mt-4 mb-4 md:-mt-6 md:mb-0' : 'hover:-translate-y-2'
                                }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute -inset-[2px] bg-gradient-to-r from-primary via-blue-500 to-primary rounded-2xl opacity-75 dark:opacity-50 blur-sm group-hover:opacity-100 transition duration-500"></div>
                                )}

                                <Card className={`h-full relative overflow-hidden ${
                                    plan.recommended 
                                        ? 'bg-card dark:bg-[#0d1b2a] shadow-2xl rounded-xl border-0 dark:border dark:border-primary/50' 
                                        : 'bg-white/50 dark:bg-gray-900/40 backdrop-blur-md border border-border/60 dark:border-white/10 shadow-lg hover:shadow-xl rounded-xl'
                                }`}>
                                    {plan.recommended && (
                                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary to-blue-600"></div>
                                    )}

                                    {plan.recommended && (
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-white">
                                                <Star className="w-3 h-3 ml-1 fill-primary dark:fill-white" />
                                                الأكثر طلباً
                                            </span>
                                        </div>
                                    )}

                                    <CardHeader className={`text-center pb-4 pt-8 ${plan.recommended ? 'bg-muted/30 dark:bg-white/5' : ''}`}>
                                        <h3 className={`text-lg font-bold mb-2 ${plan.recommended ? 'text-primary dark:text-blue-400' : 'text-foreground'}`}>
                                            {plan.name}
                                        </h3>
                                        <div className="flex items-baseline justify-center gap-1 mb-2">
                                            <span className="text-4xl font-extrabold text-foreground tracking-tight">{plan.price}</span>
                                            <div className="flex flex-col items-start text-[10px] text-muted-foreground font-medium">
                                                <span>ريال</span>
                                                <span>{plan.period}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground px-2">
                                            {plan.description}
                                        </p>
                                    </CardHeader>
                                    
                                    <div className="px-4 py-0">
                                        <div className="w-full h-px bg-border/50 dark:bg-white/10"></div>
                                    </div>

                                    <CardContent className="pt-4 pb-6 px-5">
                                        <ul className="space-y-3 mb-6">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start gap-2 text-xs">
                                                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                        plan.recommended ? 'bg-primary text-white' : 'bg-secondary text-primary dark:bg-white/10 dark:text-blue-400'
                                                    }`}>
                                                        <CheckCircle className="w-3 h-3" />
                                                    </div>
                                                    <span className="text-foreground/80 dark:text-gray-300 leading-snug">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <Button 
                                            className={`w-full h-10 text-sm font-semibold transition-all duration-300 ${
                                                plan.recommended 
                                                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40' 
                                                    : 'bg-white dark:bg-white/5 border-2 border-muted dark:border-white/10 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-white text-muted-foreground dark:text-gray-400'
                                            }`}
                                            asChild
                                        >
                                            <Link href="/register">
                                                {plan.price === "0" ? "ابدأ مجاناً" : "اشترك الآن"}
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

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