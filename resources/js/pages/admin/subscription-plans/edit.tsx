import { useForm, usePage, Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { PageProps } from '@/types';
import { ArrowRight, Save, Plus, Trash2 } from 'lucide-react';

interface SubscriptionPlan {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    currency: string;
    billing_period: string;
    features: string[];
    is_recommended: boolean;
    sort_order: number;
    is_active: boolean;
}

interface PlanEditProps extends PageProps {
    subscriptionPlans: SubscriptionPlan;
}

export default function PlanEdit() {
    const { subscriptionPlans } = usePage<PlanEditProps>().props;
    
    const { data, setData, put, processing, errors } = useForm({
        name: subscriptionPlans.name,
        price: subscriptionPlans.price,
        is_active: subscriptionPlans.is_active,
        features: subscriptionPlans.features,
        is_recommended: subscriptionPlans.is_recommended,
        sort_order: subscriptionPlans.sort_order,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.subscriptionPlans.update', subscriptionPlans.id));
    };

    const handleAddFeature = () => {
        setData('features', [...data.features, '']);
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData('features', newFeatures);
    };

    const handleRemoveFeature = (index: number) => {
        const newFeatures = data.features.filter((_, i) => i !== index);
        setData('features', newFeatures);
    };

    return (
        <AdminLayout>
            <Head title={`تعديل باقة: ${subscriptionPlans.name}`} />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={route('admin.subscriptionPlans.index')}>
                            <ArrowRight className="w-4 h-4 ml-2" />
                            العودة للباقات
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">تعديل باقة: {subscriptionPlans.name}</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>المعلومات الأساسية</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">اسم الباقة</Label>
                                        <Input 
                                            id="name" 
                                            value={data.name} 
                                            onChange={(e) => setData('name', e.target.value)} 
                                        />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="price">السعر</Label>
                                            <Input 
                                                id="price" 
                                                type="number" 
                                                value={data.price} 
                                                onChange={(e) => setData('price', e.target.value)} 
                                            />
                                            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="sort_order">ترتيب العرض</Label>
                                            <Input 
                                                id="sort_order" 
                                                type="number" 
                                                value={data.sort_order} 
                                                onChange={(e) => setData('sort_order', parseInt(e.target.value))} 
                                            />
                                            {errors.sort_order && <p className="text-sm text-destructive">{errors.sort_order}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>المميزات</CardTitle>
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
                                        <Plus className="w-4 h-4 ml-2" />
                                        إضافة ميزة
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {data.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input 
                                                value={feature} 
                                                onChange={(e) => handleFeatureChange(index, e.target.value)} 
                                                placeholder="مثال: 100 طالب"
                                            />
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleRemoveFeature(index)}
                                                className="text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {errors.features && <p className="text-sm text-destructive">{errors.features}</p>}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>الإعدادات</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>حالة الباقة</Label>
                                            <p className="text-xs text-muted-foreground">تفعيل أو تعطيل الباقة من الظهور</p>
                                        </div>
                                        <Switch 
                                            checked={data.is_active} 
                                            onCheckedChange={(checked) => setData('is_active', checked)} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>تمييز كأكثر طلباً</Label>
                                            <p className="text-xs text-muted-foreground">سيظهر عليها شارة "الأكثر طلباً"</p>
                                        </div>
                                        <Switch 
                                            checked={data.is_recommended} 
                                            onCheckedChange={(checked) => setData('is_recommended', checked)} 
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={processing}>
                                        <Save className="w-4 h-4 ml-2" />
                                        {processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
