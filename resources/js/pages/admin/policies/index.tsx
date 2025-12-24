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
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">السياسات والشروط</h1>
                    <p className="text-sm text-muted-foreground">إدارة شروط الاستخدام وسياسة الخصوصية</p>
                </div>

                <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <h2 className="text-xl font-bold text-foreground">شروط الاستخدام</h2>
                        {latestTerm && (
                            <Button asChild>
                                <Link href={`/admin/policies/edit/term/${latestTerm.version}`}>تعديل آخر إصدار</Link>
                            </Button>
                        )}
                    </div>
                    <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
                        <Accordion type="single" collapsible className="w-full">
                            {terms.map((term) => (
                                <AccordionItem value={`term-${term.version}`} key={term.version}>
                                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-foreground">
                                                    الإصدار {new Date(term.updated_at).toLocaleDateString('ar-SA')}
                                                </p>
                                                <p className={`text-xs mt-1 ${term.is_active ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                                                    {term.is_active ? 'نشط' : 'غير نشط'}
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

                <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <h2 className="text-xl font-bold text-foreground">سياسة الخصوصية</h2>
                        {latestPolicy && (
                             <Button asChild>
                                <Link href={`/admin/policies/edit/policy/${latestPolicy.version}`}>تعديل آخر إصدار</Link>
                            </Button>
                        )}
                    </div>
                    <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
                        <Accordion type="single" collapsible className="w-full">
                            {policies.map((policy) => (
                                <AccordionItem value={`policy-${policy.version}`} key={policy.version}>
                                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-foreground">
                                                    الإصدار {new Date(policy.updated_at).toLocaleDateString('ar-SA')}
                                                </p>
                                                <p className={`text-xs mt-1 ${policy.is_active ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                                                    {policy.is_active ? 'نشط' : 'غير نشط'}
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
