import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose, 
} from "@/components/ui/dialog";
import { PageProps, School, User } from '@/types';

interface SchoolWithAdmin extends School {
    admin: {
        user: User;
    };
}

interface PendingSchoolsProps extends PageProps {
    schools: SchoolWithAdmin[];
}

type ActionType = 'approve' | 'reject' | null;

export default function PendingSchools() {
    const { schools } = usePage<PendingSchoolsProps>().props;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<SchoolWithAdmin | null>(null);
    const [actionType, setActionType] = useState<ActionType>(null);
    const [isLoading, setIsLoading] = useState(false);

    const confirmAction = (school: SchoolWithAdmin, type: ActionType) => {
        setSelectedSchool(school);
        setActionType(type);
        setIsDialogOpen(true);
    };

    const handleConfirm = () => {
        if (!selectedSchool || !actionType) return;

        setIsLoading(true);
        const url = `/admin/schools/${selectedSchool.id}/${actionType}`;

        router.post(url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDialogOpen(false);
                setSelectedSchool(null);
                setActionType(null);
            },
            onFinish: () => setIsLoading(false),
        });
    };

    const dialogTitle = actionType === 'approve' ? 'قبول المدرسة' : 'رفض المدرسة';
    const dialogDescription = actionType === 'approve' 
        ? `هل أنت متأكد من أنك تود قبول "${selectedSchool?.name}"? والذي سيمكنهم من استخدام المنصة`
        : `هل أنت متأكد من أنك تود قبول "${selectedSchool?.name}"? هذا القرار غير قابل للتراجع. ` ;

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">الــــــــــمدارس المتقدمة</h1>
                
                <div className="mt-8 rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>اسم المدرسة</TableHead>
                                <TableHead>المشرف</TableHead>
                                <TableHead>تأريخ التقدم</TableHead>
                                <TableHead className="text-center">إجراء</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schools && schools.length > 0 ? (
                                schools.map((school) => (
                                    <TableRow key={school.id}>
                                        <TableCell className="font-medium">
                                            {school.name}
                                        </TableCell>
                                        <TableCell>
                                            {school.admin.user.name}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(school.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    onClick={() => confirmAction(school, 'approve')} 
                                                    size="sm"
                                                    variant="default"
                                                >
                                                    قبول
                                                </Button>
                                                <Button 
                                                    onClick={() => confirmAction(school, 'reject')} 
                                                    size="sm"
                                                    variant="destructive"
                                                >
                                                    رفض
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No pending schools found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Dialog Component */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{dialogTitle}</DialogTitle>
                            <DialogDescription>
                                {dialogDescription}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            {/* زر الإلغاء يستخدم DialogClose للإغلاق التلقائي */}
                            <DialogClose asChild>
                                <Button variant="outline" type="button" disabled={isLoading}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            
                            {/* زر التأكيد */}
                            <Button 
                                type="button" 
                                variant={actionType === 'reject' ? "destructive" : "default"}
                                onClick={handleConfirm}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : (actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}