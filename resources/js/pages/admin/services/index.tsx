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
    const [category, setCategory] = useState(filters.category || '');
    const [isActive, setIsActive] = useState(filters.is_active || '');

    const handleSearch = () => {
        router.get('/admin/services', { search, category, is_active: isActive }, { preserveState: true });
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
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">الخدمات</h1>
                    <Button asChild>
                        <Link href="/admin/services/create">
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة خدمة جديدة
                        </Link>
                    </Button>
                </div>
                
                {/* Filters Section */}
                <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4 w-full md:w-auto flex-wrap">
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="البحث في العنوان أو الوصف..."
                            className="w-full md:w-80"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Select onValueChange={(value) => setCategory(value)} value={category}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="جميع الفئات" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">جميع الفئات</SelectItem>
                                <SelectItem value="management">إدارة الحلقات</SelectItem>
                                <SelectItem value="education">التعليم والمنهجية</SelectItem>
                                <SelectItem value="analytics">التقارير والإحصائيات</SelectItem>
                                <SelectItem value="communication">التواصل</SelectItem>
                                <SelectItem value="technology">التقنية والأمان</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => setIsActive(value)} value={isActive}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="جميع الحالات" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">جميع الحالات</SelectItem>
                                <SelectItem value="1">نشط</SelectItem>
                                <SelectItem value="0">غير نشط</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSearch}>بحث</Button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="mt-8 rounded-md border bg-white dark:bg-gray-800">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>العنوان</TableHead>
                                <TableHead>الفئة</TableHead>
                                <TableHead>الأيقونة</TableHead>
                                <TableHead>ترتيب العرض</TableHead>
                                <TableHead>الحالة</TableHead>
                                <TableHead>شائع</TableHead>
                                <TableHead className="text-left">إجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services?.data?.length > 0 ? (
                                services.data.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell className="font-medium max-w-xs">
                                            <div className="truncate" title={service.title}>
                                                {service.title}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                                                {categoryLabels[service.category] || service.category}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-mono text-xs">{service.icon}</span>
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
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={`/admin/services/${service.id}`}>
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={`/admin/services/${service.id}/edit`}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(service.id)}
                                                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        لا توجد خدمات.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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
