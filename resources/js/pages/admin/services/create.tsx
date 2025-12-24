import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, ArrowRight, Upload, Sparkles, Settings, FileText, Image as ImageIcon, Save } from 'lucide-react';

export default function CreateService() {
    interface ServiceForm {
        category: string;
        title: string;
        description: string;
        icon: string;
        image: string;
        image_file: File | null;
        features: string[];
        benefits: string[];
        popular: boolean;
        theme: string;
        display_order: number;
        is_active: boolean;
    }

    const { data, setData, post, processing, errors } = useForm<ServiceForm>({
        category: '',
        title: '',
        description: '',
        icon: 'Users',
        image: '',
        image_file: null,
        features: [''],
        benefits: [''],
        popular: false,
        theme: 'blue',
        display_order: 0,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/services');
    };

    const addFeature = () => {
        setData('features', [...data.features, '']);
    };

    const removeFeature = (index: number) => {
        setData('features', data.features.filter((_, i) => i !== index));
    };

    const updateFeature = (index: number, value: string) => {
        const updated = [...data.features];
        updated[index] = value;
        setData('features', updated);
    };

    const addBenefit = () => {
        setData('benefits', [...data.benefits, '']);
    };

    const removeBenefit = (index: number) => {
        setData('benefits', data.benefits.filter((_, i) => i !== index));
    };

    const updateBenefit = (index: number, value: string) => {
        const updated = [...data.benefits];
        updated[index] = value;
        setData('benefits', updated);
    };

    const iconOptions = [
        'Users', 'BookOpen', 'BarChart3', 'Shield', 'Calendar', 
        'MessageCircle', 'Globe', 'Star', 'Target', 'Zap', 'Sparkles'
    ];

    const themeOptions = [
        { value: 'blue', label: 'أزرق', color: 'bg-blue-500' },
        { value: 'indigo', label: 'نيلي', color: 'bg-indigo-500' },
        { value: 'emerald', label: 'زمردي', color: 'bg-emerald-500' },
        { value: 'rose', label: 'وردي', color: 'bg-rose-500' },
        { value: 'amber', label: 'كهرماني', color: 'bg-amber-500' },
        { value: 'violet', label: 'بنفسجي', color: 'bg-violet-500' },
        { value: 'cyan', label: 'سماوي', color: 'bg-cyan-500' },
        { value: 'orange', label: 'برتقالي', color: 'bg-orange-500' },
    ];

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">إضافة خدمة جديدة</h1>
                        <p className="text-sm text-muted-foreground">
                            قم بإنشاء خدمة جديدة وإضافتها إلى المنصة
                        </p>
                    </div>
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/admin/services">
                            <ArrowRight className="w-4 h-4" />
                            العودة للقائمة
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card className="border-2 border-border/50 shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">المعلومات الأساسية</CardTitle>
                                            <CardDescription>المعلومات الأساسية للخدمة</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-sm font-semibold">
                                            الفئة <span className="text-red-500">*</span>
                                        </Label>
                                        <Select 
                                            value={data.category} 
                                            onValueChange={(value) => setData('category', value)}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="اختر الفئة" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="management">إدارة الحلقات</SelectItem>
                                                <SelectItem value="education">التعليم والمنهجية</SelectItem>
                                                <SelectItem value="analytics">التقارير والإحصائيات</SelectItem>
                                                <SelectItem value="communication">التواصل</SelectItem>
                                                <SelectItem value="technology">التقنية والأمان</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-sm font-semibold">
                                            العنوان <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="عنوان الخدمة"
                                            className="h-11"
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-semibold">
                                            الوصف <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="وصف تفصيلي للخدمة"
                                            rows={5}
                                            className="resize-none"
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="image" className="text-sm font-semibold">
                                            الصورة
                                        </Label>
                                        <div className="space-y-3">
                                            <Input
                                                id="image"
                                                value={data.image}
                                                onChange={(e) => setData('image', e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                                className="h-11"
                                            />
                                            <div className="relative">
                                                <input
                                                    id="image_file"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setData('image_file', (e.target.files && e.target.files[0]) ? e.target.files[0] : null)}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="image_file"
                                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all group"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-10 h-10 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        <p className="mb-2 text-sm text-foreground">
                                                            <span className="font-semibold">اضغط للرفع</span> أو اسحب الملف هنا
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF حتى 5 ميجابايت</p>
                                                    </div>
                                                </label>
                                            </div>
                                            {data.image_file && (
                                                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                                    <ImageIcon className="w-5 h-5 text-primary" />
                                                    <span className="text-sm font-medium flex-1">{data.image_file.name}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setData('image_file', null)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        {errors.image && (
                                            <p className="text-sm text-red-500 mt-1">{errors.image}</p>
                                        )}
                                        {errors.image_file && (
                                            <p className="text-sm text-red-500 mt-1">{errors.image_file}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Features */}
                            <Card className="border-2 border-border/50 shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">المميزات</CardTitle>
                                            <CardDescription>قائمة بمميزات الخدمة</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {data.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <Input
                                                    value={feature}
                                                    onChange={(e) => updateFeature(index, e.target.value)}
                                                    placeholder={`ميزة ${index + 1}`}
                                                    className="h-11"
                                                />
                                            </div>
                                            {data.features.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFeature(index)}
                                                    className="h-11 w-11 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addFeature}
                                        className="w-full gap-2 h-11 border-dashed"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        إضافة ميزة جديدة
                                    </Button>
                                    {errors.features && (
                                        <p className="text-sm text-red-500">{errors.features}</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Benefits */}
                            <Card className="border-2 border-border/50 shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">الفوائد</CardTitle>
                                            <CardDescription>قائمة بفوائد الخدمة</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {data.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <Input
                                                    value={benefit}
                                                    onChange={(e) => updateBenefit(index, e.target.value)}
                                                    placeholder={`فائدة ${index + 1}`}
                                                    className="h-11"
                                                />
                                            </div>
                                            {data.benefits.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeBenefit(index)}
                                                    className="h-11 w-11 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addBenefit}
                                        className="w-full gap-2 h-11 border-dashed"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        إضافة فائدة جديدة
                                    </Button>
                                    {errors.benefits && (
                                        <p className="text-sm text-red-500">{errors.benefits}</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Display Settings */}
                            <Card className="border-2 border-border/50 shadow-lg sticky top-6">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                            <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">إعدادات العرض</CardTitle>
                                            <CardDescription>تخصيص طريقة عرض الخدمة</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="icon" className="text-sm font-semibold">
                                            الأيقونة <span className="text-red-500">*</span>
                                        </Label>
                                        <Select 
                                            value={data.icon} 
                                            onValueChange={(value) => setData('icon', value)}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {iconOptions.map((icon) => (
                                                    <SelectItem key={icon} value={icon}>
                                                        {icon}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.icon && (
                                            <p className="text-sm text-red-500 mt-1">{errors.icon}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="theme" className="text-sm font-semibold">
                                            اللون/السمة <span className="text-red-500">*</span>
                                        </Label>
                                        <Select 
                                            value={data.theme} 
                                            onValueChange={(value) => setData('theme', value)}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {themeOptions.map((theme) => (
                                                    <SelectItem key={theme.value} value={theme.value}>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-4 h-4 rounded-full ${theme.color}`} />
                                                            {theme.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.theme && (
                                            <p className="text-sm text-red-500 mt-1">{errors.theme}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="display_order" className="text-sm font-semibold">
                                            ترتيب العرض
                                        </Label>
                                        <Input
                                            id="display_order"
                                            type="number"
                                            min="0"
                                            value={data.display_order}
                                            onChange={(e) => setData('display_order', parseInt(e.target.value) || 0)}
                                            className="h-11"
                                        />
                                        {errors.display_order && (
                                            <p className="text-sm text-red-500 mt-1">{errors.display_order}</p>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="popular" className="text-sm font-semibold cursor-pointer">
                                                خدمة شائعة
                                            </Label>
                                            <p className="text-xs text-muted-foreground">إظهار الخدمة كخدمة مميزة</p>
                                        </div>
                                        <Switch
                                            id="popular"
                                            checked={data.popular}
                                            onCheckedChange={(checked: boolean) => setData('popular', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="is_active" className="text-sm font-semibold cursor-pointer">
                                                تفعيل الخدمة
                                            </Label>
                                            <p className="text-xs text-muted-foreground">إظهار الخدمة في المنصة</p>
                                        </div>
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card className="border-2 border-border/50 shadow-lg sticky bottom-6 z-20">
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
                                                    حفظ الخدمة
                                                </>
                                            )}
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            className="w-full h-11"
                                            asChild
                                        >
                                            <Link href="/admin/services">إلغاء</Link>
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
