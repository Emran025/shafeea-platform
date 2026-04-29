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
import { School, User } from '@/types';
import { Eye, Edit, Trash2, Building2, UserCog, MapPin } from 'lucide-react';

export interface SchoolWithAdmin extends School {
    admin?: {
        user: User;
        status: string;
    };
}

interface SchoolsTableProps {
    schools: SchoolWithAdmin[];
    onDelete?: (schoolId: number) => void;
    viewMode?: 'table' | 'grid';
}

export default function SchoolsTable({
    schools,
    onDelete,
    viewMode = 'table',
}: SchoolsTableProps) {
    const getStatusBadge = (status?: string) => {
        const statusMap: Record<string, { bg: string; label: string }> = {
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

    // ─── Table View ──────────────────────────────────────────────────────────
    if (viewMode === 'table') {
        return (
            <Table>
                    <TableHeader>
                        <TableRow className="bg-primary/5 dark:bg-primary/10 border-b-2 border-primary/20 hover:bg-primary/5">
                            <TableHead className="px-5 py-3 text-xs font-bold text-foreground tracking-wider">اسم المدرسة</TableHead>
                            <TableHead className="px-5 py-3 text-xs font-bold text-foreground tracking-wider">المشرف</TableHead>
                            <TableHead className="px-5 py-3 text-xs font-bold text-foreground tracking-wider">الحالة</TableHead>
                            <TableHead className="px-5 py-3 text-xs font-bold text-foreground tracking-wider text-right">إجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schools?.length > 0 ? (
                            schools.map((school) => (
                                <TableRow
                                    key={school.id}
                                    className="hover:bg-muted/30 transition-colors group border-b border-border/50"
                                >
                                    <TableCell className="px-5 py-3 font-medium">
                                        <div className="flex items-center gap-3">
                                            {school.logo && (
                                                <img
                                                    src={school.logo}
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
                                    <TableCell className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <UserCog className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {school.admin?.user?.name || 'لا يوجد مشرف'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-3">
                                        {getStatusBadge(school.admin?.status)}
                                    </TableCell>
                                    <TableCell className="px-5 py-3">
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
        );
    }

    // ─── Grid / Card View (no background fill) ───────────────────────────────
    if (schools?.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-3">
                    <Building2 className="w-16 h-16 opacity-20" />
                    <p className="text-lg font-medium">لا توجد مدارس</p>
                    <p className="text-sm">ابدأ بإضافة مدرسة جديدة</p>
                </div>
            </div>
        );
    }

    return (
        <div className="divide-y divide-border">
            {schools.map((school) => (
                <div
                    key={school.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
                >
                    {/* Logo */}
                    {school.logo ? (
                        <img
                            src={school.logo}
                            alt={school.name}
                            className="w-11 h-11 rounded-lg object-cover border border-border flex-shrink-0"
                        />
                    ) : (
                        <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground truncate">{school.name}</h3>
                            {getStatusBadge(school.admin?.status)}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {school.city}, {school.country}
                            </span>
                            <span className="flex items-center gap-1">
                                <UserCog className="w-3 h-3" />
                                {school.admin?.user?.name || 'لا يوجد مشرف'}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        >
                            <Link href={`/admin/schools/${school.id}`} title="عرض">
                                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
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
                                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 hover:text-red-700 dark:text-red-400"
                                title="حذف"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
