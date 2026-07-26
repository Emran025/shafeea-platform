import { Head, useForm } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, AlertCircle, Wrench } from 'lucide-react';
import { useState } from 'react';

export default function Support() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        message_type: 'support', // Force type to support
        phone: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => {
                setIsSubmitted(true);
                reset();
            }
        });
    };

    if (isSubmitted) {
        return (
            <SiteLayout>
                <Head title="تم استلام طلب الدعم - شفيع" />
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Card className="p-8 max-w-md mx-auto text-center">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">تم تسجيل التذكرة بنجاح</h2>
                        <p className="text-gray-500 mb-6">رقم التذكرة: #TRK-{Math.floor(Math.random() * 10000)}</p>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            شكراً لك. سيقوم فريق الدعم الفني بمراجعة طلبك والرد عليك عبر البريد الإلكتروني في أقرب وقت.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} variant="outline">
                            فتح تذكرة جديدة
                        </Button>
                    </Card>
                </div>
            </SiteLayout>
        );
    }

    return (
        <SiteLayout>
            <Head title="الدعم الفني - شفيع" />

            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                            <Wrench className="w-4 h-4 ml-1" />
                            الدعم الفني
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">كيف يمكننا إصلاح مشكلتك؟</h1>
                        <p className="text-gray-500">
                            واجهت مشكلة تقنية؟ املأ النموذج أدناه لتزويدنا بالتفاصيل اللازمة لحلها.
                        </p>
                    </div>

                    <Card className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg flex gap-3 text-sm text-primary mb-6">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p>يرجى تقديم أكبر قدر ممكن من التفاصيل (لقطات الشاشة، رسائل الخطأ) لتسريع عملية الحل.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">الاسم</Label>
                                    <Input 
                                        id="name" 
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="اسمك الكريم"
                                        required
                                    />
                                    {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">البريد الإلكتروني</Label>
                                    <Input 
                                        id="email" 
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="للتواصل معك"
                                        required
                                    />
                                    {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">عنوان المشكلة</Label>
                                <Input 
                                    id="subject" 
                                    value={data.subject}
                                    onChange={e => setData('subject', e.target.value)}
                                    placeholder="وصف مختصر، مثلاً: لا يمكنني رفع الملفات"
                                    required
                                />
                                {errors.subject && <p className="text-destructive text-xs">{errors.subject}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">تفاصيل المشكلة</Label>
                                <Textarea 
                                    id="message" 
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    placeholder="اشرح المشكلة بالتفصيل... ماذا كنت تحاول أن تفعل؟ ماذا حدث؟"
                                    className="min-h-[150px]"
                                    required
                                />
                                {errors.message && <p className="text-destructive text-xs">{errors.message}</p>}
                            </div>

                             <Button 
                                type="submit" 
                                disabled={processing}
                                className="w-full"
                                size="lg"
                            >
                                {processing ? 'جاري الإرسال...' : 'إرسال طلب الدعم'}
                            </Button>
                        </form>
                    </Card>
                </div>
            </section>
        </SiteLayout>
    );
}
