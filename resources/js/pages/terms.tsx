import { Head, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    FileText,
    AlertCircle,
    Scale,
    Users,
    Clock,
    Mail,
    Phone as PhoneIcon,
    ArrowLeft
} from 'lucide-react';
import SiteLayout from '@/layouts/site-layout';
import { PageProps, TermsOfUse as TermsOfUseType } from '@/types';
import PolicyDisplay from '@/components/shared/policy-display';

interface TermsProps extends PageProps {
    terms: TermsOfUseType;
}

export default function Terms() {
    const { terms } = usePage<TermsProps>().props;

    return (
        <SiteLayout>
            <Head title="الشروط والأحكام - تاج الوقار" />

            {/* Hero Section */}
            <section className="relative py-20 gradient-hero overflow-hidden animate-fade-in-up">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-transparent dark:bg-black/40 transition-colors duration-300"></div>
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full opacity-20">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-6 shadow-xl hover-scale-sm transition-all duration-300">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex justify-center mb-4">
                            <Badge className="bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-md px-4 py-1 text-sm shadow-sm transition-all duration-300">
                                <Scale className="w-3.5 h-3.5 ml-2 text-yellow-300" />
                                الشروط والأحكام القانونية
                            </Badge>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-sm">
                            الشروط والأحكام
                        </h1>
                        
                        <p className="text-lg md:text-xl text-blue-50/90 max-w-3xl mx-auto leading-relaxed font-light">
                            يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام منصة تاج الوقار. استخدامك للمنصة يعني موافقتك على جميع الشروط المذكورة
                        </p>
                        
                        <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-5 py-1.5 text-sm shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-emerald-300" />
                            <span className="text-white/90">آخر تحديث: {new Date(terms.last_updated).toLocaleDateString('ar-SA')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="py-16 bg-background animate-fade-in-up">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Introduction Card */}
                    <Card className="p-10 mb-12 border border-border shadow-lg bg-card relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-blue-600"></div>
                        <div className="text-center relative z-10">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Scale className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                مرحباً بك في منصة شفيع القرانية
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                                نحن ملتزمون بتوفير خدمة تعليمية قرآنية متميزة وآمنة. هذه الشروط والأحكام تحدد إطار العلاقة وتضمن الحقوق.
                            </p>
                        </div>
                    </Card>

                    <PolicyDisplay policy={terms} type="terms" />

                    {/* Contact and Notice Section */}
                    <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Contact Card */}
                        <Card className="lg:col-span-2 p-8 border border-border bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">الدعم القانوني</h3>
                                        <p className="text-muted-foreground text-sm">فريقنا جاهز للرد على استفساراتكم</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Email Tile */}
                                    <a href="mailto:legal@shafeea.com" className="group/item relative flex items-center p-4 rounded-xl border border-border bg-card hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-0 ml-4 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-medium text-muted-foreground block mb-0.5">البريد الإلكتروني</span>
                                            <span className="text-sm font-bold text-foreground dir-ltr block group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">legal@shafeea.com</span>
                                        </div>
                                        <ArrowLeft className="w-4 h-4 text-muted-foreground absolute left-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                                    </a>

                                    {/* Phone Tile */}
                                    <a href="tel:+966112345678" className="group/item relative flex items-center p-4 rounded-xl border border-border bg-card hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-0 ml-4 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                            <PhoneIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-medium text-muted-foreground block mb-0.5">رقم الهاتف</span>
                                            <span className="text-sm font-bold text-foreground dir-ltr block group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">+966 11 234 5678</span>
                                        </div>
                                        <ArrowLeft className="w-4 h-4 text-muted-foreground absolute left-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                                    </a>
                                </div>
                            </div>
                        </Card>

                        {/* Notice Card */}
                        <Card className="lg:col-span-1 border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/10 p-0 overflow-hidden relative flex flex-col">
                            <div className="h-1.5 w-full bg-amber-500"></div>
                            
                            <div className="p-8 flex-1 flex flex-col justify-center relative">
                                <AlertCircle className="absolute -bottom-6 -left-6 w-32 h-32 text-amber-500/5 dark:text-amber-500/10 pointer-events-none" />
                                
                                <div className="flex items-start gap-3 mb-4">
                                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                                    <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100">تحديثات دورية</h4>
                                </div>
                                
                                <p className="text-sm text-amber-800/90 dark:text-amber-200/80 leading-relaxed mb-6">
                                    نحيطكم علماً بأن هذه الشروط قابلة للتحديث المستمر لضمان جودة الخدمة. استمرارك في الاستخدام يعني موافقتك الضمنية.
                                </p>

                                <div className="mt-auto">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800">
                                        <Clock className="w-3.5 h-3.5" />
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
