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
} from '@/components/ui/table'; // تأكد من مسار الاستيراد الصحيح
import { PageProps, School, User } from '@/types';

interface SchoolWithAdmin extends School {
    admin?: {
        user: User;
        status: string;
    };
}

interface SchoolsIndexProps extends PageProps {
    schools: {
        data: SchoolWithAdmin[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function SchoolsIndex() {
    const { schools, filters = {} } = usePage<SchoolsIndexProps>().props; 
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = () => {
        router.get('/admin/schools', { search, status }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">المدارس</h1>
                    <p className="text-sm text-muted-foreground">إدارة المدارس المسجلة في المنصة</p>
                </div>
                
                {/* Filters Section */}
                <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
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
                <div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>اسم المدرسة</TableHead>
                                    <TableHead>المشرف</TableHead>
                                    <TableHead>الحالة</TableHead>
                                    <TableHead className="text-right">إجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schools?.data?.length > 0 ? (
                                    schools.data.map((school) => (
                                        <TableRow key={school.id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-medium">
                                                {school.name}
                                            </TableCell>
                                            <TableCell>
                                                {school.admin?.user?.name || 'لا يوجد مشرف'}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    school.admin?.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    school.admin?.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }`}>
                                                    {school.admin?.status === 'accepted' ? 'مقبولة' :
                                                     school.admin?.status === 'pending' ? 'قيد الانتظار' :
                                                     school.admin?.status === 'rejected' ? 'مرفوضة' :
                                                     school.admin?.status === 'suspended' ? 'معلقة' :
                                                     'غير متوفر'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link 
                                                    href={`/admin/schools/${school.id}`} 
                                                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                                                >
                                                    عرض التفاصيل
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            لا توجد مدارس.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {schools?.data?.length > 0 ? (
                            schools.data.map((school) => (
                                <div key={school.id} className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-lg text-foreground mb-2">{school.name}</h3>
                                            <div className="text-sm text-muted-foreground mb-2">
                                                <span className="font-medium">المشرف:</span> {school.admin?.user?.name || 'لا يوجد مشرف'}
                                            </div>
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                school.admin?.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                school.admin?.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                            }`}>
                                                {school.admin?.status === 'accepted' ? 'مقبولة' :
                                                 school.admin?.status === 'pending' ? 'قيد الانتظار' :
                                                 school.admin?.status === 'rejected' ? 'مرفوضة' :
                                                 school.admin?.status === 'suspended' ? 'معلقة' :
                                                 'غير متوفر'}
                                            </span>
                                        </div>
                                        <div className="pt-2 border-t border-border">
                                            <Link 
                                                href={`/admin/schools/${school.id}`} 
                                                className="block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                                            >
                                                عرض التفاصيل
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="text-lg">لا توجد مدارس.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}