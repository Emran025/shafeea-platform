import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Download as DownloadIcon,
    Smartphone,
    BookOpen,
    Users,
    Shield,
    Star,
    CheckCircle,
    Wifi,
    Bell,
    BarChart3,
    GraduationCap,
    Settings,
} from 'lucide-react';
import SiteLayout from '@/layouts/site-layout';

interface DownloadProps {
    studentApkUrl: string;
    teachApkUrl: string;
}

const studentFeatures = [
    { icon: BookOpen,   text: 'متابعة الحصص القرآنية' },
    { icon: BarChart3,  text: 'تقارير التقدم الشخصي' },
    { icon: Bell,       text: 'إشعارات فورية للجدول' },
    { icon: Wifi,       text: 'وضع عمل بدون إنترنت' },
    { icon: Star,       text: 'نظام نقاط وشارات الإنجاز' },
    { icon: Shield,     text: 'بيانات آمنة ومشفرة' },
];

const teachFeatures = [
    { icon: Users,         text: 'إدارة قوائم الطلاب' },
    { icon: GraduationCap, text: 'تسجيل الحضور والغياب' },
    { icon: BarChart3,     text: 'تقارير أداء شاملة' },
    { icon: Bell,          text: 'تواصل مباشر مع الأولياء' },
    { icon: Settings,      text: 'إدارة جدول الحصص' },
    { icon: Shield,        text: 'صلاحيات متعددة المستويات' },
];

export default function Download({ studentApkUrl, teachApkUrl }: DownloadProps) {
    return (
        <>
            <Head title="تحميل التطبيق – منصة شفيع" />
            <SiteLayout>

                {/* ── Hero ─────────────────────────────────────────────── */}
                <section className="relative overflow-hidden gradient-hero text-white shadow-lg">
                    {/* Background overlays */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-transparent dark:bg-black/40 transition-colors duration-300" />
                        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        </div>
                    </div>

                    {/* Floating blobs */}
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl mix-blend-screen animate-pulse delay-700 pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10 text-center">
                        <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md inline-flex items-center gap-2 shadow-sm">
                            <Smartphone className="w-4 h-4 text-yellow-400" />
                            التطبيقات الرسمية لمنصة شفيع
                        </Badge>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
                            <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 bg-clip-text text-transparent">
                                حمّل التطبيق
                            </span>
                            <br />
                            <span className="text-gray-50">وابدأ رحلتك القرآنية</span>
                        </h1>

                        <p className="text-xl text-blue-50/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                            تطبيقات شفيع متاحة مجاناً لجميع المستخدمين. اختر التطبيق المناسب وحمّله مباشرة على جهازك الأندرويد.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            {['مجاني تماماً', 'آمن ومشفر', 'يعمل بدون إنترنت', 'تحديثات مستمرة'].map((f, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/10 text-white hover:bg-white/20 transition-colors">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-medium">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Download Cards ───────────────────────────────────── */}
                <section className="py-24 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300">
                                <DownloadIcon className="w-4 h-4 ml-1" />
                                تحميل مباشر
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                اختر تطبيقك
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                لدينا تطبيقان مصمَّمان خصيصاً — واحد للطلاب وآخر للمعلمين والإدارة
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

                            {/* ── Student App Card ── */}
                            <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-blue-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                                        <BookOpen className="w-8 h-8 text-white" />
                                    </div>

                                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">تطبيق الطالب</h3>
                                        <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">للطلاب</Badge>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                        تطبيق شامل يُمكّن الطالب من متابعة مسيرته القرآنية، الاطلاع على جدوله، تتبع تقدمه، والتواصل مع معلمه بكل سهولة.
                                    </p>

                                    <ul className="space-y-2.5 mb-8">
                                        {studentFeatures.map(({ icon: Icon, text }, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                                    <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                {text}
                                            </li>
                                        ))}
                                    </ul>

                                    <a
                                        href={studentApkUrl}
                                        download
                                        id="download-student-apk"
                                        className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-gradient-to-l from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <DownloadIcon className="w-5 h-5" />
                                        تحميل تطبيق الطالب
                                        <span className="text-xs font-normal opacity-80">(APK)</span>
                                    </a>

                                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
                                        متوافق مع Android 7.0 وما فوق
                                    </p>
                                </div>
                            </Card>

                            {/* ── Teacher/Admin App Card ── */}
                            <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-emerald-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                                        <Users className="w-8 h-8 text-white" />
                                    </div>

                                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">تطبيق المعلم والإدارة</h3>
                                        <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">للمعلمين والإدارة</Badge>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                        تطبيق متكامل لإدارة الفصول الدراسية، متابعة الطلاب، تسجيل الحضور، وإعداد التقارير — كل شيء في مكان واحد.
                                    </p>

                                    <ul className="space-y-2.5 mb-8">
                                        {teachFeatures.map(({ icon: Icon, text }, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                                                    <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                {text}
                                            </li>
                                        ))}
                                    </ul>

                                    <a
                                        href={teachApkUrl}
                                        download
                                        id="download-teach-apk"
                                        className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-gradient-to-l from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <DownloadIcon className="w-5 h-5" />
                                        تحميل تطبيق المعلم والإدارة
                                        <span className="text-xs font-normal opacity-80">(APK)</span>
                                    </a>

                                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
                                        متوافق مع Android 7.0 وما فوق
                                    </p>
                                </div>
                            </Card>

                        </div>
                    </div>
                </section>

                {/* ── Installation Steps ───────────────────────────────── */}
                <section className="py-24 gradient-primary relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.2'%3E%3Cpath d='m0 40 40-40V0H0v40z'/%3E%3C/g%3E%3C/svg%3E")` }}
                        />
                    </div>
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse pointer-events-none" />
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000 pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                                <Smartphone className="w-4 h-4 ml-1" />
                                دليل التثبيت
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                كيفية تثبيت التطبيق
                            </h2>
                            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                                خطوات بسيطة لتثبيت التطبيق على جهازك الأندرويد
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { step: '١', title: 'حمّل ملف APK',    desc: 'اضغط على زر التحميل المناسب للتطبيق الذي تريده' },
                                { step: '٢', title: 'افتح الإعدادات',  desc: 'انتقل إلى الإعدادات ← الأمان ← فعّل "مصادر غير معروفة"' },
                                { step: '٣', title: 'ثبّت التطبيق',    desc: 'افتح ملف APK المحمّل واضغط تثبيت' },
                                { step: '٤', title: 'سجّل دخولك',      desc: 'افتح التطبيق وسجّل دخولك ببيانات حسابك على المنصة' },
                            ].map(({ step, title, desc }, i) => (
                                <div key={i} className="text-center group">
                                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-4 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300 border border-white/20 shadow-xl">
                                        <div className="text-5xl font-bold text-white mb-3 drop-shadow-lg">{step}</div>
                                        <div className="text-blue-100 font-bold text-lg mb-2">{title}</div>
                                        <div className="text-sm text-blue-200 leading-relaxed font-medium">{desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Security Note ────────────────────────────────────── */}
                <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-900/50 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">ملاحظة أمنية</h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                        تطبيقات منصة شفيع موقَّعة رقمياً ومتاحة مباشرة من إصداراتنا الرسمية.
                                        إذا ظهر تحذير من نظام أندرويد عند التثبيت، فذلك لأن التطبيق لم يُنشر على متجر Play بعد —
                                        لكنه آمن تماماً وصادر من مصادرنا الرسمية. لا تُحمّل التطبيق إلا من هذه الصفحة.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </SiteLayout>
        </>
    );
}
