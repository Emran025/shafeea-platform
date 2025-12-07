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
import SiteLayout from '@/layouts/site-layout';

export default function Welcome() {
    return (
        <>
            <SiteLayout>


                {/* Hero Section */}
                <main className="relative overflow-hidden bg-gradient-primary text-white shadow-lg scale-105">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="text-center lg:text-right">
                                <Badge className="mb-6 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 inline-flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    المنصة الرائدة في إدارة الحلقات القرآنية
                                </Badge>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                                        شفيع
                                    </span>
                                    <br />
                                    <span className="text-gray-700 dark:text-gray-200">
                                        مستقبل التعليم القرآني
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    منصة متطورة ومتكاملة تجمع بين التقنية الحديثة والتراث الإسلامي لتقديم تجربة تعليمية قرآنية استثنائية تناسب العصر الرقمي
                                </p>

                                {/* Features Preview */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm font-medium">إدارة ذكية</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm font-medium">تقارير متقدمة</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm font-medium">أمان عالي</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    {/* The register and dashboard links have been removed from here. */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Decorations */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-emerald-200/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/15 to-pink-200/15 rounded-full blur-3xl"></div>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    إدارة الطلاب والمعلمين
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    نظام شامل لإدارة بيانات الطلاب والمعلمين مع إمكانية التتبع والمراقبة المستمرة للتقدم الأكاديمي
                                </p>
                            </Card>

                            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mb-4">
                                    <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    منهج قرآني متطور
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    منهج تعليمي قرآني شامل مع أدوات تفاعلية لتحفيظ القرآن الكريم وتعليم التلاوة والتجويد
                                </p>
                            </Card>

                            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                                    <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    تقارير وإحصائيات
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    تقارير تفصيلية وإحصائيات دقيقة لمتابعة أداء الطلاب وتقدمهم في حفظ القرآن الكريم
                                </p>
                            </Card>

                            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-4">
                                    <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    جدولة ذكية
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    نظام جدولة متقدم لتنظيم الحصص والأنشطة مع إمكانية التنبيهات التلقائية
                                </p>
                            </Card>

                            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    أمان متقدم
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    حماية شاملة للبيانات مع نظام أمان متعدد المستويات وحفظ احتياطي تلقائي
                                </p>
                            </Card>

                            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center mb-4">
                                    <Smartphone className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    متوافق مع الأجهزة
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    تصميم متجاوب يعمل بسلاسة على جميع الأجهزة مع تطبيق جوال مخصص
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

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center group">
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-4 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                                    <div className="text-4xl md:text-6xl font-bold text-white mb-2">50+</div>
                                    <div className="text-blue-100 font-medium">مؤسسة تعليمية</div>
                                    <div className="text-sm text-blue-200 mt-2">تثق بالمنصة</div>
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-4 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                                    <div className="text-4xl md:text-6xl font-bold text-white mb-2">5000+</div>
                                    <div className="text-blue-100 font-medium">طالب وطالبة</div>
                                    <div className="text-sm text-blue-200 mt-2">يحفظون القرآن</div>
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-4 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                                    <div className="text-4xl md:text-6xl font-bold text-white mb-2">300+</div>
                                    <div className="text-blue-100 font-medium">معلم ومعلمة</div>
                                    <div className="text-sm text-blue-200 mt-2">مؤهلون ومتخصصون</div>
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-4 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                                    <div className="text-4xl md:text-6xl font-bold text-white mb-2">95%</div>
                                    <div className="text-blue-100 font-medium">نسبة الرضا</div>
                                    <div className="text-sm text-blue-200 mt-2">من المستخدمين</div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                                    <Award className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-white mb-2">2,847</div>
                                <div className="text-blue-100">خاتم للقرآن الكريم</div>
                            </div>
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                                    <Clock className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-white mb-2">24/7</div>
                                <div className="text-blue-100">دعم فني متواصل</div>
                            </div>
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                                    <Globe className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-white mb-2">15+</div>
                                <div className="text-blue-100">دولة عربية وإسلامية</div>
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
                            <Badge className="mb-4 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                    "منصة رائعة جداً! ساعدتنا في تنظيم الحلقات القرآنية بشكل مثالي. التقارير مفصلة والواجهة سهلة الاستخدام."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                        أ.م
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">أحمد محمد</div>
                                        <div className="text-sm text-gray-500">مدير مركز النور القرآني</div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-t-emerald-500">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                    "أفضل استثمار قمنا به للمؤسسة. وفر علينا ساعات طويلة من العمل الإداري وحسّن من جودة التعليم."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                        ف.ع
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">فاطمة عبدالله</div>
                                        <div className="text-sm text-gray-500">مديرة أكاديمية الفرقان</div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-t-purple-500">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                    "الدعم الفني ممتاز والمنصة مستقرة جداً. طلابنا أحبوا النظام الجديد وأصبح التتبع أسهل بكثير."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                        م.ح
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">محمد حسن</div>
                                        <div className="text-sm text-gray-500">معلم في دار الحفاظ</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 bg-gray-50 dark:bg-gray-800">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300">
                                <MessageCircle className="w-4 h-4 ml-1" />
                                الأسئلة الشائعة
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                الأسئلة المتكررة
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                اجابات شافية على أهم الاستفسارات حول منصة شفيع
                            </p>
                        </div>

                        <div className="space-y-6">
                            <Card className="overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        ما هي متطلبات النظام لاستخدام المنصة؟
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        يمكن استخدام المنصة عبر أي متصفح ويب حديث باتصال إنترنت. لا حاجة لتحميل برامج إضافية أو متطلبات خاصة.
                                    </p>
                                </div>
                            </Card>

                            <Card className="overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        هل يوجد حد أقصى لعدد الطلاب أو المعلمين؟
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        لا، المنصة مصممة لتنمو مع مؤسستك. يمكنها استيعاب آلاف الطلاب والمعلمين بكفاءة عالية.
                                    </p>
                                </div>
                            </Card>

                            <Card className="overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        كيف يتم حفظ البيانات وضمان أمانها؟
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        نعتمد على أحدث تقنيات التشفير والحماية مع نسخ احتياطي تلقائي وخوادم آمنة عالية المواصفات.
                                    </p>
                                </div>
                            </Card>

                            <Card className="overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        هل تتوفر خدمة الدعم الفني؟
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        نعم، نوفر دعم فني متواصل 24/7 عبر عدة قنوات باللغة العربية مع فريق متخصص في التعليم القرآني.
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-24 bg-gray-50 dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                ابدأ رحلتك مع شفيع اليوم
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                                انضم إلى آلاف المعلمين والمؤسسات التعليمية التي تثق بمنصتنا لإدارة وتطوير الحلقات القرآنية بأحدث التقنيات وأفضل الممارسات
                            </p>

                            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    <span>بدون التزام مالي</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    <span>إعداد فوري في دقائق</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    <span>دعم فني 24/7</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    <span>تدريب مجاني</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


            </SiteLayout >

        </>
    );
}
