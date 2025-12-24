import { useForm, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2, ArrowRight } from 'lucide-react';
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">تعديل الخدمة</h1>
                    <Button variant="outline" asChild>
                        <Link href="/admin/services">
                            <ArrowRight className="w-4 h-4 ml-2" />
                            العودة للقائمة
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>المعلومات الأساسية</CardTitle>
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

                                    <div>
                                        <Label htmlFor="image">رابط الصورة أو رفع ملف</Label>
                                        <Input
                                            id="image"
                                            value={data.image}
                                            onChange={(e) => setData('image', e.target.value)}
                                            placeholder="/images/services/example.jpg"
                                        />
                                        {service.image && !data.image_file && (
                                            <img src={service.image} alt="service" className="mt-2 h-24 object-cover rounded" />
                                        )}
                                        <div className="mt-2">
                                            <input
                                                id="image_file"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('image_file', (e.target.files && e.target.files[0]) ? e.target.files[0] : null)}
                                            />
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
                            <Card>
                                <CardHeader>
                                    <CardTitle>المميزات</CardTitle>
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
                            <Card>
                                <CardHeader>
                                    <CardTitle>الفوائد</CardTitle>
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
                        <div className="space-y-6">
                            {/* Display Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>إعدادات العرض</CardTitle>
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

                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="popular">خدمة شائعة</Label>
                                        <Switch
                                            id="popular"
                                            checked={data.popular}
                                            onCheckedChange={(checked: boolean) => setData('popular', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="is_active">نشط</Label>
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-2">
                                        <Button 
                                            type="submit" 
                                            className="w-full"
                                            disabled={processing}
                                        >
                                            {processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            className="w-full"
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
