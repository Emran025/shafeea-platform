import { Head, Link } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Search, FileText, MessageCircle, Phone, 
    Sparkles, User, CreditCard, BookOpen, Star, 
    ChevronLeft, Headphones, LifeBuoy, ArrowRight
} from 'lucide-react';

export default function HelpCenter() {
    const popularTopics = [
        { title: 'بدء الاستخدام', icon: Sparkles, count: 12, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { title: 'الحساب والملف الشخصي', icon: User, count: 8, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { title: 'الاشتراكات والدفع', icon: CreditCard, count: 15, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
        { title: 'المناهج الدراسية', icon: BookOpen, count: 20, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    ];

    return (
        <SiteLayout>
            <Head title="مركز المساعدة - شفيع" />

            {/* Hero Section - Mirroring FAQ design */}
            <section className="relative py-24 gradient-hero overflow-hidden animate-fade-in-up">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-transparent dark:bg-black/60 transition-colors duration-300"></div>
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl mb-8 hover-scale-sm transition-all duration-300 shadow-xl">
                        <LifeBuoy className="w-10 h-10 text-white" />
                    </div>
                    <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md transition-all duration-300 text-sm px-4 py-2 shadow-sm glass-card">
                        <Star className="w-4 h-4 ml-1 text-yellow-300" />
                        دعم فني متكامل
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
                        كيف يمكننا مساعدتك اليوم؟
                    </h1>
                    <p className="text-xl text-blue-50/90 leading-relaxed mb-10 max-w-3xl mx-auto font-light">
                        ابحث في قاعدة المعرفة الخاصة بنا أو ابدأ تذكرة دعم جديدة
                    </p>
                    <div className="relative max-w-2xl mx-auto group">
                        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg transition-all duration-300 group-hover:bg-white/15">
                            <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
                            <Input 
                                type="text" 
                                placeholder="ابحث عن إجابة لمشكلتك..." 
                                className="pl-4 pr-14 py-6 bg-transparent border-0 text-white placeholder:text-white/70 text-lg focus:ring-0 focus-visible:ring-0 rounded-2xl h-16"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-20 bg-background relative z-20 -mt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="p-8 hover:shadow-xl transition-all hover-lift group text-center border-border border-t-4 border-t-emerald-500 bg-card">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                <FileText className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-foreground">الأسئلة الشائعة</h3>
                            <p className="text-muted-foreground mb-6 leading-relaxed">تصفح إجابات لأكثر الأسئلة تداولاً واستفساراً</p>
                            <Button variant="outline" className="w-full h-12 text-lg rounded-xl border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20" asChild>
                                <Link href="/faq">
                                    تصفح الأسئلة
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                </Link>
                            </Button>
                        </Card>
                        
                        <Card className="p-8 hover:shadow-xl transition-all hover-lift group text-center border-border border-t-4 border-t-blue-500 bg-card">
                             <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                <MessageCircle className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-foreground">تواصل معنا</h3>
                            <p className="text-muted-foreground mb-6 leading-relaxed">أرسل استفسارك وسنرد عليك قريباً خلال 24 ساعة</p>
                            <Button variant="outline" className="w-full h-12 text-lg rounded-xl border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20" asChild>
                                <Link href="/contact">
                                    راسلنا الآن
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                </Link>
                            </Button>
                        </Card>

                        <Card className="p-8 hover:shadow-xl transition-all hover-lift group text-center border-border border-t-4 border-t-purple-500 bg-card">
                             <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                <Headphones className="w-10 h-10 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-foreground">الدعم الفني</h3>
                            <p className="text-muted-foreground mb-6 leading-relaxed">هل تواجه مشكلة تقنية؟ فريقنا التقني هنا لمساعدتك</p>
                            <Button variant="outline" className="w-full h-12 text-lg rounded-xl border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20" asChild>
                                <Link href="/support">
                                    طلب دعم
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                </Link>
                            </Button>
                        </Card>
                    </div>
                </div>
            </section>

             {/* Help Categories */}
             <section className="py-24 bg-muted/30 dark:bg-gray-800/20 border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-primary/10 text-primary border-0">قاعدة المعرفة</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">تصفح حسب الموضوع</h2>
                        <p className="text-lg text-muted-foreground">اختر تصنيفاً للوصول إلى المقالات والحلول المتعلقة به</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularTopics.map((topic, i) => (
                             <Card key={i} className="p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group bg-card border-border">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className={`w-14 h-14 ${topic.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                                        <topic.icon className={`w-7 h-7 ${topic.color}`} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{topic.title}</h4>
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            <span className="text-sm text-muted-foreground font-medium">{topic.count} مقال</span>
                                            <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                             </Card>
                        ))}
                    </div>
                </div>
             </section>

             {/* Still need help? - Mirroring FAQ design */}
            <section className="py-24 bg-background animate-fade-in-up border-t border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-muted/30 border border-border rounded-3xl p-10 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:rotate-12 transition-transform">
                                <MessageCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                                لم تجد ما تبحث عنه؟
                            </h2>
                            <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-light">
                                فريق الدعم والمساعدة جاهز للرد على جميع استفساراتكم وحل مشكلاتكم.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="h-14 px-10 text-lg rounded-2xl shadow-xl shadow-primary/20">
                                    <Link href="/contact">
                                        <MessageCircle className="w-5 h-5 ml-3" />
                                        تواصل معنا
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild className="h-14 px-10 text-lg rounded-2xl border-2 hover:bg-muted">
                                    <Link href="/support">
                                        <Phone className="w-5 h-5 ml-3" />
                                        الدعم الفني
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
