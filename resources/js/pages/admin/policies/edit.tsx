import { useForm, usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PageProps, TermsOfUse, PrivacyPolicy } from '@/types';
import { PlusCircle, Trash2, ArrowRight, Save, FileText, Shield, GripVertical } from 'lucide-react';

interface EditPolicyProps extends PageProps {
    policy: PrivacyPolicy | TermsOfUse;
    type: 'policy' | 'term';
}

interface Section {
    title: string;
    content: string[];
}

export default function EditPolicy() {
    const { policy, type } = usePage<EditPolicyProps>().props;
    const { data, setData, post, processing } = useForm({
        sections: JSON.parse(policy.sections_json) as Section[],
    });

    const handleSectionChange = (index: number, field: 'title' | 'content', value: string | string[]) => {
        const updatedSections = [...data.sections];
        updatedSections[index] = { ...updatedSections[index], [field]: value };
        setData('sections', updatedSections);
    };

    const handleContentChange = (sectionIndex: number, contentIndex: number, value: string) => {
        const updatedSections = [...data.sections];
        updatedSections[sectionIndex].content[contentIndex] = value;
        handleSectionChange(sectionIndex, 'content', updatedSections[sectionIndex].content);
    };

    const addSection = () => {
        setData('sections', [...data.sections, { title: '', content: [''] }]);
    };

    const removeSection = (index: number) => {
        if (data.sections.length > 1) {
            const updatedSections = data.sections.filter((_, i) => i !== index);
            setData('sections', updatedSections);
        }
    };

    const addContent = (sectionIndex: number) => {
        const updatedSections = [...data.sections];
        updatedSections[sectionIndex].content.push('');
        handleSectionChange(sectionIndex, 'content', updatedSections[sectionIndex].content);
    };

    const removeContent = (sectionIndex: number, contentIndex: number) => {
        const updatedSections = [...data.sections];
        if (updatedSections[sectionIndex].content.length > 1) {
            updatedSections[sectionIndex].content = updatedSections[sectionIndex].content.filter((_, i) => i !== contentIndex);
            handleSectionChange(sectionIndex, 'content', updatedSections[sectionIndex].content);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/policies/update/${type}/${policy.version}`);
    };

    const policyTypeLabel = type === 'policy' ? 'سياسة الخصوصية' : 'شروط الاستخدام';
    const PolicyTypeIcon = type === 'policy' ? Shield : FileText;

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            تعديل {policyTypeLabel}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            الإصدار {policy.version} - {policy.is_active ? (
                                <Badge className="bg-emerald-500 text-white">نشط</Badge>
                            ) : (
                                <Badge variant="secondary">غير نشط</Badge>
                            )}
                        </p>
                    </div>
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/admin/policies">
                            <ArrowRight className="w-4 h-4" />
                            العودة للقائمة
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Info Card */}
                    <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                                    <PolicyTypeIcon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                                        ملاحظة مهمة
                                    </p>
                                    <p className="text-xs text-amber-800 dark:text-amber-300">
                                        عند حفظ التغييرات، سيتم إنشاء إصدار جديد تلقائياً وسيتم تعطيل الإصدار الحالي. 
                                        هذا يضمن الحفاظ على تاريخ جميع الإصدارات.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sections */}
                    <div className="space-y-6">
                        {data.sections.map((section, sectionIndex) => (
                            <Card 
                                key={sectionIndex} 
                                className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <GripVertical className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">القسم {sectionIndex + 1}</CardTitle>
                                            <CardDescription>عنوان ومحتوى القسم</CardDescription>
                                        </div>
                                        {data.sections.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeSection(sectionIndex)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 h-9 w-9 p-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`section-title-${sectionIndex}`} className="text-sm font-semibold">
                                            عنوان القسم <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id={`section-title-${sectionIndex}`}
                                            type="text"
                                            value={section.title}
                                            onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                                            placeholder="عنوان القسم..."
                                            className="h-11 text-lg font-semibold"
                                        />
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold">محتوى القسم</Label>
                                        {section.content.map((item, contentIndex) => (
                                            <div key={contentIndex} className="flex items-start gap-3">
                                                <div className="flex-1">
                                                    <Textarea
                                                        value={item}
                                                        onChange={(e) => handleContentChange(sectionIndex, contentIndex, e.target.value)}
                                                        placeholder="اكتب محتوى الفقرة هنا..."
                                                        rows={4}
                                                        className="resize-none"
                                                    />
                                                </div>
                                                {section.content.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeContent(sectionIndex, contentIndex)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 h-11 w-11 p-0 mt-0.5"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addContent(sectionIndex)}
                                            className="w-full gap-2 border-dashed"
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                            إضافة فقرة جديدة
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Button
                            type="button"
                            onClick={addSection}
                            variant="outline"
                            className="w-full h-12 gap-2 border-dashed border-2"
                        >
                            <PlusCircle className="w-5 h-5" />
                            إضافة قسم جديد
                        </Button>
                    </div>

                    {/* Actions */}
                    <Card className="border-2 border-border/50 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-foreground">
                                        سيتم إنشاء إصدار جديد
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        الإصدار الحالي ({policy.version}) سيتم تعطيله تلقائياً
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="h-11"
                                        asChild
                                    >
                                        <Link href="/admin/policies">إلغاء</Link>
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="h-11 gap-2 shadow-lg hover:shadow-xl"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                جاري الحفظ...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                حفظ وإنشاء إصدار جديد
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
