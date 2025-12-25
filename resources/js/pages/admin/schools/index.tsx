import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import SchoolsTable, { SchoolWithAdmin } from '@/components/admin/SchoolsTable';
import { PageProps } from '@/types';
import { Plus, Search, Filter, Building2, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { router as inertiaRouter } from '@inertiajs/react';

interface SchoolsIndexProps extends PageProps {
    schools: {
        data: SchoolWithAdmin[];
        links?: { url: string | null; label: string; active: boolean }[];
        meta?: Record<string, unknown>;
    };
    stats: {
        total: number;
        accepted: number;
        pending: number;
        rejected: number;
        suspended: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function SchoolsIndex() {
    const { schools, stats, filters = {} } = usePage<SchoolsIndexProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = () => {
        router.get('/admin/schools', { 
            search, 
            status: status === 'all' ? '' : status
        }, { preserveState: true });
    };

    const handleDelete = (schoolId: number) => {
        if (confirm('هل أنت متأكد من حذف هذه المدرسة؟ سيتم حذفها نهائياً.')) {
            inertiaRouter.delete(`/admin/schools/${schoolId}`, {
                preserveScroll: true,
            });
        }
    };

    const statusCounts = stats || {
        total: 0,
        accepted: 0,
        pending: 0,
        rejected: 0,
        suspended: 0,
    };

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">إدارة المدارس</h1>
                        <p className="text-sm text-muted-foreground">
                            إدارة وعرض جميع المدارس المسجلة في المنصة
                        </p>
                    </div>
                    <Button asChild className="gap-2 shadow-lg hover:shadow-xl transition-all">
                        <Link href="/admin/schools/create">
                            <Plus className="w-4 h-4" />
                            إضافة مدرسة جديدة
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">إجمالي المدارس</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{statusCounts.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">مقبولة</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{statusCounts.accepted}</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-amber-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">قيد الانتظار</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{statusCounts.pending}</p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">مرفوضة</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{statusCounts.rejected}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-gray-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">معلقة</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{statusCounts.suspended}</p>
                                </div>
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900/30 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
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
                                    placeholder="البحث بالاسم، المشرف، أو رقم التسجيل"
                                    className="pr-10 h-11"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Select onValueChange={(value) => setStatus(value)} value={status}>
                                <SelectTrigger className="w-full lg:w-[200px] h-11">
                                    <Filter className="w-4 h-4 ml-2 opacity-50" />
                                    <SelectValue placeholder="جميع الحالات" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">جميع الحالات</SelectItem>
                                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                                    <SelectItem value="accepted">مقبولة</SelectItem>
                                    <SelectItem value="rejected">مرفوضة</SelectItem>
                                    <SelectItem value="suspended">معلقة</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button 
                                onClick={handleSearch} 
                                className="flex-1 lg:flex-none gap-2 h-11"
                            >
                                <Search className="w-4 h-4" />
                                بحث
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table Section */}
                <Card className="border-2 border-border/50 shadow-lg overflow-hidden">
                    <SchoolsTable
                        schools={schools?.data || []}
                        onDelete={handleDelete}
                    />
                </Card>

                {/* Pagination */}
                {schools?.links && schools.links.length > 3 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                        {schools.links.map((link: { url: string | null; label: string; active: boolean }, index: number) => (
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
