import { useForm, Link, usePage } from '@inertiajs/react';
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
import { PageProps } from '@/types';

interface Service {
    id: number;
    category: string;
    title: string;
    description: string;
    icon: string;
    image: string | null;
    features: string[];
    benefits: string[];
    popular: boolean;
    theme: string;
    display_order: number;
    is_active: boolean;
}

interface EditServiceProps extends PageProps {
    service: Service;
}

export default function EditService() {
    const { service } = usePage<EditServiceProps>().props;
    
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

    const { data, setData, put, processing, errors } = useForm<ServiceForm>({
        category: service.category || '',
        title: service.title || '',
        description: service.description || '',
        icon: service.icon || 'Users',
        image: service.image || '',
        image_file: null,
        features: service.features && service.features.length > 0 ? service.features : [''],
        benefits: service.benefits && service.benefits.length > 0 ? service.benefits : [''],
        popular: service.popular || false,
        theme: service.theme || 'blue',
        display_order: service.display_order || 0,
        is_active: service.is_active !== undefined ? service.is_active : true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/services/${service.id}`);
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
        'MessageCircle', 'Globe', 'Star', 'Target', 'Zap'
    ];

    const themeOptions = [
        { value: 'blue', label: 'أزرق' },
        { value: 'indigo', label: 'نيلي' },
        { value: 'emerald', label: 'زمردي' },
        { value: 'rose', label: 'وردي' },
        { value: 'amber', label: 'كهرماني' },
        { value: 'violet', label: 'بنفسجي' },
        { value: 'cyan', label: 'سماوي' },
        { value: 'orange', label: 'برتقالي' },
    ];

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">تعديل الخدمة</h1>
                        <p className="text-sm text-muted-foreground">
                            تعديل معلومات الخدمة: {service.title}
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
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="category">الفئة *</Label>
                                        <Select 
                                            value={data.category} 
                                            onValueChange={(value) => setData('category', value)}
                                        >
                                            <SelectTrigger>
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

                                    <div>
                                        <Label htmlFor="title">العنوان *</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="عنوان الخدمة"
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">الوصف *</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="وصف الخدمة"
                                            rows={4}
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
                                            {service.image && !data.image_file && (
                                                <div className="relative group">
                                                    <img 
                                                        src={service.image} 
                                                        alt="service" 
                                                        className="w-full h-48 object-cover rounded-xl border-2 border-border" 
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                                        <span className="text-white text-sm font-medium">الصورة الحالية</span>
                                                    </div>
                                                </div>
                                            )}
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
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={feature}
                                                onChange={(e) => updateFeature(index, e.target.value)}
                                                placeholder="ميزة جديدة"
                                            />
                                            {data.features.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeFeature(index)}
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
                                    >
                                        <PlusCircle className="w-4 h-4 ml-2" />
                                        إضافة ميزة
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
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={benefit}
                                                onChange={(e) => updateBenefit(index, e.target.value)}
                                                placeholder="فائدة جديدة"
                                            />
                                            {data.benefits.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeBenefit(index)}
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
                                    >
                                        <PlusCircle className="w-4 h-4 ml-2" />
                                        إضافة فائدة
                                    </Button>
                                    {errors.benefits && (
                                        <p className="text-sm text-red-500">{errors.benefits}</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6 sticky top-6 h-fit">
                            {/* Display Settings */}
                            <Card className="border-2 border-border/50 shadow-lg">
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
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="icon">الأيقونة *</Label>
                                        <Select 
                                            value={data.icon} 
                                            onValueChange={(value) => setData('icon', value)}
                                        >
                                            <SelectTrigger>
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

                                    <div>
                                        <Label htmlFor="theme">اللون/السمة *</Label>
                                        <Select 
                                            value={data.theme} 
                                            onValueChange={(value) => setData('theme', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {themeOptions.map((theme) => (
                                                    <SelectItem key={theme.value} value={theme.value}>
                                                        {theme.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.theme && (
                                            <p className="text-sm text-red-500 mt-1">{errors.theme}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="display_order">ترتيب العرض</Label>
                                        <Input
                                            id="display_order"
                                            type="number"
                                            min="0"
                                            value={data.display_order}
                                            onChange={(e) => setData('display_order', parseInt(e.target.value) || 0)}
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
