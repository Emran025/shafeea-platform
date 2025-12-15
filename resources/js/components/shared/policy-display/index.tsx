import { Card } from '@/components/ui/card';
import {
    Shield,
    FileText,
    CheckCircle,
    Users,
    Database,
    Globe,
    Clock,
    Settings,
    RefreshCw,
    Wifi,
    Scale,
    Book,
    Gavel,
    AlertCircle,
    Mail,
    Info 
} from 'lucide-react';
import { PrivacyPolicy as PrivacyPolicyType, TermsOfUse as TermsOfUseType } from '@/types';

interface Section {
    title: string;
    content: string[];
}

interface PolicyDisplayProps {
    policy: PrivacyPolicyType | TermsOfUseType;
    type: 'privacy' | 'terms';
}

export default function PolicyDisplay({ policy, type }: PolicyDisplayProps) {
    const sections: Section[] = JSON.parse(policy.sections_json);
    
    const summary: string[] = policy.summary_json ? JSON.parse(policy.summary_json) : [];

    const getIcon = (title: string) => {
        if (type === 'privacy') {
            switch (title) {
                case 'مقدمة': return FileText;
                case 'المعلومات التي نجمعها': return Database;
                case 'كيفية استخدامنا لمعلوماتك': return Settings;
                case 'مشاركة البيانات': return Users;
                case 'أمن البيانات': return Shield;
                case 'حقوق المستخدم': return CheckCircle;
                case 'ملفات تعريف الارتباط': return Globe;
                case 'الاحتفاظ بالبيانات': return Clock;
                case 'نقل البيانات الدولي': return Wifi;
                case 'خصوصية الأطفال': return Users;
                case 'التغييرات على سياسة الخصوصية': return RefreshCw;
                default: return FileText;
            }
        } else {
            switch (title) {
                case 'قبول الشروط': return CheckCircle;
                case 'حسابات المستخدمين': return Users;
                case 'استخدام الخدمات': return Shield;
                case 'محتوى المستخدم': return Book;
                case 'قواعد السلوك': return Gavel;
                case 'حقوق الملكية الفكرية': return Scale;
                case 'إنهاء الخدمة': return Clock;
                case 'إخلاء المسؤولية عن الضمانات': return AlertCircle;
                case 'تحديد المسؤولية': return AlertCircle;
                case 'التعديلات على الشروط': return FileText;
                case 'القانون الحاكم': return Gavel;
                case 'الاتصال بنا': return Mail;
                default: return FileText;
            }
        }
    };

    const renderSummary = () => {
        if (summary.length === 0) return null;

        return (
            <Card className="overflow-hidden shadow-md border-primary/20 bg-primary/5 mb-8">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Info className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            ملخص {type === 'privacy' ? 'سياسة الخصوصية' : 'شروط الاستخدام'}
                        </h3>
                    </div>
                    <div className="space-y-2">
                        {summary.map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0"></div>
                                <p className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        );
    };

    if (type === 'privacy') {
        return (
            <div className="space-y-8">
                {renderSummary()}
                {sections.map((section, index) => {
                    const Icon = getIcon(section.title);
                    return (
                        <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-white" />
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
                    );
                })}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* عرض الملخص أولاً */}
            {renderSummary()}

            {sections.map((section, index) => {
                const Icon = getIcon(section.title);
                return (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-border bg-card group">
                        <div className="p-6">
                            <div className="flex items-start gap-5 mb-4 border-b border-border/50 pb-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                                    <Icon className={`w-6 h-6`} />
                                </div>

                                <div className="flex-1 pt-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-muted text-muted-foreground rounded-md text-xs font-bold border border-border">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                                            {section.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pl-0 md:pl-16">
                                {section.content.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0`}></div>
                                        <p className="text-muted-foreground leading-snug text-sm">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}