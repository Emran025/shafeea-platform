import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageProps, TermsOfUse, PrivacyPolicy } from '@/types';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import PolicyDisplay from '@/components/shared/policy-display';
import { FileText, Shield, Edit, Calendar, CheckCircle, XCircle, FileCheck, Lock } from 'lucide-react';

interface PoliciesIndexProps extends PageProps {
    terms: TermsOfUse[];
    policies: PrivacyPolicy[];
}

export default function PoliciesIndex() {
    const { terms, policies } = usePage<PoliciesIndexProps>().props;

    const latestTerm = terms.length > 0 ? terms[0] : null;
    const latestPolicy = policies.length > 0 ? policies[0] : null;

    const activeTerms = terms.filter(t => t.is_active).length;
    const activePolicies = policies.filter(p => p.is_active).length;

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">السياسات والشروط</h1>
                    <p className="text-sm text-muted-foreground">
                        إدارة شروط الاستخدام وسياسة الخصوصية
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">إجمالي إصدارات الشروط</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{terms.length}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {activeTerms} نشط
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">إجمالي إصدارات السياسة</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{policies.length}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {activePolicies} نشط
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Terms of Use Section */}
                <Card className="border-2 border-border/50 shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">شروط الاستخدام</CardTitle>
                                    <CardDescription>إدارة إصدارات شروط الاستخدام</CardDescription>
                                </div>
                            </div>
                            {latestTerm && (
                                <Button asChild className="gap-2">
                                    <Link href={`/admin/policies/edit/term/${latestTerm.version}`}>
                                        <Edit className="w-4 h-4" />
                                        تعديل آخر إصدار
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {terms.length > 0 ? (
                            <Accordion type="single" collapsible className="w-full">
                                {terms.map((term) => (
                                    <AccordionItem 
                                        value={`term-${term.version}`} 
                                        key={term.version}
                                        className="border-b border-border"
                                    >
                                        <AccordionTrigger className="px-4 py-4 hover:bg-muted/50 rounded-lg transition-colors">
                                            <div className="flex items-center justify-between w-full mr-4">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                        <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div className="text-right flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <p className="text-base font-bold text-foreground">
                                                                الإصدار {term.version}
                                                            </p>
                                                            {term.is_active && (
                                                                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                                                                    <CheckCircle className="w-3 h-3 ml-1" />
                                                                    نشط
                                                                </Badge>
                                                            )}
                                                            {!term.is_active && (
                                                                <Badge variant="secondary">
                                                                    <XCircle className="w-3 h-3 ml-1" />
                                                                    غير نشط
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>
                                                                {new Date(term.updated_at).toLocaleDateString('ar-SA', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                                                <PolicyDisplay policy={term} type="terms" />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <FileText className="w-16 h-16 mx-auto mb-3 opacity-20" />
                                <p className="text-lg font-medium">لا توجد إصدارات</p>
                                <p className="text-sm">ابدأ بإنشاء إصدار جديد</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Privacy Policy Section */}
                <Card className="border-2 border-border/50 shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">سياسة الخصوصية</CardTitle>
                                    <CardDescription>إدارة إصدارات سياسة الخصوصية</CardDescription>
                                </div>
                            </div>
                            {latestPolicy && (
                                <Button asChild className="gap-2">
                                    <Link href={`/admin/policies/edit/policy/${latestPolicy.version}`}>
                                        <Edit className="w-4 h-4" />
                                        تعديل آخر إصدار
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {policies.length > 0 ? (
                            <Accordion type="single" collapsible className="w-full">
                                {policies.map((policy) => (
                                    <AccordionItem 
                                        value={`policy-${policy.version}`} 
                                        key={policy.version}
                                        className="border-b border-border"
                                    >
                                        <AccordionTrigger className="px-4 py-4 hover:bg-muted/50 rounded-lg transition-colors">
                                            <div className="flex items-center justify-between w-full mr-4">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                                        <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <div className="text-right flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <p className="text-base font-bold text-foreground">
                                                                الإصدار {policy.version}
                                                            </p>
                                                            {policy.is_active && (
                                                                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                                                                    <CheckCircle className="w-3 h-3 ml-1" />
                                                                    نشط
                                                                </Badge>
                                                            )}
                                                            {!policy.is_active && (
                                                                <Badge variant="secondary">
                                                                    <XCircle className="w-3 h-3 ml-1" />
                                                                    غير نشط
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>
                                                                {new Date(policy.updated_at).toLocaleDateString('ar-SA', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                                                <PolicyDisplay policy={policy} type="privacy" />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <Shield className="w-16 h-16 mx-auto mb-3 opacity-20" />
                                <p className="text-lg font-medium">لا توجد إصدارات</p>
                                <p className="text-sm">ابدأ بإنشاء إصدار جديد</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
