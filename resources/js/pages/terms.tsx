import PolicyDisplay from '@/components/shared/policy-display';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import SiteLayout from '@/layouts/site-layout';
import { PageProps, TermsOfUse as TermsOfUseType } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Clock, FileText, Mail, Phone as PhoneIcon, Scale, Users } from 'lucide-react';

interface TermsProps extends PageProps {
    terms: TermsOfUseType;
}

export default function Terms() {
    const { terms } = usePage<TermsProps>().props;

    return (
        <SiteLayout>
            <Head title="الشروط والأحكام - شفيع" />

            {/* Hero Section */}
            <section className="gradient-hero animate-fade-in-up relative overflow-hidden py-20">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-transparent transition-colors duration-300 dark:bg-black/40"></div>
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                        <div className="absolute top-0 left-0 h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    </div>
                    <div className="absolute top-0 left-0 h-full w-full opacity-20">
                        <div className="absolute top-10 left-10 h-32 w-32 animate-pulse rounded-full bg-white/20 blur-3xl"></div>
                        <div className="absolute right-10 bottom-10 h-40 w-40 animate-pulse rounded-full bg-white/15 blur-3xl delay-1000"></div>
                    </div>
                </div>

                <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="hover-scale-sm mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md transition-all duration-300">
                            <FileText className="h-8 w-8 text-white" />
                        </div>

                        <div className="mb-4 flex justify-center">
                            <Badge className="border border-white/20 bg-white/10 px-4 py-1 text-sm text-white shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white/20">
                                <Scale className="ml-2 h-3.5 w-3.5 text-yellow-300" />
                                الشروط والأحكام القانونية
                            </Badge>
                        </div>

                        <h1 className="mb-4 text-4xl leading-tight font-bold tracking-tight text-white drop-shadow-sm md:text-5xl">
                            الشروط والأحكام
                        </h1>

                        <p className="mx-auto max-w-3xl text-lg leading-relaxed font-light text-blue-50/90 md:text-xl">
                            يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام منصة شفيع. استخدامك للمنصة يعني موافقتك على جميع الشروط المذكورة
                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-1.5 text-sm shadow-sm backdrop-blur-md">
                            <Clock className="h-3.5 w-3.5 text-emerald-300" />
                            <span className="text-white/90">آخر تحديث: {new Date(terms.last_updated).toLocaleDateString('ar-SA')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="animate-fade-in-up bg-background py-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Introduction Card */}
                    <Card className="group relative mb-12 overflow-hidden border border-border bg-card p-10 shadow-lg">
                        <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-primary to-blue-600"></div>
                        <div className="relative z-10 text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                                <Scale className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="mb-4 text-3xl font-bold text-foreground">مرحباً بك في منصة شفيع القرانية</h2>
                            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
                                نحن ملتزمون بتوفير خدمة تعليمية قرآنية متميزة وآمنة. هذه الشروط والأحكام تحدد إطار العلاقة وتضمن الحقوق.
                            </p>
                        </div>
                    </Card>

                    <PolicyDisplay policy={terms} type="terms" />

                    {/* Contact and Notice Section */}
                    <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Contact Card */}
                        <Card className="group relative overflow-hidden border border-border bg-gradient-to-br from-white to-gray-50 p-8 lg:col-span-2 dark:from-gray-900 dark:to-black">
                            <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"></div>

                            <div className="relative z-10">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">الدعم القانوني</h3>
                                        <p className="text-sm text-muted-foreground">فريقنا جاهز للرد على استفساراتكم</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Email Tile */}
                                    <a
                                        href="mailto:legal@shafeea.com"
                                        className="group/item relative flex items-center rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5"
                                    >
                                        <div className="mr-0 ml-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover/item:bg-blue-600 group-hover/item:text-white dark:bg-blue-900/20 dark:text-blue-400">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="mb-0.5 block text-xs font-medium text-muted-foreground">البريد الإلكتروني</span>
                                            <span className="dir-ltr block text-sm font-bold text-foreground transition-colors group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400">
                                                legal@shafeea.com
                                            </span>
                                        </div>
                                        <ArrowLeft className="absolute left-4 h-4 w-4 -translate-x-2 text-muted-foreground opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                                    </a>

                                    {/* Phone Tile */}
                                    <a
                                        href="tel:+966112345678"
                                        className="group/item relative flex items-center rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5"
                                    >
                                        <div className="mr-0 ml-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover/item:bg-emerald-600 group-hover/item:text-white dark:bg-emerald-900/20 dark:text-emerald-400">
                                            <PhoneIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="mb-0.5 block text-xs font-medium text-muted-foreground">رقم الهاتف</span>
                                            <span className="dir-ltr block text-sm font-bold text-foreground transition-colors group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400">
                                                +966 11 234 5678
                                            </span>
                                        </div>
                                        <ArrowLeft className="absolute left-4 h-4 w-4 -translate-x-2 text-muted-foreground opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                                    </a>
                                </div>
                            </div>
                        </Card>

                        {/* Notice Card */}
                        <Card className="relative flex flex-col overflow-hidden border border-amber-200 bg-amber-50/50 p-0 lg:col-span-1 dark:border-amber-900/50 dark:bg-amber-950/10">
                            <div className="h-1.5 w-full bg-amber-500"></div>

                            <div className="relative flex flex-1 flex-col justify-center p-8">
                                <AlertCircle className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 text-amber-500/5 dark:text-amber-500/10" />

                                <div className="mb-4 flex items-start gap-3">
                                    <AlertCircle className="h-6 w-6 flex-shrink-0 text-amber-600 dark:text-amber-500" />
                                    <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100">تحديثات دورية</h4>
                                </div>

                                <p className="mb-6 text-sm leading-relaxed text-amber-800/90 dark:text-amber-200/80">
                                    نحيطكم علماً بأن هذه الشروط قابلة للتحديث المستمر لضمان جودة الخدمة. استمرارك في الاستخدام يعني موافقتك الضمنية.
                                </p>

                                <div className="mt-auto">
                                    <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>ساري المفعول</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
