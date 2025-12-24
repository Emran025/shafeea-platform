import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Edit, Trash2 } from 'lucide-react';
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
        if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
            router.delete(`/admin/services/${service.id}`, {
                onSuccess: () => {
                    router.visit('/admin/services');
                },
            });
        }
    };

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">تفاصيل الخدمة</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/services/${service.id}/edit`}>
                                <Edit className="w-4 h-4 ml-2" />
                                تعديل
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/services">
                                <ArrowRight className="w-4 h-4 ml-2" />
                                العودة للقائمة
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>المعلومات الأساسية</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">العنوان</label>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{service.title}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">الوصف</label>
                                    <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">{service.description}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">الفئة</label>
                                    <div className="mt-1">
                                        <Badge variant="secondary">
                                            {categoryLabels[service.category] || service.category}
                                        </Badge>
                                    </div>
                                </div>

                                {service.image && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">الصورة</label>
                                        <div className="mt-1">
                                            <img 
                                                src={service.image} 
                                                alt={service.title}
                                                className="max-w-full h-auto rounded-lg border"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Features */}
                        {service.features && service.features.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>المميزات</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {service.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Benefits */}
                        {service.benefits && service.benefits.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>الفوائد</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {service.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
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
                        <Card>
                            <CardHeader>
                                <CardTitle>إعدادات العرض</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">الأيقونة</label>
                                    <p className="text-gray-900 dark:text-white mt-1 font-mono text-sm">{service.icon}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">اللون/السمة</label>
                                    <div className="mt-1">
                                        <Badge variant="outline">
                                            {themeLabels[service.theme] || service.theme}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">ترتيب العرض</label>
                                    <p className="text-gray-900 dark:text-white mt-1">{service.display_order}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">خدمة شائعة</label>
                                    <Badge variant={service.popular ? "default" : "secondary"}>
                                        {service.popular ? 'نعم' : 'لا'}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">الحالة</label>
                                    <Badge variant={service.is_active ? "default" : "secondary"}>
                                        {service.is_active ? 'نشط' : 'غير نشط'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle>معلومات إضافية</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div>
                                    <label className="text-gray-500 dark:text-gray-400">تاريخ الإنشاء</label>
                                    <p className="text-gray-900 dark:text-white mt-1">
                                        {new Date(service.created_at).toLocaleDateString('ar-SA', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-500 dark:text-gray-400">تاريخ آخر تحديث</label>
                                    <p className="text-gray-900 dark:text-white mt-1">
                                        {new Date(service.updated_at).toLocaleDateString('ar-SA', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
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