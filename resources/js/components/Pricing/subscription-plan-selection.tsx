import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle } from 'lucide-react';

interface SubscriptionPlan {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    period?: string;
    description?: string;
    features: string[];
    is_recommended: boolean;
}

interface SubscriptionPlanSelectionProps {
    subscriptionPlans: SubscriptionPlan[];
    onSelectSubscriptionPlan?: (subscriptionPlanId: number) => void;
    selectedSubscriptionPlanId?: number | null;
}

export default function SubscriptionPlanSelection({ subscriptionPlans, onSelectSubscriptionPlan, selectedSubscriptionPlanId }: SubscriptionPlanSelectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch pt-8 pb-12">
            {subscriptionPlans.map((subscriptionPlan: SubscriptionPlan) => (
                <div 
                    key={subscriptionPlan.id} 
                    className={`relative group transition-all duration-500 flex flex-col ${
                        subscriptionPlan.is_recommended ? 'z-20 -mt-6 mb-6 lg:-mt-10 lg:mb-4' : 'hover:-translate-y-3 z-10'
                    }`}
                >
                    {subscriptionPlan.is_recommended && (
                        <>
                            <div className="absolute -inset-[3px] bg-gradient-to-r from-primary via-blue-400 to-purple-500 rounded-[2rem] opacity-70 group-hover:opacity-100 blur-md transition duration-500 animate-pulse"></div>
                            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 z-30">
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl border border-white/20 whitespace-nowrap uppercase tracking-wider">
                                    <Star className="w-3.5 h-3.5 ml-1.5 fill-white animate-spin-slow" />
                                    الأكثر طلباً
                                </span>
                            </div>
                        </>
                    )}

                    <Card className={`flex flex-col h-full relative overflow-hidden transition-all duration-500 rounded-[1.75rem] border-0 shadow-2xl ${
                        selectedSubscriptionPlanId === subscriptionPlan.id 
                            ? 'ring-4 ring-primary/40 ring-offset-4 dark:ring-offset-gray-950' 
                            : ''
                    } ${
                        subscriptionPlan.is_recommended 
                            ? 'bg-gradient-to-b from-[#0d1b2a] to-black text-white' 
                            : 'bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-white/5'
                    }`}>
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                        <CardHeader className={`text-center pb-6 pt-10 relative ${subscriptionPlan.is_recommended ? 'border-b border-white/10' : 'border-b border-border/10'}`}>
                            <h3 className={`text-xl font-black mb-4 tracking-tight ${subscriptionPlan.is_recommended ? 'text-blue-400' : 'text-foreground'}`}>
                                {subscriptionPlan.name}
                            </h3>
                            <div className="flex items-baseline justify-center gap-1.5 mb-2">
                                <span className={`text-5xl font-black tracking-tighter ${subscriptionPlan.is_recommended ? 'text-white' : 'text-foreground'}`}>
                                    {subscriptionPlan.price}
                                </span>
                                <div className="flex flex-col items-start translate-y-[-4px]">
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-70">ريال</span>
                                    <span className="text-[10px] font-medium opacity-50">{subscriptionPlan.period || 'سنويًا'}</span>
                                </div>
                            </div>
                            <p className={`text-xs px-6 leading-relaxed ${subscriptionPlan.is_recommended ? 'text-blue-100/70' : 'text-muted-foreground'}`}>
                                {subscriptionPlan.description || (Number(subscriptionPlan.price) === 0 ? "ابدأ رحلة التميز مع الأساسيات" : "حلول متقدمة لنمو مؤسستكم التعليمية")}
                            </p>
                        </CardHeader>
                        
                        <CardContent className="flex-grow pt-8 pb-10 px-7">
                            <ul className="space-y-4 mb-10">
                                {subscriptionPlan.features.map((feature: string, featureIndex: number) => (
                                    <li key={featureIndex} className="flex items-start gap-3 text-[13px] group/item">
                                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110 ${
                                            subscriptionPlan.is_recommended 
                                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                                                : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400'
                                        }`}>
                                            <CheckCircle className="w-3.5 h-3.5" />
                                        </div>
                                        <span className={`leading-snug transition-colors ${
                                            subscriptionPlan.is_recommended ? 'text-gray-300 group-hover/item:text-white' : 'text-foreground/80 group-hover/item:text-foreground'
                                        }`}>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            <Button 
                                onClick={() => onSelectSubscriptionPlan?.(subscriptionPlan.id)}
                                variant={selectedSubscriptionPlanId === subscriptionPlan.id ? 'default' : 'outline'}
                                className={`w-full h-14 text-base font-bold rounded-2xl transition-all duration-300 shadow-lg ${
                                    subscriptionPlan.is_recommended
                                        ? selectedSubscriptionPlanId === subscriptionPlan.id
                                            ? 'bg-white text-black hover:bg-gray-100 scale-105'
                                            : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-[1.02] shadow-blue-900/50'
                                        : selectedSubscriptionPlanId === subscriptionPlan.id
                                            ? 'bg-primary text-white scale-105 shadow-primary/30'
                                            : 'border-primary/20 hover:border-primary hover:bg-primary/5 hover:scale-[1.02]'
                                }`}
                            >
                                {Number(subscriptionPlan.price) === 0 ? "ابدأ مجاناً" : "اشترك الآن"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
}
