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
import { School, User } from '@/types';
import { Eye, Edit, Trash2 } from 'lucide-react';

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
        const statusMap: Record<string, { bg: string; label: string }> = {
            'accepted': {
                bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                label: 'مقبولة'
            },
            'pending': {
                bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                label: 'قيد الانتظار'
            },
            'rejected': {
                bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                label: 'مرفوضة'
            },
            'suspended': {
                bg: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                label: 'معلقة'
            }
        };

        const statusInfo = statusMap[status || ''] || {
            bg: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            label: 'غير متوفر'
        };

        return (
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.bg}`}>
                {statusInfo.label}
            </span>
        );
    };

    // Desktop Table View
    const DesktopTable = () => (
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
                    {schools?.length > 0 ? (
                        schools.map((school) => (
                            <TableRow key={school.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="font-medium">
                                    {school.name}
                                </TableCell>
                                <TableCell>
                                    {school.admin?.user?.name || 'لا يوجد مشرف'}
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
                                            className="h-8 w-8 p-0"
                                        >
                                            <Link href={`/admin/schools/${school.id}`} title="عرض">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                            className="h-8 w-8 p-0"
                                        >
                                            <Link href={`/admin/schools/${school.id}/edit`} title="تعديل">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        {onDelete && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(school.id)}
                                                className="text-red-600 hover:text-red-700 dark:text-red-400 h-8 w-8 p-0"
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
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                لا توجد مدارس.
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
                    <div key={school.id} className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-semibold text-lg text-foreground mb-2">{school.name}</h3>
                                <div className="text-sm text-muted-foreground mb-2">
                                    <span className="font-medium">المشرف:</span> {school.admin?.user?.name || 'لا يوجد مشرف'}
                                </div>
                                {getStatusBadge(school.admin?.status)}
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-border">
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
                    </div>
                ))
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg">لا توجد مدارس.</p>
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
