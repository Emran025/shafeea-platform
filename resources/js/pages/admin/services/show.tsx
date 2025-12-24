import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Edit, Trash2, Sparkles, Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import { PageProps } from '@/types';
import { router } from '@inertiajs/react';

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
    created_at: string;
    updated_at: string;
}

interface ShowServiceProps extends PageProps {
    service: Service;
}

const categoryLabels: Record<string, string> = {
    'management': 'إدارة الحلقات',
    'education': 'التعليم والمنهجية',
    'analytics': 'التقارير والإحصائيات',
    'communication': 'التواصل',
    'technology': 'التقنية والأمان',
};

const categoryColors: Record<string, string> = {
    'management': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'education': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    'analytics': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    'communication': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    'technology': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

const themeLabels: Record<string, string> = {
    'blue': 'أزرق',
    'indigo': 'نيلي',
    'emerald': 'زمردي',
    'rose': 'وردي',
    'amber': 'كهرماني',
    'violet': 'بنفسجي',
    'cyan': 'سماوي',
    'orange': 'برتقالي',
};

export default function ShowService() {
    const { service } = usePage<ShowServiceProps>().props;

    const handleDelete = () => {
        if (confirm('هل أنت متأكد من حذف هذه الخدمة؟ سيتم حذفها نهائياً.')) {
            router.delete(`/admin/services/${service.id}`, {
                onSuccess: () => {
                    router.visit('/admin/services');
                },
            });
        }
    };

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">تفاصيل الخدمة</h1>
                        <p className="text-sm text-muted-foreground">
                            عرض معلومات الخدمة بالتفصيل
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild className="gap-2">
                            <Link href={`/admin/services/${service.id}/edit`}>
                                <Edit className="w-4 h-4" />
                                تعديل
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} className="gap-2">
                            <Trash2 className="w-4 h-4" />
                            حذف
                        </Button>
                        <Button variant="outline" asChild className="gap-2">
                            <Link href="/admin/services">
                                <ArrowRight className="w-4 h-4" />
                                العودة
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Service Image */}
                        {service.image && (
                            <Card className="border-2 border-border/50 shadow-lg overflow-hidden">
                                <div className="relative h-64 bg-muted">
                                    <img 
                                        src={service.image} 
                                        alt={service.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            </Card>
                        )}

                        {/* Basic Information */}
                        <Card className="border-2 border-border/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                        <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">المعلومات الأساسية</CardTitle>
                                        <CardDescription>تفاصيل الخدمة الأساسية</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-semibold text-muted-foreground">العنوان</Label>
                                    <p className="text-xl font-bold text-foreground mt-2">{service.title}</p>
                                </div>

                                <Separator />

                                <div>
                                    <Label className="text-sm font-semibold text-muted-foreground">الوصف</Label>
                                    <p className="text-foreground mt-2 leading-relaxed whitespace-pre-wrap">
                                        {service.description}
                                    </p>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-3">
                                    <Label className="text-sm font-semibold text-muted-foreground">الفئة:</Label>
                                    <Badge 
                                        variant="outline" 
                                        className={`${categoryColors[service.category] || 'bg-gray-100 text-gray-800'} border`}
                                    >
                                        {categoryLabels[service.category] || service.category}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        {service.features && service.features.length > 0 && service.features[0] !== '' && (
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
                                <CardContent>
                                    <ul className="space-y-3">
                                        {service.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold">{index + 1}</span>
                                                </div>
                                                <span className="text-foreground flex-1">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Benefits */}
                        {service.benefits && service.benefits.length > 0 && service.benefits[0] !== '' && (
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
                                <CardContent>
                                    <ul className="space-y-3">
                                        {service.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold">{index + 1}</span>
                                                </div>
                                                <span className="text-foreground flex-1">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Display Settings */}
                        <Card className="border-2 border-border/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">إعدادات العرض</CardTitle>
                                        <CardDescription>معلومات العرض والإعدادات</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-muted-foreground">الأيقونة</Label>
                                    <div className="p-3 bg-muted rounded-lg">
                                        <code className="text-sm font-mono text-foreground">{service.icon}</code>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-muted-foreground">اللون/السمة</Label>
                                    <Badge variant="outline" className="text-sm">
                                        {themeLabels[service.theme] || service.theme}
                                    </Badge>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-muted-foreground">ترتيب العرض</Label>
                                    <div className="p-3 bg-muted rounded-lg">
                                        <span className="text-lg font-bold text-foreground">{service.display_order}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <Label className="text-sm font-semibold">خدمة شائعة</Label>
                                    <Badge variant={service.popular ? "default" : "secondary"} className={service.popular ? "bg-amber-500" : ""}>
                                        {service.popular ? 'نعم' : 'لا'}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <Label className="text-sm font-semibold">الحالة</Label>
                                    <Badge 
                                        variant={service.is_active ? "default" : "secondary"}
                                        className={service.is_active 
                                            ? "bg-emerald-500 text-white" 
                                            : "bg-gray-500 text-white"
                                        }
                                    >
                                        {service.is_active ? 'نشط' : 'غير نشط'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card className="border-2 border-border/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900/30 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">معلومات إضافية</CardTitle>
                                        <CardDescription>تواريخ الإنشاء والتحديث</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-semibold">تاريخ الإنشاء</span>
                                    </div>
                                    <p className="text-foreground font-medium">
                                        {new Date(service.created_at).toLocaleDateString('ar-SA', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(service.created_at).toLocaleTimeString('ar-SA', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span className="font-semibold">آخر تحديث</span>
                                    </div>
                                    <p className="text-foreground font-medium">
                                        {new Date(service.updated_at).toLocaleDateString('ar-SA', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(service.updated_at).toLocaleTimeString('ar-SA', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
