import { Link } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { School, User } from '@/types';
import { Eye, Edit, Trash2, Building2, UserCog } from 'lucide-react';

export interface SchoolWithAdmin extends School {
    admin?: {
        user: User;
        status: string;
    };
}

interface SchoolsTableProps {
    schools: SchoolWithAdmin[];
    onDelete?: (schoolId: number) => void;
}

export default function SchoolsTable({ 
    schools, 
    onDelete
}: SchoolsTableProps) {
    const getStatusBadge = (status?: string) => {
        const statusMap: Record<string, { bg: string; label: string; icon?: React.ReactNode }> = {
            'accepted': {
                bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                label: 'مقبولة'
            },
            'pending': {
                bg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                label: 'قيد الانتظار'
            },
            'rejected': {
                bg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
                label: 'مرفوضة'
            },
            'suspended': {
                bg: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
                label: 'معلقة'
            }
        };

        const statusInfo = statusMap[status || ''] || {
            bg: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
            label: 'غير متوفر'
        };

        return (
            <Badge variant="outline" className={`${statusInfo.bg} border font-semibold`}>
                {statusInfo.label}
            </Badge>
        );
    };

    // Desktop Table View
    const DesktopTable = () => (
        <div className="hidden md:block overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">اسم المدرسة</TableHead>
                        <TableHead className="font-semibold">المشرف</TableHead>
                        <TableHead className="font-semibold">الحالة</TableHead>
                        <TableHead className="text-right font-semibold">إجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schools?.length > 0 ? (
                        schools.map((school) => (
                            <TableRow 
                                key={school.id} 
                                className="hover:bg-muted/30 transition-colors group"
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        {school.logo && (
                                            <img 
                                                src={`/storage/${school.logo}`} 
                                                alt={school.name}
                                                className="w-10 h-10 rounded-lg object-cover border border-border"
                                            />
                                        )}
                                        <div>
                                            <div className="font-semibold text-foreground">
                                                {school.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {school.city}, {school.country}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <UserCog className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {school.admin?.user?.name || 'لا يوجد مشرف'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(school.admin?.status)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 justify-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                            className="h-9 w-9 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                        >
                                            <Link href={`/admin/schools/${school.id}`} title="عرض التفاصيل">
                                                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                            className="h-9 w-9 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                        >
                                            <Link href={`/admin/schools/${school.id}/edit`} title="تعديل">
                                                <Edit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            </Link>
                                        </Button>
                                        {onDelete && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(school.id)}
                                                className="h-9 w-9 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 hover:text-red-700 dark:text-red-400"
                                                title="حذف"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-32 text-center">
                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <Building2 className="w-12 h-12 opacity-20" />
                                    <p className="text-lg font-medium">لا توجد مدارس</p>
                                    <p className="text-sm">ابدأ بإضافة مدرسة جديدة</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    // Mobile Card View
    const MobileCardView = () => (
        <div className="md:hidden space-y-4">
            {schools?.length > 0 ? (
                schools.map((school) => (
                    <Card 
                        key={school.id} 
                        className="border-2 border-border/50 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    {school.logo && (
                                        <img 
                                            src={`/storage/${school.logo}`} 
                                            alt={school.name}
                                            className="w-12 h-12 rounded-lg object-cover border border-border"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-foreground mb-1">{school.name}</h3>
                                        <div className="text-sm text-muted-foreground mb-2">
                                            {school.city}, {school.country}
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <UserCog className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {school.admin?.user?.name || 'لا يوجد مشرف'}
                                            </span>
                                        </div>
                                        {getStatusBadge(school.admin?.status)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-3 border-t border-border">
                                    <Button variant="ghost" size="sm" asChild className="flex-1">
                                        <Link href={`/admin/schools/${school.id}`}>
                                            <Eye className="w-4 h-4 ml-2" />
                                            عرض
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="sm" asChild className="flex-1">
                                        <Link href={`/admin/schools/${school.id}/edit`}>
                                            <Edit className="w-4 h-4 ml-2" />
                                            تعديل
                                        </Link>
                                    </Button>
                                    {onDelete && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(school.id)}
                                            className="text-red-600 hover:text-red-700 dark:text-red-400 flex-1"
                                        >
                                            <Trash2 className="w-4 h-4 ml-2" />
                                            حذف
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Building2 className="w-16 h-16 opacity-20" />
                        <p className="text-lg font-medium">لا توجد مدارس</p>
                        <p className="text-sm">ابدأ بإضافة مدرسة جديدة</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            <DesktopTable />
            <MobileCardView />
        </>
    );
}
