import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout.tsx';
import { School } from '@/types';

export default function SchoolApprovalDashboard({ schools }: { schools: School[] }) {
    return (
        <AdminLayout>
            <Head title="School Approval Dashboard" />
            <div className="container mx-auto py-12">
                <Card>
                    <CardHeader>
                        <CardTitle>School Approval Dashboard</CardTitle>
                        <CardDescription>Review and manage school applications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>School Name</TableHead>
                                    <TableHead>Admin Name</TableHead>
                                    <TableHead>Admin Email</TableHead>
                                    <TableHead>Admin Phone</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schools.map((school) => (
                                    <TableRow key={school.id}>
                                        <TableCell>{school.name}</TableCell>
                                        <TableCell>{school.admin.user.name}</TableCell>
                                        <TableCell>{school.admin.user.email}</TableCell>
                                        <TableCell>{school.admin.user.phone}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={() =>
                                                        router.post(route('admin.schools.approve', { school: school.id }))
                                                    }
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                        router.post(route('admin.schools.reject', { school: school.id }))
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.post(route('admin.schools.suspend', { school: school.id }))
                                                    }
                                                >
                                                    Suspend
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
