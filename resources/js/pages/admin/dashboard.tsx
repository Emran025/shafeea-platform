import React from 'react';
import AdminLayout from '@/layouts/admin-layout';

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome to the admin dashboard!</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
