import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { PageProps, TermsOfUse, PrivacyPolicy } from '@/types';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import PolicyDisplay from '@/components/shared/policy-display';

interface PoliciesIndexProps extends PageProps {
    terms: TermsOfUse[];
    policies: PrivacyPolicy[];
}

export default function PoliciesIndex() {
    const { terms, policies } = usePage<PoliciesIndexProps>().props;

    const latestTerm = terms.length > 0 ? terms[0] : null;
    const latestPolicy = policies.length > 0 ? policies[0] : null;

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Policies and Terms</h1>

                <div className="mt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Terms of Use</h2>
                        {latestTerm && (
                            <Button asChild>
                                <Link href={`/admin/policies/edit/term/${latestTerm.version}`}>Edit Latest Version</Link>
                            </Button>
                        )}
                    </div>
                    <div className="mt-4 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <Accordion type="single" collapsible className="w-full">
                            {terms.map((term) => (
                                <AccordionItem value={`term-${term.version}`} key={term.version}>
                                    <AccordionTrigger className="px-6 py-4">
                                        <div className="flex items-center justify-between w-full">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Version {new Date(term.updated_at).toLocaleDateString()}
                                                </p>
                                                <p className={`text-xs text-left ${term.is_active ? 'text-green-500' : 'text-gray-500'}`}>
                                                    {term.is_active ? 'Active' : 'Inactive'}
                                                </p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4">
                                        <PolicyDisplay policy={term} type="terms" />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy Policy</h2>
                        {latestPolicy && (
                             <Button asChild>
                                <Link href={`/admin/policies/edit/policy/${latestPolicy.version}`}>Edit Latest Version</Link>
                            </Button>
                        )}
                    </div>
                    <div className="mt-4 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <Accordion type="single" collapsible className="w-full">
                            {policies.map((policy) => (
                                <AccordionItem value={`policy-${policy.version}`} key={policy.version}>
                                    <AccordionTrigger className="px-6 py-4">
                                        <div className="flex items-center justify-between w-full">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Version {new Date(policy.updated_at).toLocaleDateString()}
                                                </p>
                                                <p className={`text-xs text-left ${policy.is_active ? 'text-green-500' : 'text-gray-500'}`}>
                                                    {policy.is_active ? 'Active' : 'Inactive'}
                                                </p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4">
                                        <PolicyDisplay policy={policy} type="privacy" />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
