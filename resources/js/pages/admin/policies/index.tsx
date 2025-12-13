import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { PageProps, Term, Policy } from '@/types';

interface PoliciesIndexProps extends PageProps {
    terms: (Term & { version: string; last_updated: string })[];
    policies: (Policy & { version: string; last_updated: string })[];
}

export default function PoliciesIndex() {
    const { terms, policies } = usePage<PoliciesIndexProps>().props;

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Policies and Terms</h1>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Terms of Use</h2>
                    <div className="mt-4 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {terms.map((term) => (
                                <li key={term.version} className="px-6 py-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            Version {new Date(term.last_updated).toLocaleDateString()}
                                        </p>
                                        <p className={`text-xs ${term.is_active ? 'text-green-500' : 'text-gray-500'}`}>
                                            {term.is_active ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                    <Button asChild>
                                        <Link href={`/admin/policies/terms/${term.version}/edit`}>Edit</Link>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy Policy</h2>
                    <div className="mt-4 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {policies.map((policy) => (
                                <li key={policy.version} className="px-6 py-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            Version {new Date(policy.last_updated).toLocaleDateString()}
                                        </p>
                                        <p className={`text-xs ${policy.is_active ? 'text-green-500' : 'text-gray-500'}`}>
                                            {policy.is_active ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                    <Button asChild>
                                        <Link href={`/admin/policies/privacy/${policy.version}/edit`}>Edit</Link>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
