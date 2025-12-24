import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SchoolsTable, { SchoolWithAdmin } from '@/components/admin/SchoolsTable';
import { PageProps } from '@/types';
import { Plus } from 'lucide-react';
import { router as inertiaRouter } from '@inertiajs/react';

interface SchoolsIndexProps extends PageProps {
    schools: {
        data: SchoolWithAdmin[];
        links?: { url: string | null; label: string; active: boolean }[];
        meta?: Record<string, unknown>;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function SchoolsIndex() {
    const { schools, filters = {} } = usePage<SchoolsIndexProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = () => {
        router.get('/admin/schools', { 
            search, 
            status: status === 'all' ? '' : status
        }, { preserveState: true });
    };

    const handleDelete = (schoolId: number) => {
        if (confirm('هل أنت متأكد من حذف هذه المدرسة؟')) {
            inertiaRouter.delete(`/admin/schools/${schoolId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">المدارس</h1>
                        <p className="text-sm text-muted-foreground">إدارة المدارس المسجلة في المنصة</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/admin/schools/create">
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة مدرسة جديدة
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
                            placeholder="البحث بالاسم، المشرف، أو رقم التسجيل"
                            className="flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Select onValueChange={(value) => setStatus(value)} value={status}>
                            <SelectTrigger className="w-full sm:w-[180px]">
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
                        <Button onClick={handleSearch} className="w-full sm:w-auto">بحث</Button>
                    </div>
                </div>

                {/* Table Section - Responsive */}
                <div className="mt-8">
                    <SchoolsTable
                        schools={schools?.data || []}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Pagination */}
                {schools?.links && schools.links.length > 3 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        {schools.links.map((link: { url: string | null; label: string; active: boolean }, index: number) => (
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
