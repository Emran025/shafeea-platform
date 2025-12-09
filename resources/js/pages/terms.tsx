import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Shield,
    FileText,
    CheckCircle,
    AlertCircle,
    Scale,
    Book,
    Users,
    Clock
} from 'lucide-react';
import SiteLayout from '@/layouts/site-layout';

export default function Terms() {
    const sections = [
        {
            id: "definitions",
            title: "التعريفات",
            icon: Book,
            content: [
                "المنصة: تعني منصة تاج الوقار الإلكترونية المخصصة لإدارة الحلقاتالقرآنية",
                "المستخدم: أي شخص يستخدم المنصة سواء كان معلماً أو طالباً أو إدارياً",
                "الخدمات: جميع الميزات والوظائف المتاحة عبر المنصة",
                "المحتوى: جميع النصوص والمواد التعليمية والبيانات المتاحة على المنصة",
                "الحساب: الملف الشخصي للمستخدم على المنصة",
                "المؤسسة: الجهة التعليمية التي تستخدم المنصة لإدارة أنشطتها"
            ]
        },
        {
            id: "acceptance",
            title: "قبول الشروط",
            icon: CheckCircle,
            content: [
                "باستخدام هذه المنصة، فإنك توافق على جميع الشروط والأحكام المذكورة",
                "إذا كنت لا توافق على أي من هذه الشروط، يجب عليك عدم استخدام المنصة",
                "نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق",
                "استمرارك في استخدام المنصة بعد التعديل يعني موافقتك على الشروط الجديدة",
                "من المسؤولية الشخصية للمستخدم مراجعة هذه الصفحة بشكل دوري"
            ]
        },
        {
            id: "user-responsibilities",
            title: "مسؤوليات المستخدم",
            icon: Users,
            content: [
                "تقديم معلومات صحيحة ودقيقة عند التسجيل في المنصة",
                "المحافظة على سرية بيانات الحساب وعدم مشاركتها مع الآخرين",
                "استخدام المنصة للأغراض التعليمية القرآنية المشروعة فقط",
                "عدم رفع أو مشاركة محتوى مخالف للشريعة الإسلامية أو القوانين",
                "احترام حقوق المستخدمين الآخرين وعدم إزعاجهم أو التدخل في أنشطتهم",
                "الإبلاغ عن أي مشاكل تقنية أو انتهاكات تلاحظها في المنصة",
                "تحديث المعلومات الشخصية بانتظام للحفاظ على دقة البيانات"
            ]
        },
        {
            id: "platform-services",
            title: "خدمات المنصة",
            icon: Shield,
            content: [
                "توفير منصة آمنة وموثوقة لإدارة الحلقاتالقرآنية",
                "أدوات متقدمة لتتبع حفظ ومراجعة القرآن الكريم",
                "نظام تقارير شامل لمتابعة تقدم الطلاب",
                "أدوات التواصل بين المعلمين والطلاب وأولياء الأمور",
                "حفظ آمن للبيانات مع نسخ احتياطية منتظمة",
                "دعم فني متخصص في أوقات العمل الرسمية",
                "تحديثات دورية لتحسين الأداء وإضافة ميزات جديدة"
            ]
        },
        {
            id: "intellectual-property",
            title: "الملكية الفكرية",
            icon: Scale,
            content: [
                "جميع حقوق الملكية الفكرية للمنصة محفوظة لشركة تاج الوقار",
                "لا يحق للمستخدمين نسخ أو توزيع أو تعديل أي جزء من المنصة",
                "المحتوى القرآني مأخوذ من مصادر معتمدة ويخضع لحقوق النشر الخاصة بها",
                "يحتفظ المستخدمون بحقوق ملكية البيانات التي يدخلونها في المنصة",
                "نحترم حقوق الملكية الفكرية للآخرين ونتوقع من المستخدمين فعل الشيء نفسه",
                "في حالة انتهاك حقوق الملكية الفكرية، نحتفظ بالحق في اتخاذ الإجراءات المناسبة"
            ]
        },
        {
            id: "privacy-data",
            title: "الخصوصية والبيانات",
            icon: Shield,
            content: [
                "نلتزم بحماية خصوصية جميع المستخدمين وأمان بياناتهم",
                "لن نشارك المعلومات الشخصية مع أطراف ثالثة بدون موافقة صريحة",
                "نستخدم أحدث تقنيات التشفير لحماية البيانات أثناء النقل والتخزين",
                "المستخدمون لهم الحق في الوصول إلى بياناتهم وتعديلها أو حذفها",
                "نحتفظ بالبيانات للمدة اللازمة لتقديم الخدمات أو حسب متطلبات القانون",
                "نلتزم بإشعار المستخدمين في حالة حدوث أي خرق أمني يؤثر على بياناتهم"
            ]
        },
        {
            id: "limitations",
            title: "قيود الاستخدام",
            icon: AlertCircle,
            content: [
                "يُمنع استخدام المنصة لأي أغراض غير قانونية أو مخالفة للآداب",
                "عدم محاولة اختراق المنصة أو الوصول غير المصرح به للبيانات",
                "يُمنع رفع أو مشاركة محتوى ضار أو فيروسات أو برامج خبيثة",
                "عدم استخدام المنصة لإرسال رسائل دعائية أو مزعجة",
                "يُمنع انتحال شخصية الآخرين أو تقديم معلومات مضللة",
                "عدم التدخل في عمل المنصة أو محاولة تعطيل خدماتها",
                "الالتزام بحدود الاستخدام المحددة في خطة الاشتراك"
            ]
        },
        {
            id: "termination",
            title: "إنهاء الخدمة",
            icon: Clock,
            content: [
                "يحق لنا إنهاء أو تعليق الحساب في حالة انتهاك هذه الشروط",
                "يمكن للمستخدم إلغاء حسابه في أي وقت من خلال إعدادات الحساب",
                "عند إنهاء الحساب، قد نحتفظ ببعض البيانات لفترة محددة لأغراض قانونية",
                "لا نتحمل مسؤولية فقدان البيانات بعد إنهاء الحساب",
                "الرسوم المدفوعة غير قابلة للاسترداد إلا في حالات استثنائية",
                "نحتفظ بالحق في إنهاء الخدمة كلياً مع إشعار مسبق مناسب"
            ]
        },
        {
            id: "disclaimers",
            title: "إخلاء المسؤولية",
            icon: AlertCircle,
            content: [
                "المنصة متاحة 'كما هي' دون ضمانات صريحة أو ضمنية",
                "لا نضمن عدم انقطاع الخدمة أو خلوها من الأخطاء التقنية",
                "لا نتحمل مسؤولية الأضرار الناتجة عن استخدام أو عدم القدرة على استخدام المنصة",
                "المستخدم مسؤول عن اتخاذ احتياطات الأمان المناسبة لحماية بياناته",
                "لا نتحمل مسؤولية المحتوى الذي ينشره المستخدمون",
                "في حالة حدوث أضرار، تقتصر مسؤوليتنا على قيمة الرسوم المدفوعة للخدمة"
            ]
        },
        {
            id: "governing-law",
            title: "القانون الحاكم",
            icon: Scale,
            content: [
                "تخضع هذه الشروط للقوانين المعمول بها في المملكة العربية السعودية",
                "أي نزاع ينشأ عن هذه الشروط يحل وفقاً للأنظمة السعودية",
                "تطبق أحكام الشريعة الإسلامية في جميع المعاملات والنزاعات",
                "المحاكم المختصة في الرياض لها الولاية القضائية في حل النزاعات",
                "نسعى لحل النزاعات بالطرق الودية قبل اللجوء للقضاء",
                "هذه الاتفاقية تشكل الاتفاق الكامل بين الطرفين"
            ]
        }
    ];

    return (
        <SiteLayout>
            <Head title="الشروط والأحكام - تاج الوقار" />

            {/* Hero Section */}
            <section className="relative py-28 bg-gradient-primary overflow-hidden animate-fade-in-up">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-0 left-0 w-full h-full opacity-20">
                        <div className="absolute top-20 left-20 w-36 h-36 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-44 h-44 bg-white/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-8 hover-scale-sm transition-all duration-300">
                            <FileText className="w-10 h-10 text-white" />
                        </div>
                        <Badge className="mb-8 bg-white/20 text-white border-white/30 hover:bg-white/30 glass-card hover-lift transition-all duration-300 text-sm px-6 py-3">
                            <Scale className="w-4 h-4 ml-1" />
                            الشروط والأحكام القانونية
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                            الشروط والأحكام
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-10 max-w-4xl mx-auto">
                            يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام منصة تاج الوقار. استخدامك للمنصة يعني موافقتك على جميع الشروط المذكورة
                        </p>
                        <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-4">
                            <Clock className="w-5 h-5 text-white" />
                            <span className="text-white font-medium">آخر تحديث: ديسمبر 2024</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 animate-fade-in-up">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Introduction */}
                    <Card className="p-10 mb-16 border-0 shadow-2xl bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 glass-card hover-lift transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-primary"></div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 hover-scale-sm transition-all duration-300 shadow-lg">
                                <Scale className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                مرحباً بك في منصة تاج الوقار
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
                                نحن ملتزمون بتوفير خدمة تعليمية قرآنية متميزة وآمنة. هذه الشروط والأحكام تحدد إطار العلاقة بيننا وبين مستخدمي منصتنا، وتضمن حقوق جميع الأطراف وتوضح المسؤوليات المتبادلة.
                            </p>
                        </div>
                    </Card>

                    {/* Terms Sections */}
                    <div className="space-y-8">
                        {sections.map((section, index) => (
                            <Card key={section.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover-lift glass-card-subtle animate-fade-in-up border-0 bg-white dark:bg-gray-800 relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="p-8">
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                            <section.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-lg text-sm font-bold">
                                                    {index + 1}
                                                </span>
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                                                    {section.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 pl-20">
                                        {section.content.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 hover:from-primary/5 hover:to-accent/5 transition-all duration-300">
                                                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                                                    {item}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Contact Information */}
                    <Card className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/10 dark:to-emerald-900/10 border-t-4 border-t-accent glass-card hover-lift transition-all duration-300">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale-sm transition-all duration-300">
                                <Users className="w-8 h-8 text-accent" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                تواصل معنا
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                إذا كان لديك أي استفسارات حول هذه الشروط والأحكام أو تحتاج إلى مساعدة في فهم أي جزء منها، لا تتردد في التواصل معنا.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <span>البريد الإلكتروني:</span>
                                    <span className="font-medium text-primary">legal@shafeea.com</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <span>الهاتف:</span>
                                    <span className="font-medium text-primary">+966 11 234 5678</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Important Notice */}
                    <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                                    ملاحظة مهمة
                                </h4>
                                <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                                    هذه الشروط والأحكام قابلة للتعديل والتحديث دون إشعار مسبق. ننصح بمراجعة هذه الصفحة بشكل دوري للاطلاع على آخر التحديثات. استمرارك في استخدام المنصة بعد أي تعديل يعني موافقتك على الشروط المحدثة.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}