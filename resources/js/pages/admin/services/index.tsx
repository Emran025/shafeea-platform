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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageProps } from '@/types';
import { Plus, Edit, Trash2, Eye, Search, Filter, Sparkles, Grid3x3, List } from 'lucide-react';
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
        links: { url: string | null; label: string; active: boolean }[];
        meta: Record<string, unknown>;
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

const categoryColors: Record<string, string> = {
    'management': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'education': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    'analytics': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    'communication': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    'technology': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

export default function ServicesIndex() {
    const { services, filters = {} } = usePage<ServicesIndexProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [isActive, setIsActive] = useState(filters.is_active || 'all');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const handleSearch = () => {
        router.get('/admin/services', { 
            search, 
            category: category === 'all' ? '' : category, 
            is_active: isActive === 'all' ? '' : isActive 
        }, { preserveState: true });
    };

    const handleDelete = (serviceId: number) => {
        if (confirm('هل أنت متأكد من حذف هذه الخدمة؟ سيتم حذفها نهائياً.')) {
            inertiaRouter.delete(`/admin/services/${serviceId}`, {
                preserveScroll: true,
            });
        }
    };

    const activeCount = services?.data?.filter(s => s.is_active).length || 0;
    const totalCount = services?.data?.length || 0;

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">إدارة الخدمات</h1>
                        <p className="text-sm text-muted-foreground">
                            إدارة وعرض جميع الخدمات المتاحة في المنصة
                        </p>
                    </div>
                    <Button asChild className="gap-2 shadow-lg hover:shadow-xl transition-all">
                        <Link href="/admin/services/create">
                            <Plus className="w-4 h-4" />
                            إضافة خدمة جديدة
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">إجمالي الخدمات</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{totalCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">الخدمات النشطة</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{activeCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-amber-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">الخدمات الشائعة</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">
                                        {services?.data?.filter(s => s.popular).length || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Filters Section */}
                <Card className="border-2 border-border/50 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="البحث في العنوان أو الوصف..."
                                    className="pr-10 h-11"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Select onValueChange={(value) => setCategory(value)} value={category}>
                                <SelectTrigger className="w-full lg:w-[200px] h-11">
                                    <Filter className="w-4 h-4 ml-2 opacity-50" />
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
                                <SelectTrigger className="w-full lg:w-[180px] h-11">
                                    <SelectValue placeholder="جميع الحالات" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">جميع الحالات</SelectItem>
                                    <SelectItem value="1">نشط</SelectItem>
                                    <SelectItem value="0">غير نشط</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Button 
                                    onClick={handleSearch} 
                                    className="flex-1 lg:flex-none gap-2 h-11"
                                >
                                    <Search className="w-4 h-4" />
                                    بحث
                                </Button>
                                <div className="flex border border-border rounded-lg overflow-hidden">
                                    <Button
                                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('table')}
                                        className="rounded-none border-0"
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="rounded-none border-0 border-r border-border"
                                    >
                                        <Grid3x3 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Content Section */}
                {viewMode === 'table' ? (
                    <Card className="overflow-hidden border-2 border-border/50 shadow-lg">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">العنوان</TableHead>
                                        <TableHead className="font-semibold">الفئة</TableHead>
                                        <TableHead className="font-semibold">الأيقونة</TableHead>
                                        <TableHead className="font-semibold">ترتيب العرض</TableHead>
                                        <TableHead className="font-semibold">الحالة</TableHead>
                                        <TableHead className="font-semibold">شائع</TableHead>
                                        <TableHead className="text-right font-semibold">إجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {services?.data?.length > 0 ? (
                                        services.data.map((service) => (
                                            <TableRow 
                                                key={service.id} 
                                                className="hover:bg-muted/30 transition-colors group"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        {service.image && (
                                                            <img 
                                                                src={service.image} 
                                                                alt={service.title}
                                                                className="w-10 h-10 rounded-lg object-cover border border-border"
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="font-semibold text-foreground">
                                                                {service.title}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                                                                {service.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant="outline" 
                                                        className={`${categoryColors[service.category] || 'bg-gray-100 text-gray-800'} border`}
                                                    >
                                                        {categoryLabels[service.category] || service.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                                        {service.icon}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium">{service.display_order}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={service.is_active ? "default" : "secondary"}
                                                        className={service.is_active 
                                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" 
                                                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                                        }
                                                    >
                                                        {service.is_active ? 'نشط' : 'غير نشط'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {service.popular ? (
                                                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                                                            <Sparkles className="w-3 h-3 ml-1" />
                                                            شائع
                                                        </Badge>
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
                                                            className="h-9 w-9 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                                        >
                                                            <Link href={`/admin/services/${service.id}`} title="عرض التفاصيل">
                                                                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                            className="h-9 w-9 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                                        >
                                                            <Link href={`/admin/services/${service.id}/edit`} title="تعديل">
                                                                <Edit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(service.id)}
                                                            className="h-9 w-9 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 hover:text-red-700 dark:text-red-400"
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
                                            <TableCell colSpan={7} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                    <Sparkles className="w-12 h-12 opacity-20" />
                                                    <p className="text-lg font-medium">لا توجد خدمات</p>
                                                    <p className="text-sm">ابدأ بإضافة خدمة جديدة</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services?.data?.length > 0 ? (
                            services.data.map((service) => (
                                <Card 
                                    key={service.id} 
                                    className="group hover:shadow-xl transition-all duration-300 border-2 border-border/50 overflow-hidden"
                                >
                                    <CardContent className="p-0">
                                        {service.image && (
                                            <div className="relative h-48 overflow-hidden bg-muted">
                                                <img 
                                                    src={service.image} 
                                                    alt={service.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3 flex gap-2">
                                                    {service.popular && (
                                                        <Badge className="bg-amber-500 text-white border-0">
                                                            <Sparkles className="w-3 h-3 ml-1" />
                                                            شائع
                                                        </Badge>
                                                    )}
                                                    <Badge 
                                                        variant={service.is_active ? "default" : "secondary"}
                                                        className={service.is_active 
                                                            ? "bg-emerald-500 text-white border-0" 
                                                            : "bg-gray-500 text-white border-0"
                                                        }
                                                    >
                                                        {service.is_active ? 'نشط' : 'غير نشط'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-5 space-y-4">
                                            <div>
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h3 className="font-bold text-lg text-foreground line-clamp-2">
                                                        {service.title}
                                                    </h3>
                                                </div>
                                                <Badge 
                                                    variant="outline" 
                                                    className={`${categoryColors[service.category] || 'bg-gray-100 text-gray-800'} border text-xs`}
                                                >
                                                    {categoryLabels[service.category] || service.category}
                                                </Badge>
                                                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                                                    {service.description}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                                                        {service.icon}
                                                    </code>
                                                    <span>•</span>
                                                    <span>ترتيب: {service.display_order}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Link href={`/admin/services/${service.id}`}>
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Link href={`/admin/services/${service.id}/edit`}>
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(service.id)}
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                    <Sparkles className="w-16 h-16 opacity-20" />
                                    <p className="text-xl font-medium">لا توجد خدمات</p>
                                    <p className="text-sm">ابدأ بإضافة خدمة جديدة</p>
                                    <Button asChild className="mt-4">
                                        <Link href="/admin/services/create">
                                            <Plus className="w-4 h-4 ml-2" />
                                            إضافة خدمة جديدة
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {services?.links && services.links.length > 3 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                        {services.links.map((link: { url: string | null; label: string; active: boolean }, index: number) => (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                className={link.active ? "shadow-md" : ""}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
