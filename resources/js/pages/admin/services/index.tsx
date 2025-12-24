import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { PageProps } from '@/types';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { router as inertiaRouter } from '@inertiajs/react';

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

interface ServicesIndexProps extends PageProps {
    services: {
        data: Service[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        category?: string;
        is_active?: string;
    };
}

const categoryLabels: Record<string, string> = {
    'management': 'إدارة الحلقات',
    'education': 'التعليم والمنهجية',
    'analytics': 'التقارير والإحصائيات',
    'communication': 'التواصل',
    'technology': 'التقنية والأمان',
};

export default function ServicesIndex() {
    const { services, filters = {} } = usePage<ServicesIndexProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [isActive, setIsActive] = useState(filters.is_active || 'all');

    const handleSearch = () => {
        router.get('/admin/services', { search, category: category === 'all' ? '' : category, is_active: isActive === 'all' ? '' : isActive }, { preserveState: true });
    };

    const handleDelete = (serviceId: number) => {
        if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
            inertiaRouter.delete(`/admin/services/${serviceId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">الخدمات</h1>
                        <p className="text-sm text-muted-foreground">إدارة الخدمات المتاحة في المنصة</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/admin/services/create">
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة خدمة جديدة
                        </Link>
                    </Button>
                </div>
                
                {/* Filters Section */}
                <div className="mt-6 bg-card p-4 rounded-lg border border-border shadow-sm">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="البحث في العنوان أو الوصف..."
                            className="flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Select onValueChange={(value) => setCategory(value)} value={category}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="جميع الفئات" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">جميع الفئات</SelectItem>
                                <SelectItem value="management">إدارة الحلقات</SelectItem>
                                <SelectItem value="education">التعليم والمنهجية</SelectItem>
                                <SelectItem value="analytics">التقارير والإحصائيات</SelectItem>
                                <SelectItem value="communication">التواصل</SelectItem>
                                <SelectItem value="technology">التقنية والأمان</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => setIsActive(value)} value={isActive}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="جميع الحالات" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">جميع الحالات</SelectItem>
                                <SelectItem value="1">نشط</SelectItem>
                                <SelectItem value="0">غير نشط</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSearch} className="w-full sm:w-auto">بحث</Button>
                    </div>
                </div>

                {/* Table Section - Responsive */}
                <div className="mt-8">
                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>العنوان</TableHead>
                                    <TableHead>الفئة</TableHead>
                                    <TableHead>الأيقونة</TableHead>
                                    <TableHead>ترتيب العرض</TableHead>
                                    <TableHead>الحالة</TableHead>
                                    <TableHead>شائع</TableHead>
                                    <TableHead className="text-right">إجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services?.data?.length > 0 ? (
                                    services.data.map((service) => (
                                        <TableRow key={service.id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-medium max-w-xs">
                                                <div className="truncate" title={service.title}>
                                                    {service.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 text-xs bg-muted rounded-md">
                                                    {categoryLabels[service.category] || service.category}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-mono text-xs text-muted-foreground">{service.icon}</span>
                                            </TableCell>
                                            <TableCell>{service.display_order}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    service.is_active 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {service.is_active ? 'نشط' : 'غير نشط'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {service.popular ? (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                                        نعم
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Link href={`/admin/services/${service.id}`} title="عرض">
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Link href={`/admin/services/${service.id}/edit`} title="تعديل">
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(service.id)}
                                                        className="text-red-600 hover:text-red-700 dark:text-red-400 h-8 w-8 p-0"
                                                        title="حذف"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            لا توجد خدمات.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {services?.data?.length > 0 ? (
                            services.data.map((service) => (
                                <div key={service.id} className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-lg text-foreground mb-1">{service.title}</h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-2 py-1 text-xs bg-muted rounded-md">
                                                    {categoryLabels[service.category] || service.category}
                                                </span>
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    service.is_active 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {service.is_active ? 'نشط' : 'غير نشط'}
                                                </span>
                                                {service.popular && (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                                        شائع
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>الأيقونة: <span className="font-mono">{service.icon}</span></span>
                                            <span>الترتيب: {service.display_order}</span>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                                            <Button variant="ghost" size="sm" asChild className="flex-1">
                                                <Link href={`/admin/services/${service.id}`}>
                                                    <Eye className="w-4 h-4 ml-2" />
                                                    عرض
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" asChild className="flex-1">
                                                <Link href={`/admin/services/${service.id}/edit`}>
                                                    <Edit className="w-4 h-4 ml-2" />
                                                    تعديل
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(service.id)}
                                                className="text-red-600 hover:text-red-700 dark:text-red-400 flex-1"
                                            >
                                                <Trash2 className="w-4 h-4 ml-2" />
                                                حذف
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="text-lg">لا توجد خدمات.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {services?.links && services.links.length > 3 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        {services.links.map((link: any, index: number) => (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
