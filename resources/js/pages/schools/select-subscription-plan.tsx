import { Head, router } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import SubscriptionPlanSelection from '@/components/Pricing/subscription-plan-selection';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ArrowRight, CreditCard, Landmark, AlertCircle, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface SubscriptionPlan {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    currency: string;
    billing_period: string;
    features: string[];
    is_recommended: boolean;
}

interface SelectSubscriptionPlanProps {
    subscriptionPlans: SubscriptionPlan[];
}

export default function SelectSubscriptionPlan({ subscriptionPlans }: SelectSubscriptionPlanProps) {
    const [selectedSubscriptionPlanId, setSelectedSubscriptionPlanId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'reference_number'>('online');
    const [processing, setProcessing] = useState(false);

    const handleSelectSubscriptionPlan = (subscriptionPlanId: number) => {
        setSelectedSubscriptionPlanId(subscriptionPlanId);
    };

    const handleContinue = () => {
        if (!selectedSubscriptionPlanId) return;
        
        setProcessing(true);
        router.post(route('register.checkout'), {
            subscription_plan_id: selectedSubscriptionPlanId,
            payment_method: paymentMethod
        }, {
            onFinish: () => setProcessing(false)
        });
    };

    const selectedPlan = subscriptionPlans.find(p => p.id === selectedSubscriptionPlanId);
    const isFreePlan = selectedPlan ? Number(selectedPlan.price) === 0 : false;

    return (
        <SiteLayout>
            <Head title="إتمام الاشتراك والدفع - شفيع" />

            {/* Premium Hero Section */}
            <section className="relative py-28 gradient-hero overflow-hidden shadow-2xl">
                {/* Animated Background Decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <Badge className="mb-8 bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md px-6 py-2 rounded-full shadow-lg inline-flex items-center gap-2 group transition-all duration-300">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 group-hover:scale-125 transition-transform" />
                        <span>الخطوة الأخيرة لبدء التميز</span>
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-xl">
                        اختر خطة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-emerald-200">النمو</span> المناسبة
                    </h1>
                    <p className="text-xl text-blue-50/80 max-w-2xl mx-auto font-light leading-relaxed">
                        انضم إلى مئات المنشآت التعليمية التي تطور أداءها يومياً باستخدام باقاتنا المرنة والمتكاملة
                    </p>
                </div>
            </section>

            <section className="py-20 bg-background relative -mt-16 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Label */}
                    <div className="flex justify-center mb-16">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-border dark:border-white/10 shadow-xl shadow-primary/5 text-primary font-black text-sm backdrop-blur-md">
                            <TrendingUp className="w-5 h-5" />
                            <span>باقاتنا المميزة</span>
                        </div>
                    </div>

                    <SubscriptionPlanSelection 
                        subscriptionPlans={subscriptionPlans} 
                        onSelectSubscriptionPlan={handleSelectSubscriptionPlan} 
                        selectedSubscriptionPlanId={selectedSubscriptionPlanId}
                    />

                    {selectedSubscriptionPlanId && (
                        <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-fade-in-up">
                            {/* Payment Method Selection */}
                            <div className="lg:col-span-7 space-y-10">
                                {!isFreePlan && (
                                    <>
                                        <div className="relative">
                                            <h3 className="text-3xl font-black text-foreground mb-4">طريقة الدفع</h3>
                                            <p className="text-muted-foreground text-lg italic opacity-80">اختر الوسيلة التي تناسبك لإتمام الاشتراك</p>
                                            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary rounded-full hidden md:block"></div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {/* Online Payment Card */}
                                            <Card
                                                onClick={() => setPaymentMethod('online')}
                                                className={`group relative p-8 rounded-[2rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden ${
                                                    paymentMethod === 'online' 
                                                        ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' 
                                                        : 'border-border bg-card/60 hover:border-primary/50 backdrop-blur-sm'
                                                }`}
                                            >
                                                {/* Selected Indicator Background */}
                                                <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent transition-opacity duration-500 ${paymentMethod === 'online' ? 'opacity-100' : 'opacity-0'}`}></div>
                                                
                                                <div className="relative z-10 flex flex-col items-center text-center">
                                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                                                        paymentMethod === 'online' ? 'bg-primary text-white scale-110 rotate-3 shadow-lg shadow-primary/40' : 'bg-muted text-muted-foreground group-hover:scale-105'
                                                    }`}>
                                                        <CreditCard className="w-8 h-8" />
                                                    </div>
                                                    <span className="font-black text-xl mb-2">دفع إلكتروني</span>
                                                    <span className="text-sm text-muted-foreground leading-relaxed">
                                                        مدى، فيزا، ماستركارد، أبل باي <br />
                                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">(تفعيل فوري وآمن)</span>
                                                    </span>
                                                </div>

                                                {paymentMethod === 'online' && (
                                                    <div className="absolute top-5 left-5 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg animate-bounce-subtle">
                                                        <Check className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </Card>

                                            {/* Bank Transfer Card */}
                                            <Card
                                                onClick={() => setPaymentMethod('reference_number')}
                                                className={`group relative p-8 rounded-[2rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden ${
                                                    paymentMethod === 'reference_number' 
                                                        ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' 
                                                        : 'border-border bg-card/60 hover:border-primary/50 backdrop-blur-sm'
                                                }`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent transition-opacity duration-500 ${paymentMethod === 'reference_number' ? 'opacity-100' : 'opacity-0'}`}></div>

                                                <div className="relative z-10 flex flex-col items-center text-center">
                                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                                                        paymentMethod === 'reference_number' ? 'bg-primary text-white scale-110 -rotate-3 shadow-lg shadow-primary/40' : 'bg-muted text-muted-foreground group-hover:scale-105'
                                                    }`}>
                                                        <Landmark className="w-8 h-8" />
                                                    </div>
                                                    <span className="font-black text-xl mb-2">تحويل بنكي</span>
                                                    <span className="text-sm text-muted-foreground leading-relaxed">
                                                        التحويل المباشر لحسابنا <br />
                                                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">(يتطلب تأكيداً يدوياً)</span>
                                                    </span>
                                                </div>

                                                {paymentMethod === 'reference_number' && (
                                                    <div className="absolute top-5 left-5 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg animate-bounce-subtle">
                                                        <Check className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </Card>
                                        </div>

                                        {paymentMethod === 'reference_number' && (
                                            <Card className="p-6 border-0 bg-amber-50 dark:bg-amber-900/10 rounded-3xl flex items-start gap-5 shadow-inner">
                                                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">ملاحظة هامة</h4>
                                                    <p className="text-sm text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                                                        سيتم تزويدك برقم مرجعي وبيانات الحساب البنكي فور الضغط على زر الإتمام. يرجى إرسال إشعار التحويل لتفعيل حسابك في أسرع وقت.
                                                    </p>
                                                </div>
                                            </Card>
                                        )}
                                    </>
                                )}

                                {isFreePlan && (
                                    <Card className="p-10 border-0 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2.5rem] flex flex-col items-center text-center gap-6 shadow-xl shadow-emerald-500/5">
                                        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
                                            <Badge className="bg-emerald-500 text-white p-4 rounded-full shadow-lg">
                                                <Check className="w-10 h-10" />
                                            </Badge>
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-emerald-900 dark:text-emerald-100 mb-2">خطة مجانية بالكامل</h3>
                                            <p className="text-emerald-800/70 dark:text-emerald-300/70 text-lg">لا يتطلب إتمام التسجيل أي بيانات دفع حالياً. استمتع بتجربة "شفيع" فوراً!</p>
                                        </div>
                                    </Card>
                                )}
                            </div>

                            {/* Summary & Checkout Button */}
                            <div className="lg:col-span-5 relative">
                                <Card className="sticky top-10 p-10 rounded-[2.5rem] bg-gradient-to-br from-[#0d1b2a] to-black text-white shadow-2xl shadow-primary/20 border-0 overflow-hidden group">
                                    {/* Shimmer line */}
                                    <div className="absolute top-0 -left-full w-2/3 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-[1500ms]"></div>
                                    
                                    <div className="relative z-10 flex flex-col h-full">
                                        <h3 className="text-2xl font-black mb-8 pb-4 border-b border-white/10 flex items-center gap-3">
                                            <ArrowRight className="w-6 h-6 text-blue-400 rotate-180" />
                                            ملخص الطلب
                                        </h3>

                                        <div className="space-y-6 mb-10">
                                            <div className="flex justify-between items-center">
                                                <span className="text-blue-100/60 font-medium">الباقة المختارة:</span>
                                                <span className="font-black text-xl text-blue-400 uppercase tracking-tight">{selectedPlan?.name}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-blue-100/60 font-medium">طريقة الدفع:</span>
                                                <span className="font-bold">{isFreePlan ? 'مجانية' : (paymentMethod === 'online' ? 'دفع إلكتروني' : 'تحويل بنكي')}</span>
                                            </div>
                                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                                <span className="text-blue-100/60 font-black text-lg">الإجمالي المستحق:</span>
                                                <div className="text-right">
                                                    <span className="text-4xl font-black text-white block leading-none">{selectedPlan?.price}</span>
                                                    <span className="text-xs font-bold text-blue-400 uppercase mt-1 inline-block">ريال / {selectedPlan?.billing_period === 'yearly' ? 'سنة' : 'شهر'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button 
                                            size="lg"
                                            className={`h-16 px-10 rounded-2xl text-xl font-black transition-all duration-500 shadow-2xl group hover:scale-[1.03] active:scale-95 disabled:opacity-50 ${
                                                isFreePlan ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-primary hover:bg-primary/90 text-white shadow-primary/40'
                                            }`}
                                            disabled={processing}
                                            onClick={handleContinue}
                                        >
                                            {processing ? (
                                                <span className="flex items-center gap-3">
                                                    <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                                                    جاري المعالجة...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-3">
                                                    {isFreePlan ? 'إتمام التسجيل المجاني' : 'تأكيد ودفع الآن'}
                                                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-[-10px] rtl:rotate-180" />
                                                </span>
                                            )}
                                        </Button>

                                        <p className="mt-8 text-center text-[10px] text-white/30 font-medium leading-relaxed">
                                            بإتمامك لهذه الخطوة، أنت تقر بالموافقة على <a href="/terms" className="text-blue-400 hover:underline">اتفاقية الخدمة</a> و <a href="/privacy" className="text-blue-400 hover:underline">سياسة الخصوصية</a> لمنصة شفيع التعليمية.
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </SiteLayout>
    );
}
