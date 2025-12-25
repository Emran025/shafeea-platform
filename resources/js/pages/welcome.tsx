import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BookOpen,
    Users,
    BarChart3,
    CheckCircle,
    Star,
    Shield,
    Globe,
    Smartphone,
    Clock,
    Award,
    TrendingUp,
    MessageCircle,
    Calendar
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import SiteLayout from '@/layouts/site-layout';

export default function Welcome() {
    return (
        <>
            <SiteLayout>
                {/* Hero Section */}
                <main className="relative overflow-hidden gradient-hero text-white shadow-lg">
                    
                    {/* Background Overlays & Noise */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-transparent dark:bg-black/40 transition-colors duration-300"></div>
                        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="text-center lg:text-right">
                                <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md inline-flex items-center gap-2 shadow-sm">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    المنصة الرائدة في إدارة الحلقات القرآنية
                                </Badge>
                                
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
                                    <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 bg-clip-text text-transparent">
                                        شفيع
                                    </span>
                                    <br />
                                    <span className="text-gray-50">
                                        مستقبل التعليم القرآني
                                    </span>
                                </h1>
                                <p className="text-xl text-blue-50/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                                    منصة متطورة ومتكاملة تجمع بين التقنية الحديثة والتراث الإسلامي لتقديم تجربة تعليمية قرآنية استثنائية تناسب العصر الرقمي
                                </p>

                                {/* Features Preview: */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/10 text-white hover:bg-white/20 transition-colors">
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm font-medium">إدارة ذكية</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/10 text-white hover:bg-white/20 transition-colors">
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm font-medium">تقارير متقدمة</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/10 text-white hover:bg-white/20 transition-colors">
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm font-medium">أمان عالي</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    {/* The register and dashboard links have been removed from here. */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Decorations: */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl mix-blend-screen animate-pulse delay-700"></div>
                    </div>
                </main>


                {/* Features Section */}
                <section id="features" className="py-24 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300">
                                <Award className="w-4 h-4 ml-1" />
                                مميزات متقدمة
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                حلول شاملة لإدارة الحلقات القرآنية
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                منصة متكاملة تجمع بين التقنية الحديثة والاحتياجات التعليمية الإسلامية لتوفير تجربة تعليمية استثنائية
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            
                            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-emerald-500 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    منهج قرآني متطور
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    منهج تعليمي قرآني شامل مع أدوات تفاعلية لتحفيظ القرآن الكريم وتعليم التلاوة والتجويد
                                </p>
                            </Card>

                            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-purple-500 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <BarChart3 className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    تقارير وإحصائيات
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    تقارير تفصيلية وإحصائيات دقيقة لمتابعة أداء الطلاب وتقدمهم في حفظ القرآن الكريم
                                </p>
                            </Card>

                            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-orange-500 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Calendar className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    جدولة ذكية
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    نظام جدولة متقدم لتنظيم الحصص والأنشطة مع إمكانية التنبيهات التلقائية
                                </p>
                            </Card>

                            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-red-500 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    أمان متقدم
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    حماية شاملة للبيانات مع نظام أمان متعدد المستويات وحفظ احتياطي تلقائي
                                </p>
                            </Card>

                            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-teal-500 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Smartphone className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    متوافق مع الأجهزة
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    تصميم متجاوب يعمل بسلاسة على جميع الأجهزة مع تطبيق جوال مخصص
                                </p>
                            </Card>

                            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-blue-500 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Users className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    إدارة الطلاب والمعلمين
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    نظام شامل لإدارة بيانات الطلاب والمعلمين مع إمكانية التتبع والمراقبة المستمرة للتقدم الأكاديمي
                                </p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Enhanced Statistics Section */}
                <section className="py-24 gradient-primary relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.2'%3E%3Cpath d='m0 40 40-40V0H0v40z'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                                <TrendingUp className="w-4 h-4 ml-1" />
                                أرقام وإحصائيات مبهرة
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                نجاحات متميزة على أرض الواقع
                            </h2>
                            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                                أرقام حقيقية تعكس نجاح وتميز منصة شفيع في خدمة التعليم القرآني
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center group">
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-4 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300 border border-white/20 shadow-xl">
                                    <div className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">50+</div>
                                    <div className="text-blue-100 font-semibold text-lg">مؤسسة تعليمية</div>
                                    <div className="text-sm text-blue-200 mt-2 font-medium">تثق بالمنصة</div>
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-4 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300 border border-white/20 shadow-xl">
                                    <div className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">5000+</div>
                                    <div className="text-blue-100 font-semibold text-lg">طالب وطالبة</div>
                                    <div className="text-sm text-blue-200 mt-2 font-medium">يحفظون القرآن</div>
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-4 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300 border border-white/20 shadow-xl">
                                    <div className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">300+</div>
                                    <div className="text-blue-100 font-semibold text-lg">معلم ومعلمة</div>
                                    <div className="text-sm text-blue-200 mt-2 font-medium">مؤهلون ومتخصصون</div>
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-4 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300 border border-white/20 shadow-xl">
                                    <div className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">95%</div>
                                    <div className="text-blue-100 font-semibold text-lg">نسبة الرضا</div>
                                    <div className="text-sm text-blue-200 mt-2 font-medium">من المستخدمين</div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                            <div className="text-center group">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-4 shadow-lg group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                                    <Award className="w-10 h-10 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">2,847</div>
                                <div className="text-blue-100 font-semibold">خاتم للقرآن الكريم</div>
                            </div>
                            <div className="text-center group">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-4 shadow-lg group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                                    <Clock className="w-10 h-10 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">24/7</div>
                                <div className="text-blue-100 font-semibold">دعم فني متواصل</div>
                            </div>
                            <div className="text-center group">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-4 shadow-lg group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                                    <Globe className="w-10 h-10 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">15+</div>
                                <div className="text-blue-100 font-semibold">دولة عربية وإسلامية</div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
                </section>

                {/* Testimonials Section */}
                <section className="py-24 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-300">
                                <Star className="w-4 h-4 ml-1" />
                                آراء وتقييمات المستخدمين
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                ماذا يقول عملاؤنا عن شفيع؟
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                تقييمات حقيقية من معلمين ومدراء مؤسسات تعليمية يستخدمون منصتنا يومياً
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Card 1: Blue Theme */}
                            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-blue-500 group">
                                <div className="flex items-center gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-base font-medium">
                                    "منصة رائعة جداً! ساعدتنا في تنظيم الحلقات القرآنية بشكل مثالي. التقارير مفصلة والواجهة سهلة الاستخدام."
                                </p>
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    {/* Updated Gradient to match Features Section Blue */}
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        أ.م
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">أحمد محمد</div>
                                        <div className="text-sm text-gray-500 font-medium">مدير مركز النور القرآني</div>
                                    </div>
                                </div>
                            </Card>

                            {/* Card 2: Emerald Theme */}
                            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-red-500 group">
                                <div className="flex items-center gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-base font-medium">
                                    "أفضل استثمار قمنا به للمؤسسة. وفر علينا ساعات طويلة من العمل الإداري وحسّن من جودة التعليم."
                                </p>
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    {/* Updated Gradient to match Features Section Emerald */}
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        ف.ع
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">فاطمة عبدالله</div>
                                        <div className="text-sm text-gray-500 font-medium">مديرة أكاديمية الفرقان</div>
                                    </div>
                                </div>
                            </Card>

                            {/* Card 3: Purple Theme */}
                            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-teal-500 group">
                                <div className="flex items-center gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-base font-medium">
                                    "الدعم الفني ممتاز والمنصة مستقرة جداً. طلابنا أحبوا النظام الجديد وأصبح التتبع أسهل بكثير."
                                </p>
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    {/* Updated Gradient to match Features Section Purple */}
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        م.ح
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">محمد حسن</div>
                                        <div className="text-sm text-gray-500 font-medium">معلم في دار الحفاظ</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>
                {/* FAQ Section */}
                <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-amber-100/80 text-amber-900 border-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-800 shadow-sm px-4 py-1.5 text-sm">
                                <MessageCircle className="w-4 h-4 ml-2" />
                                الأسئلة الشائعة
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                الأسئلة المتكررة
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                اجابات شافية وكافية على أكثر الاستفسارات شيوعاً حول منصة شفيع ومميزاتها
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-900/50 rounded-3xl p-2 sm:p-6 shadow-xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1" className="border-b border-gray-100 dark:border-gray-800 last:border-0 px-4">
                                    <AccordionTrigger className="text-right text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 py-6 transition-all duration-300 no-underline hover:no-underline">
                                        ما هي متطلبات النظام لاستخدام المنصة؟
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600 dark:text-gray-400 text-base leading-relaxed pb-6">
                                        يمكن استخدام المنصة عبر أي متصفح ويب حديث (Chrome, Safari, Firefox, Edge) باتصال إنترنت مستقر. لا حاجة لتحميل أي برامج إضافية أو القلق بشأن توافق نظام التشغيل، حيث تعمل المنصة بكفاءة على كافة الأجهزة.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2" className="border-b border-gray-100 dark:border-gray-800 last:border-0 px-4">
                                    <AccordionTrigger className="text-right text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 py-6 transition-all duration-300 no-underline hover:no-underline">
                                        هل يوجد حد أقصى لعدد الطلاب أو المعلمين؟
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600 dark:text-gray-400 text-base leading-relaxed pb-6">
                                        لا، المنصة مصممة بتقنيات سحابية مرنة تسمح لها بالنمو مع مؤسستك مهما كان حجمها. يمكنها استيعاب عشرات الآلاف من الطلاب والمعلمين بكفاءة عالية جداً دون أي تأثر في الأداء.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3" className="border-b border-gray-100 dark:border-gray-800 last:border-0 px-4">
                                    <AccordionTrigger className="text-right text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 py-6 transition-all duration-300 no-underline hover:no-underline">
                                        كيف يتم حفظ البيانات وضمان أمانها؟
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600 dark:text-gray-400 text-base leading-relaxed pb-6">
                                        نولي أمن البيانات أقصى أولوياتنا. نستخدم بروتوكولات تشفير متطورة (SSL/TLS)، ونقوم بإجراء نسخ احتياطي تلقائي دوري للبيانات. كما يتم استضافة المنصة على خوادم آمنة وعالية المواصفات تضمن حماية خصوصيتك واستمرارية الخدمة.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-4" className="border-b border-gray-100 dark:border-gray-800 last:border-0 px-4">
                                    <AccordionTrigger className="text-right text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 py-6 transition-all duration-300 no-underline hover:no-underline">
                                        هل تتوفر خدمة الدعم الفني؟
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600 dark:text-gray-400 text-base leading-relaxed pb-6">
                                        نعم، نفخر بتقديم دعم فني متكامل باللغة العربية على مدار الساعة 24/7. فريقنا متخصص في حلول التعليم التقني والقرآني، وجاهز للرد على استفساراتكم عبر الواتساب، البريد الإلكتروني، أو من خلال نظام التذاكر داخل المنصة.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-24 bg-white dark:bg-gray-950 animate-fade-in-up">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                ابدأ رحلتك مع شفيع اليوم
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                                انضم إلى آلاف المعلمين والمؤسسات التعليمية التي تثق بمنصتنا لإدارة وتطوير الحلقات القرآنية بأحدث التقنيات وأفضل الممارسات
                            </p>
                            {/* Features Preview: */}
                            <div className="flex flex-wrap justify-center gap-4 mb-8">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/10  hover:bg-white/20 transition-colors">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-medium">بدون التزام مالي</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/10  hover:bg-white/20 transition-colors">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-medium">إعداد فوري في دقائق</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/10  hover:bg-white/20 transition-colors">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-medium">تدريب مجاني</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </SiteLayout >
        </>
    );
}
