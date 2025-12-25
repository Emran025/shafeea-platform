import { Head, Link } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, FileText, MessageCircle, Shield, Phone } from 'lucide-react';

export default function HelpCenter() {
    const popularTopics = [
        { title: 'بدء الاستخدام', icon: Sparkles, count: 12 },
        { title: 'الحساب والملف الشخصي', icon: User, count: 8 },
        { title: 'الاشتراكات والدفع', icon: CreditCard, count: 15 },
        { title: 'المناهج الدراسية', icon: BookOpen, count: 20 },
    ];

    return (
        <SiteLayout>
            <Head title="مركز المساعدة - شفيع" />

            {/* Hero Section */}
            <section className="relative py-24 gradient-primary overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.2'%3E%3Cpath d='m0 40 40-40V0H0v40z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                        <Shield className="w-4 h-4 ml-1" />
                        مركز المساعدة
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        كيف يمكننا مساعدتك اليوم؟
                    </h1>
                    <div className="relative max-w-2xl mx-auto">
                        <input 
                            type="text" 
                            placeholder="ابحث عن إجابة لمشكلتك..." 
                            className="w-full h-14 pr-12 pl-4 rounded-xl shadow-lg border-0 focus:ring-2 focus:ring-blue-300 transition-all text-lg"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900/50 -mt-16 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group text-center border-t-4 border-t-emerald-500">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">الأسئلة الشائعة</h3>
                            <p className="text-gray-500 mb-4">تصفح إجابات لأكثر الأسئلة تداولاً</p>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/faq">تصفح الأسئلة</Link>
                            </Button>
                        </Card>
                        
                        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group text-center border-t-4 border-t-blue-500">
                             <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">تواصل معنا</h3>
                            <p className="text-gray-500 mb-4">أرسل استفسارك وسنرد عليك قريباً</p>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/contact">راسلنا الآن</Link>
                            </Button>
                        </Card>

                        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group text-center border-t-4 border-t-purple-500">
                             <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Phone className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">الدعم الفني</h3>
                            <p className="text-gray-500 mb-4">هل تواجه مشكلة تقنية؟ نحن هنا</p>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/support">طلب دعم</Link>
                            </Button>
                        </Card>
                    </div>
                </div>
            </section>

             {/* Help Categories */}
             <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">تصفح حسب الموضوع</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Static categories for now, usually dynamic */}
                        {popularTopics.map((topic, i) => (
                             <Card key={i} className="p-4 hover:border-blue-500 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                        <topic.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{topic.title}</h4>
                                        <p className="text-xs text-gray-500">{topic.count} مقال</p>
                                    </div>
                                </div>
                             </Card>
                        ))}
                    </div>
                </div>
             </section>
        </SiteLayout>
    );
}

import { Sparkles, User, CreditCard, BookOpen } from 'lucide-react';
