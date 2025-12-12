import React from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function SchoolShow() {
    const { school } = usePage().props;

    const handleSuspend = () => {
        if (confirm('Are you sure you want to suspend this school?')) {
            router.post(`/admin/schools/${school.id}/suspend`, {}, { preserveScroll: true });
        }
    };

    const handleReactivate = () => {
        if (confirm('Are you sure you want to reactivate this school?')) {
            router.post(`/admin/schools/${school.id}/approve`, {}, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{school.name}</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">School Details</p>
                        </div>
                        <div className="flex gap-4">
                            {school.admin.status !== 'suspended' ? (
                                <Button onClick={handleSuspend} variant="destructive">
                                    Suspend
                                </Button>
                            ) : (
                                <Button onClick={handleReactivate} variant="default">
                                    Reactivate
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700">
                        <dl>
                            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">School Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{school.name}</dd>
                            </div>
                            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Administrator</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{school.admin.user.name}</dd>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        school.admin.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                        school.admin.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {school.admin.status}
                                    </span>
                                </dd>
                            </div>
                            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Number</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{school.registration_number}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
