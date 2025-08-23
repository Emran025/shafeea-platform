import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Shield,
    Lock,
    Eye,
    FileText,
    CheckCircle,
    AlertCircle,
    Users,
    Database,
    Globe,
    Clock,
    Mail,
    Phone,
    Settings,
    Trash2,
    Download,
    Upload,
    RefreshCw,
    Bell,
    Camera,
    Mic,
    MapPin,
    CreditCard,
    Server,
    Cloud,
    Smartphone,
    Monitor,
    Wifi,
    MousePointer,
    Activity
} from 'lucide-react';
import SiteLayout from '@/layouts/site-layout';

export default function Privacy() {
    const { auth } = usePage<SharedData>().props;

    const privacySections = [
        {
            id: "introduction",
            title: "المقدمة",
            icon: FileText,
            content: [
                "نحن في شركة تاج الوقار نقدر خصوصيتك ونلتزم بحماية معلوماتك الشخصية",
                "تحدد هذه السياسة كيفية جمع واستخدام وحماية ومشاركة معلوماتك عند استخدام منصتنا",
                "باستخدام خدماتنا، فإنك توافق على ممارسات جمع واستخدام المعلومات الموضحة في هذه السياسة",
                "نلتزم بالامتثال لجميع القوانين واللوائح المحلية والدولية المتعلقة بحماية البيانات",
                "نحدث سياسة الخصوصية هذه بانتظام لتعكس أي تغييرات في ممارساتنا أو متطلبات القانون"
            ]
        },
        {
            id: "data-collection",
            title: "البيانات التي نجمعها",
            icon: Database,
            content: [
                "المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف، العنوان",
                "بيانات الحساب: اسم المستخدم، كلمة المرور المشفرة، تفضيلات الحساب",
                "المعلومات التعليمية: البيانات الأكاديمية، التقدم في الحفظ، النتائج والدرجات",
                "بيانات الاستخدام: مدة الجلسات، الصفحات المزارة، الميزات المستخدمة",
                "المعلومات التقنية: عنوان IP، نوع المتصفح، نظام التشغيل، معلومات الجهاز",
                "ملفات تعريف الارتباط: لتحسين تجربة المستخدم وتذكر التفضيلات"
            ]
        },
        {
            id: "data-usage",
            title: "كيف نستخدم بياناتك",
            icon: Settings,
            content: [
                "تقديم وتشغيل خدمات المنصة التعليمية بكفاءة",
                "إنشاء وإدارة حساباتكم على المنصة",
                "تتبع التقدم الأكاديمي وتوليد التقارير التعليمية",
                "تخصيص المحتوى والتجربة وفقاً لاحتياجاتكم",
                "إرسال الإشعارات المهمة والتحديثات حول الخدمة",
                "تحسين خدماتنا وتطوير ميزات جديدة",
                "ضمان الأمان ومنع الاستخدام غير المشروع للمنصة"
            ]
        },
        {
            id: "data-sharing",
            title: "مشاركة البيانات",
            icon: Users,
            content: [
                "لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة",
                "قد نشارك البيانات مع مقدمي الخدمات الموثوقين لتشغيل المنصة",
                "مشاركة محدودة مع المعلمين وأولياء الأمور لأغراض تعليمية",
                "الكشف عن المعلومات عند الطلب القانوني من السلطات المختصة",
                "مشاركة البيانات المجمعة وغير المحددة للهوية لأغراض إحصائية",
                "جميع مقدمي الخدمة ملزمون بالحفاظ على سرية معلوماتك"
            ]
        },
        {
            id: "data-security",
            title: "أمان البيانات",
            icon: Shield,
            content: [
                "تشفير جميع البيانات الحساسة أثناء النقل والتخزين",
                "استخدام بروتوكولات أمان متقدمة ومعايير صناعية عالية",
                "مراقبة أمنية مستمرة لاكتشاف ومنع التهديدات",
                "التحكم في الوصول القائم على الأدوار والصلاحيات",
                "نسخ احتياطية منتظمة وآمنة لحماية من فقدان البيانات",
                "فحص أمني دوري للنظام والبنية التحتية",
                "تدريب الموظفين على أفضل ممارسات الأمان والخصوصية"
            ]
        },
        {
            id: "user-rights",
            title: "حقوقك في البيانات",
            icon: CheckCircle,
            content: [
                "الحق في الوصول إلى بياناتك الشخصية المخزنة لدينا",
                "الحق في تصحيح أو تحديث معلوماتك الشخصية",
                "الحق في حذف بياناتك في ظروف معينة",
                "الحق في تقييد معالجة بياناتك",
                "الحق في نقل بياناتك إلى خدمة أخرى",
                "الحق في الاعتراض على معالجة بياناتك",
                "الحق في سحب الموافقة في أي وقت"
            ]
        },
        {
            id: "cookies",
            title: "ملفات تعريف الارتباط",
            icon: Globe,
            content: [
                "نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم",
                "ملفات ضرورية لتشغيل المنصة الأساسي (تسجيل الدخول، الأمان)",
                "ملفات تحليلية لفهم كيفية استخدام المنصة وتحسينها",
                "ملفات وظيفية لتذكر تفضيلاتك وإعداداتك",
                "يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك",
                "بعض ميزات المنصة قد لا تعمل بشكل صحيح بدون هذه الملفات"
            ]
        },
        {
            id: "data-retention",
            title: "الاحتفاظ بالبيانات",
            icon: Clock,
            content: [
                "نحتفظ بمعلوماتك طالما كان حسابك نشطاً وتستخدم خدماتنا",
                "بيانات الطلاب التعليمية قد نحتفظ بها لفترات أطول لأغراض أكاديمية",
                "بعد إغلاق الحساب، نحذف المعلومات الشخصية خلال 90 يوماً",
                "قد نحتفظ ببعض البيانات لفترة أطول للامتثال للمتطلبات القانونية",
                "البيانات المجمعة وغير المحددة للهوية قد نحتفظ بها بشكل دائم",
                "يمكنك طلب حذف بياناتك في أي وقت من خلال إعدادات الحساب"
            ]
        },
        {
            id: "international-transfers",
            title: "نقل البيانات الدولي",
            icon: Wifi,
            content: [
                "قد ننقل ونعالج بياناتك في دول أخرى لتقديم خدماتنا",
                "جميع عمليات النقل تتم وفقاً للمعايير الدولية لحماية البيانات",
                "نضمن مستوى حماية مناسب للبيانات في جميع الدول المستقبلة",
                "نستخدم آليات حماية قانونية معتمدة لنقل البيانات الآمن",
                "البيانات الحساسة تبقى مخزنة داخل المملكة العربية السعودية",
                "يحق لك معرفة مواقع معالجة بياناتك والاعتراض عليها"
            ]
        },
        {
            id: "minors-privacy",
            title: "خصوصية القُصَّر",
            icon: Users,
            content: [
                "نحمي خصوصية الأطفال دون سن 18 عاماً بعناية خاصة",
                "موافقة ولي الأمر مطلوبة لجمع معلومات الأطفال",
                "لا نجمع معلومات شخصية من الأطفال أكثر مما هو ضروري",
                "أولياء الأمور لهم الحق في مراجعة وحذف بيانات أطفالهم",
                "الوصول لبيانات الأطفال مقيد على المعلمين المعتمدين فقط",
                "نوفر أدوات للرقابة الأبوية وحماية الأطفال على الإنترنت"
            ]
        },
        {
            id: "updates",
            title: "التحديثات",
            icon: RefreshCw,
            content: [
                "قد نحدث سياسة الخصوصية هذه من وقت لآخر",
                "سنخطركم بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على المنصة",
                "نشجعكم على مراجعة هذه السياسة بانتظام",
                "التغييرات تصبح سارية المفعول فور نشرها على الموقع",
                "استمراركم في استخدام الخدمة يعني موافقتكم على السياسة المحدثة",
                "لديكم الحق في الاعتراض على التغييرات وإغلاق الحساب"
            ]
        }
    ];

    const dataProtectionPrinciples = [
        {
            icon: Lock,
            title: "الشفافية",
            description: "نكون واضحين ومفتوحين حول كيفية استخدام بياناتك"
        },
        {
            icon: Eye,
            title: "التحكم",
            description: "تتحكم في بياناتك ويمكنك الوصول إليها وتعديلها"
        },
        {
            icon: Shield,
            title: "الحماية",
            description: "نحمي بياناتك بأعلى معايير الأمان التقني"
        },
        {
            icon: CheckCircle,
            title: "الامتثال",
            description: "نلتزم بجميع القوانين واللوائح المحلية والدولية"
        },
        {
            icon: Users,
            title: "الاحترام",
            description: "نحترم خصوصيتك وحقوقك في البيانات الشخصية"
        },
        {
            icon: Globe,
            title: "المسؤولية",
            description: "نتحمل المسؤولية الكاملة عن حماية معلوماتك"
        }
    ];

    const contactInfo = [
        {
            icon: Mail,
            title: "البريد الإلكتروني",
            value: "privacy@tajwaqar.com",
            description: "للاستفسارات حول الخصوصية"
        },
        {
            icon: Phone,
            title: "الهاتف",
            value: "+966 11 234 5678",
            description: "خط مباشر لقسم حماية البيانات"
        },
        {
            icon: MapPin,
            title: "العنوان",
            value: "الرياض، المملكة العربية السعودية",
            description: "مكتب مسؤول حماية البيانات"
        }
    ];

    return (
        <SiteLayout title="سياسة الخصوصية">
            <Head title="سياسة الخصوصية - تاج الوقار" />

            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.2'%3E%3Cpath d='m0 40 40-40V0H0v40z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                            <Shield className="w-4 h-4 ml-1" />
                            حماية البيانات والخصوصية
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            سياسة الخصوصية
                        </h1>
                        <p className="text-xl text-blue-100 leading-relaxed">
                            نلتزم في تاج الوقار بحماية خصوصيتك وضمان أمان معلوماتك الشخصية. تعرف على كيفية جمع واستخدام وحماية بياناتك بأعلى معايير الأمان.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-white">
                                <p className="text-sm">
                                    آخر تحديث: ديسمبر 2024 | ساري المفعول من: 1 يناير 2024
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Protection Principles */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300">
                            <CheckCircle className="w-4 h-4 ml-1" />
                            مبادئنا في حماية البيانات
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            التزامنا بحماية خصوصيتك
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            نؤمن بحقك الأساسي في الخصوصية ونلتزم بأعلى معايير حماية البيانات الشخصية
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dataProtectionPrinciples.map((principle, index) => (
                            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 group">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <principle.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {principle.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {principle.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Privacy Policy Content */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Introduction Alert */}
                    <Card className="p-8 mb-12 border-t-4 border-t-blue-500">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                خصوصيتك أولويتنا
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                نحن نقدر ثقتك بنا ونتعامل مع معلوماتك الشخصية بأقصى درجات الحذر والمسؤولية. هذه السياسة توضح التزامنا الكامل بحماية خصوصيتك وضمان أمان بياناتك في جميع الأوقات.
                            </p>
                        </div>
                    </Card>

                    {/* Privacy Sections */}
                    <div className="space-y-8">
                        {privacySections.map((section, index) => (
                            <Card key={section.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <section.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {index + 1}. {section.title}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {section.content.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {item}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Your Rights Summary */}
                    <Card className="mt-12 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/10 dark:to-blue-900/10 border-t-4 border-t-emerald-500">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                كيفية ممارسة حقوقك
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                يمكنك ممارسة جميع حقوقك المتعلقة بالبيانات الشخصية من خلال إعدادات حسابك أو بالتواصل مع فريق حماية البيانات لدينا.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Settings className="w-4 h-4 text-emerald-600" />
                                    <span>إعدادات الحساب → إدارة البيانات</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Download className="w-4 h-4 text-emerald-600" />
                                    <span>تحميل نسخة من بياناتك</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Trash2 className="w-4 h-4 text-emerald-600" />
                                    <span>طلب حذف البيانات</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Mail className="w-4 h-4 text-emerald-600" />
                                    <span>تواصل مع فريق الحماية</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Contact Information */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {contactInfo.map((contact, index) => (
                            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <contact.icon className="w-6 h-6 text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {contact.title}
                                </h4>
                                <p className="text-gray-900 dark:text-white font-medium mb-1">
                                    {contact.value}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {contact.description}
                                </p>
                            </Card>
                        ))}
                    </div>

                    {/* Important Notice */}
                    <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                                    إشعار مهم
                                </h4>
                                <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                                    هذه سياسة الخصوصية سارية المفعول اعتباراً من التاريخ المذكور أعلاه. قد نقوم بتحديث هذه السياسة من وقت لآخر لتعكس التغييرات في ممارساتنا أو المتطلبات القانونية. سنخطركم بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار بارز على منصتنا.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}