import PolicyDisplay from '../components/shared/policy-display';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import SiteLayout from '../layouts/site-layout';
import { PageProps, PrivacyPolicy as PrivacyPolicyType } from '../types';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Download, Eye, Globe, Lock, Mail, MapPin, Phone, Settings, Shield, Trash2, Users } from 'lucide-react';

interface PrivacyProps extends PageProps {
    privacyPolicy: PrivacyPolicyType;
}

export default function Privacy() {
    const { privacyPolicy } = usePage<PrivacyProps>().props;

    const dataProtectionPrinciples = [
        {
            icon: Lock,
            title: 'الشفافية',
            description: 'نكون واضحين ومفتوحين حول كيفية استخدام بياناتك',
        },
        {
            icon: Eye,
            title: 'التحكم',
            description: 'تتحكم في بياناتك ويمكنك الوصول إليها وتعديلها',
        },
        {
            icon: Shield,
            title: 'الحماية',
            description: 'نحمي بياناتك بأعلى معايير الأمان التقني',
        },
        {
            icon: CheckCircle,
            title: 'الامتثال',
            description: 'نلتزم بجميع القوانين واللوائح المحلية والدولية',
        },
        {
            icon: Users,
            title: 'الاحترام',
            description: 'نحترم خصوصيتك وحقوقك في البيانات الشخصية',
        },
        {
            icon: Globe,
            title: 'المسؤولية',
            description: 'نتحمل المسؤولية الكاملة عن حماية معلوماتك',
        },
    ];

    const contactInfo = [
        {
            icon: Mail,
            title: 'البريد الإلكتروني',
            value: 'privacy@shafeea.systems360.cloud',
            description: 'للاستفسارات حول الخصوصية',
        },
        {
            icon: Phone,
            title: 'الهاتف',
            value: '+966 11 234 5678',
            description: 'خط مباشر لقسم حماية البيانات',
        },
        {
            icon: MapPin,
            title: 'العنوان',
            value: 'الرياض، المملكة العربية السعودية',
            description: 'مكتب مسؤول حماية البيانات',
        },
    ];

    return (
        <SiteLayout>
            <Head title="سياسة الخصوصية - شفيع" />

            {/* Hero Section */}
            <section className="gradient-primary relative overflow-hidden py-20">
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute top-0 left-0 h-full w-full"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.2'%3E%3Cpath d='m0 40 40-40V0H0v40z'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    ></div>
                </div>

                <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Badge className="mb-6 border-white/30 bg-white/20 text-white hover:bg-white/30">
                            <Shield className="ml-1 h-4 w-4" />
                            حماية البيانات والخصوصية
                        </Badge>
                        <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">سياسة الخصوصية</h1>
                        <p className="text-xl leading-relaxed text-blue-100">
                            نلتزم في شفيع بحماية خصوصيتك وضمان أمان معلوماتك الشخصية. تعرف على كيفية جمع واستخدام وحماية بياناتك بأعلى معايير الأمان.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <div className="rounded-lg bg-white/10 p-4 text-white backdrop-blur-lg">
                                <p className="text-sm">
                                    آخر تحديث: {new Date(privacyPolicy.last_updated).toLocaleDateString('ar-SA')} | ساري المفعول من:{' '}
                                    {new Date(privacyPolicy.last_updated).toLocaleDateString('ar-SA')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Protection Principles */}
            <section className="bg-white py-16 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <Badge className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300">
                            <CheckCircle className="ml-1 h-4 w-4" />
                            مبادئنا في حماية البيانات
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">التزامنا بحماية خصوصيتك</h2>
                        <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
                            نؤمن بحقك الأساسي في الخصوصية ونلتزم بأعلى معايير حماية البيانات الشخصية
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {dataProtectionPrinciples.map((principle, index) => (
                            <Card key={index} className="group p-6 transition-all duration-300 hover:shadow-lg">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-100 to-emerald-100 transition-transform duration-300 group-hover:scale-110 dark:from-blue-900/20 dark:to-emerald-900/20">
                                    <principle.icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{principle.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{principle.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Privacy Policy Content */}
            <section className="bg-gray-50 py-16 dark:bg-gray-800">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Introduction Alert */}
                    <Card className="mb-12 border-t-4 border-t-blue-500 p-8">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                <Lock className="h-8 w-8 text-blue-600" />
                            </div>
                            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">خصوصيتك أولويتنا</h2>
                            <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                                نحن نقدر ثقتك بنا ونتعامل مع معلوماتك الشخصية بأقصى درجات الحذر والمسؤولية. هذه السياسة توضح التزامنا الكامل بحماية
                                خصوصيتك وضمان أمان بياناتك في جميع الأوقات.
                            </p>
                        </div>
                    </Card>

                    <PolicyDisplay policy={privacyPolicy} type="privacy" />

                    {/* Your Rights Summary */}
                    <Card className="mt-12 border-t-4 border-t-emerald-500 bg-gradient-to-r from-emerald-50 to-blue-50 p-8 dark:from-emerald-900/10 dark:to-blue-900/10">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                                <CheckCircle className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">كيفية ممارسة حقوقك</h3>
                            <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
                                يمكنك ممارسة جميع حقوقك المتعلقة بالبيانات الشخصية من خلال إعدادات حسابك أو بالتواصل مع فريق حماية البيانات لدينا.
                            </p>
                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Settings className="h-4 w-4 text-emerald-600" />
                                    <span>إعدادات الحساب → إدارة البيانات</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Download className="h-4 w-4 text-emerald-600" />
                                    <span>تحميل نسخة من بياناتك</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Trash2 className="h-4 w-4 text-emerald-600" />
                                    <span>طلب حذف البيانات</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Mail className="h-4 w-4 text-emerald-600" />
                                    <span>تواصل مع فريق الحماية</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Contact Information */}
                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {contactInfo.map((contact, index) => (
                            <Card key={index} className="p-6 text-center transition-shadow duration-300 hover:shadow-lg">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                    <contact.icon className="h-6 w-6 text-purple-600" />
                                </div>
                                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">{contact.title}</h4>
                                <p className="mb-1 font-medium text-gray-900 dark:text-white">{contact.value}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{contact.description}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Important Notice */}
                    <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/10">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-600" />
                            <div>
                                <h4 className="mb-2 font-semibold text-amber-800 dark:text-amber-200">إشعار مهم</h4>
                                <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-300">
                                    هذه سياسة الخصوصية سارية المفعول اعتباراً من التاريخ المذكور أعلاه. قد نقوم بتحديث هذه السياسة من وقت لآخر لتعكس
                                    التغييرات في ممارساتنا أو المتطلبات القانونية. سنخطركم بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار
                                    بارز على منصتنا.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
