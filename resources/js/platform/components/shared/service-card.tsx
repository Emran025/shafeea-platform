import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle, PlayCircle, LucideIcon } from 'lucide-react';

// تعريف شكل البيانات التي يحتاجها المكون
export interface ServiceData {
    category: string;
    title: string;
    description: string;
    icon: LucideIcon;
    features: string[];
    benefits: string[];
    image: string;
    popular?: boolean;
    theme: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'violet' | 'cyan' | 'orange';
}

interface ServiceCardProps {
    service: ServiceData;
    index: number;
}

// دالة مساعدة لتحديد الألوان (تم نقلها هنا لتكون جزءاً من المكون)
interface ThemeStyles {
    bg: string;
    text: string;
    shadow: string;
    border: string;
    gradient: string;
}

const getThemeStyles = (theme: string): ThemeStyles => {
    const styles: Record<string, ThemeStyles> = {
        blue: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", shadow: "shadow-blue-500/20", border: "border-blue-100 dark:border-blue-800", gradient: "from-blue-500/20" },
        indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-600 dark:text-indigo-400", shadow: "shadow-indigo-500/20", border: "border-indigo-100 dark:border-indigo-800", gradient: "from-indigo-500/20" },
        emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", shadow: "shadow-emerald-500/20", border: "border-emerald-100 dark:border-emerald-800", gradient: "from-emerald-500/20" },
        rose: { bg: "bg-rose-50 dark:bg-rose-900/20", text: "text-rose-600 dark:text-rose-400", shadow: "shadow-rose-500/20", border: "border-rose-100 dark:border-rose-800", gradient: "from-rose-500/20" },
        amber: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400", shadow: "shadow-amber-500/20", border: "border-amber-100 dark:border-amber-800", gradient: "from-amber-500/20" },
        violet: { bg: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-600 dark:text-violet-400", shadow: "shadow-violet-500/20", border: "border-violet-100 dark:border-violet-800", gradient: "from-violet-500/20" },
        cyan: { bg: "bg-cyan-50 dark:bg-cyan-900/20", text: "text-cyan-600 dark:text-cyan-400", shadow: "shadow-cyan-500/20", border: "border-cyan-100 dark:border-cyan-800", gradient: "from-cyan-500/20" },
        orange: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400", shadow: "shadow-orange-500/20", border: "border-orange-100 dark:border-orange-800", gradient: "from-orange-500/20" }
    };
    return styles[theme] || styles.blue;
};

export default function ServiceCard({ service, index }: ServiceCardProps) {
    const themeStyle = getThemeStyles(service.theme);
    const isReversed = index % 2 === 1;

    return (
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border bg-card p-0 gap-0">
            <div className={`grid grid-cols-1 lg:grid-cols-2 h-full ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
                
                {/* --- قسم المحتوى --- */}
                <div className={`p-8 flex flex-col justify-center ${isReversed ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                        {service.popular && (
                            <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Star className="w-3 h-3 ml-1" />
                                الأكثر طلباً
                            </Badge>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center border shadow-lg ${themeStyle.bg} ${themeStyle.border} ${themeStyle.shadow}`}>
                            <service.icon className={`w-7 h-7 ${themeStyle.text}`} />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                            {service.title}
                        </h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        {service.description}
                    </p>

                    <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <div className={`w-1 h-5 rounded-full ${themeStyle.bg.replace('/20', '')}`}></div>
                            المميزات الرئيسية:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {service.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-center gap-2">
                                    <CheckCircle className={`w-4 h-4 ${themeStyle.text} flex-shrink-0`} />
                                    <span className="text-sm text-muted-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-3">الفوائد:</h4>
                        <div className="flex flex-wrap gap-2">
                            {service.benefits.map((benefit, benefitIndex) => (
                                <Badge key={benefitIndex} variant="outline" className="text-xs border-border text-muted-foreground bg-muted/20">
                                    {benefit}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto mt-auto">
                        <PlayCircle className="w-4 h-4 ml-2" />
                        تجربة مجانية
                    </Button>
                </div>

                {/* --- قسم الصورة --- */}
                <div className={`relative h-full min-h-[300px] lg:min-h-full ${isReversed ? 'lg:col-start-1' : ''}`}>
                    <div className="absolute inset-0 w-full h-full group">
                        <img 
                            src={service.image} 
                            alt={service.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[0.1] hover:grayscale-0"
                            loading="lazy"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${themeStyle.gradient || 'from-black/20'} via-transparent to-transparent opacity-60 pointer-events-none`}></div>
                    </div>
                </div>
            </div>
        </Card>
    );
}