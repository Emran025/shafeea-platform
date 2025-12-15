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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">الــــــــــمدارس</h1>
                
                {/* Filters Section */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, admin, or registration number"
                            className="w-full md:w-80"
                        />
                        <Select onValueChange={(value) => setStatus(value)} value={status}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSearch}>Search</Button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="mt-8 rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>اسم المدرسة</TableHead>
                                <TableHead>المشرف</TableHead>
                                <TableHead>الحالة</TableHead>
                                <TableHead>إجراء</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schools?.data?.length > 0 ? (
                                schools.data.map((school) => (
                                    <TableRow key={school.id}>
                                        <TableCell className="font-medium">
                                            {school.name}
                                        </TableCell>
                                        <TableCell>
                                            {school.admin?.user?.name || 'No Admin'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                school.admin?.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                school.admin?.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                            }`}>
                                                {school.admin?.status || 'N/A'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link 
                                                href={`/admin/schools/${school.id}`} 
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                                            >
                                                View
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No schools found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
}