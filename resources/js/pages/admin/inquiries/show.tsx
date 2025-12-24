import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PageProps, Inquiry } from '@/types';
import { ArrowRight, Save, HelpCircle, FileText, Eye, Sparkles } from 'lucide-react';

interface InquiryShowProps extends PageProps {
    inquiry: Inquiry & { is_active?: boolean; display_order?: number };
}

interface FormData {
    question: string;
    answer: string;
    is_active: boolean;
    display_order: number;
}

export default function InquiryShow() {
    const { inquiry } = usePage<InquiryShowProps>().props;
    const { data, setData, put, processing, errors } = useForm<FormData>({
        question: inquiry.question || '',
        answer: inquiry.answer || '',
        is_active: inquiry.is_active ?? true,
        display_order: inquiry.display_order || 0,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/inquiries/${inquiry.id}`);
    }

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">تعديل الاستفسار</h1>
                        <p className="text-sm text-muted-foreground">
                            تعديل معلومات الاستفسار والإجابة
                        </p>
                    </div>
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/admin/inquiries">
                            <ArrowRight className="w-4 h-4" />
                            العودة للقائمة
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Question & Answer */}
                            <Card className="border-2 border-border/50 shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">السؤال والإجابة</CardTitle>
                                            <CardDescription>معلومات الاستفسار الأساسية</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="question" className="text-sm font-semibold">
                                            السؤال <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="question"
                                            type="text"
                                            value={data.question}
                                            onChange={(e) => setData('question', e.target.value)}
                                            placeholder="اكتب السؤال هنا..."
                                            className="h-11"
                                        />
                                        {errors.question && (
                                            <p className="text-sm text-red-500 mt-1">{errors.question}</p>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label htmlFor="answer" className="text-sm font-semibold">
                                            الإجابة
                                        </Label>
                                        <Textarea
                                            id="answer"
                                            value={data.answer}
                                            onChange={(e) => setData('answer', e.target.value)}
                                            rows={8}
                                            placeholder="اكتب الإجابة هنا..."
                                            className="resize-none"
                                        />
                                        {errors.answer && (
                                            <p className="text-sm text-red-500 mt-1">{errors.answer}</p>
                                        )}
                                        {!data.answer && (
                                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                ⚠️ يجب إضافة إجابة لنشر الاستفسار في الأسئلة الشائعة
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Preview */}
                            {(data.question || data.answer) && (
                                <Card className="border-2 border-border/50 shadow-lg bg-muted/20">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                                <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">معاينة</CardTitle>
                                                <CardDescription>كيف سيظهر الاستفسار للمستخدمين</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-semibold text-muted-foreground mb-2 block">السؤال:</Label>
                                            <p className="text-lg font-bold text-foreground p-3 bg-background rounded-lg border border-border">
                                                {data.question || 'السؤال سيظهر هنا...'}
                                            </p>
                                        </div>
                                        {data.answer && (
                                            <div>
                                                <Label className="text-sm font-semibold text-muted-foreground mb-2 block">الإجابة:</Label>
                                                <p className="text-foreground p-3 bg-background rounded-lg border border-border whitespace-pre-wrap">
                                                    {data.answer}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Settings */}
                            <Card className="border-2 border-border/50 shadow-lg sticky top-6">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">الإعدادات</CardTitle>
                                            <CardDescription>تخصيص حالة الاستفسار</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="is_active" className="text-sm font-semibold cursor-pointer">
                                                تفعيل الاستفسار
                                            </Label>
                                            <p className="text-xs text-muted-foreground">إظهار الاستفسار في القائمة</p>
                                        </div>
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="display_order" className="text-sm font-semibold cursor-pointer">
                                                نشر في الأسئلة الشائعة
                                            </Label>
                                            <p className="text-xs text-muted-foreground">إظهار الاستفسار في صفحة الأسئلة الشائعة</p>
                                        </div>
                                        <Switch
                                            id="display_order"
                                            checked={data.display_order === 1}
                                            onCheckedChange={(checked: boolean) => setData('display_order', checked ? 1 : 0)}
                                        />
                                    </div>

                                    {data.display_order === 1 && !data.answer && (
                                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                            <p className="text-xs text-amber-800 dark:text-amber-300">
                                                ⚠️ يجب إضافة إجابة لنشر الاستفسار
                                            </p>
                                        </div>
                                    )}

                                    {data.display_order === 1 && data.answer && (
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                                                    الاستفسار جاهز للنشر
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Status Info */}
                            <Card className="border-2 border-border/50 shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900/30 rounded-xl flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">الحالة الحالية</CardTitle>
                                            <CardDescription>معلومات الاستفسار</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">الحالة:</span>
                                        <Badge variant={data.is_active ? "default" : "secondary"} className={data.is_active ? "bg-emerald-500" : ""}>
                                            {data.is_active ? 'نشط' : 'غير نشط'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">النشر:</span>
                                        <Badge variant={data.display_order === 1 ? "default" : "secondary"} className={data.display_order === 1 ? "bg-blue-500" : ""}>
                                            {data.display_order === 1 ? 'منشور' : 'غير منشور'}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card className="border-2 border-border/50 shadow-lg">
                                <CardContent className="pt-6">
                                    <div className="space-y-3">
                                        <Button 
                                            type="submit" 
                                            className="w-full h-12 gap-2 shadow-lg hover:shadow-xl"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    جاري الحفظ...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    حفظ التغييرات
                                                </>
                                            )}
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            className="w-full h-11"
                                            asChild
                                        >
                                            <Link href="/admin/inquiries">إلغاء</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
