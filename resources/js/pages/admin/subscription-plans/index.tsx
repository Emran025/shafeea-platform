import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageProps } from '@/types';
import { Edit, Star, TrendingUp, CheckCircle2, XCircle, List, Grid3x3, Package } from 'lucide-react';

interface SubscriptionPlan {
    id: number;
    name: string;
    slug: string;
    price: string;
    currency: string;
    billing_period: string;
    features: string[];
    is_recommended: boolean;
    sort_order: number;
    is_active: boolean;
}

interface PlansIndexProps extends PageProps {
    subscriptionPlans: SubscriptionPlan[];
}

export default function PlansIndex() {
    const { subscriptionPlans } = usePage<PlansIndexProps>().props;
    const [viewMode, setViewMode] = useState<'table' | 'grid'>(
        () => (typeof window !== 'undefined' && window.innerWidth < 768) ? 'grid' : 'table'
    );

    useEffect(() => {
        const handleResize = () => {
            setViewMode(window.innerWidth < 768 ? 'grid' : 'table');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const activeCount = subscriptionPlans?.filter(p => p.is_active).length || 0;
    const recommendedPlan = subscriptionPlans?.find(p => p.is_recommended);

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">إدارة الباقات</h1>
                        <p className="text-sm text-muted-foreground">
                            إدارة أسعار ومميزات باقات الاشتراك في المنصة
                        </p>
                    </div>
                    <div className="hidden md:flex border border-border rounded-lg overflow-hidden">
                        <Button
                            variant={viewMode === 'table' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('table')}
                            className="rounded-none border-0"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className="rounded-none border-0 border-r border-border"
                        >
                            <Grid3x3 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">إجمالي الباقات</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{subscriptionPlans?.length || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">الباقات النشطة</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{activeCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-amber-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">الأكثر طلباً</p>
                                    <p className="text-lg font-bold text-foreground mt-1 truncate">
                                        {recommendedPlan ? recommendedPlan.name : '—'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                    <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>



                {/* Content — Table View */}
                {viewMode === 'table' ? (
                    <Card className="overflow-hidden border-2 border-border/50 shadow-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-primary/5 dark:bg-primary/10 border-b-2 border-primary/20 hover:bg-primary/5">
                                        <TableHead className="px-5 py-3 text-xs font-bold text-foreground tracking-wider text-right">الباقة</TableHead>
                                        <TableHead className="px-5 py-3 text-xs font-bold text-foreground tracking-wider text-right">السعر</TableHead>
                                        <TableHead className="px-5 py-3 text-xs font-bold text-foreground tracking-wider text-right">الفترة</TableHead>
                                        <TableHead className="px-5 py-3 text-xs font-bold text-foreground tracking-wider text-right">المميزات</TableHead>
                                        <TableHead className="px-5 py-3 text-xs font-bold text-foreground tracking-wider text-right">الحالة</TableHead>
                                        <TableHead className="px-5 py-3 text-xs font-bold text-foreground tracking-wider text-right">الأكثر طلباً</TableHead>
                                        <TableHead className="px-5 py-3 text-xs font-bold text-foreground tracking-wider text-left">إجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subscriptionPlans?.length > 0 ? (
                                        subscriptionPlans.map((plan) => (
                                            <TableRow key={plan.id} className="hover:bg-muted/30 transition-colors group border-b border-border/50">
                                                <TableCell className="px-5 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${plan.is_recommended ? 'bg-primary/10' : 'bg-muted'}`}>
                                                            {plan.is_recommended
                                                                ? <Star className="w-4 h-4 text-primary" />
                                                                : <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                                            }
                                                        </div>
                                                        <span className="font-bold text-foreground">{plan.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-3 font-medium">
                                                    {plan.price} {plan.currency}
                                                </TableCell>
                                                <TableCell className="px-5 py-3">
                                                    {plan.billing_period === 'yearly' ? 'سنوي' : 'شهري'}
                                                </TableCell>
                                                <TableCell className="px-5 py-3">
                                                    <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px] block">
                                                        {plan.features.join('، ')}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-3">
                                                    <Badge
                                                        variant={plan.is_active ? 'default' : 'secondary'}
                                                        className={plan.is_active
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                                        }
                                                    >
                                                        {plan.is_active ? 'نشط' : 'غير نشط'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-5 py-3">
                                                    {plan.is_recommended ? (
                                                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                                                            <Star className="w-3 h-3 ml-1" />
                                                            نعم
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                            className="h-9 w-9 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                                        >
                                                            <Link href={route('admin.subscription-plans.edit', plan.id)} title="تعديل">
                                                                <Edit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                    <Package className="w-12 h-12 opacity-20" />
                                                    <p className="text-lg font-medium">لا توجد باقات</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                    </Card>
                ) : (
                    /* Content — Grid / Card View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                        {subscriptionPlans?.length > 0 ? (
                            subscriptionPlans.map((plan) => (
                                <Card
                                    key={plan.id}
                                    className={`group hover:shadow-xl transition-all duration-300 border-2 overflow-hidden
                                        ${plan.is_recommended
                                            ? 'border-primary/40 shadow-md shadow-primary/10'
                                            : 'border-border/50'
                                        }`}
                                >
                                    <CardContent className="p-0">
                                        {/* Card Header */}
                                        <div className={`p-5 ${plan.is_recommended ? 'bg-primary/5' : 'bg-muted/30'}`}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.is_recommended ? 'bg-primary/10' : 'bg-muted'}`}>
                                                    {plan.is_recommended
                                                        ? <Star className="w-5 h-5 text-primary" />
                                                        : <TrendingUp className="w-5 h-5 text-muted-foreground" />
                                                    }
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {plan.is_recommended && (
                                                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800 text-xs">
                                                            الأكثر طلباً
                                                        </Badge>
                                                    )}
                                                    <Badge
                                                        variant={plan.is_active ? 'default' : 'secondary'}
                                                        className={plan.is_active
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-xs'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 text-xs'
                                                        }
                                                    >
                                                        {plan.is_active ? 'نشط' : 'غير نشط'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                                            <div className="mt-1 flex items-baseline gap-1">
                                                <span className="text-2xl font-extrabold text-foreground">{plan.price}</span>
                                                <span className="text-sm text-muted-foreground">{plan.currency}</span>
                                                <span className="text-xs text-muted-foreground mr-1">
                                                    / {plan.billing_period === 'yearly' ? 'سنوياً' : 'شهرياً'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="p-5 space-y-3">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">المميزات</p>
                                            <ul className="space-y-2">
                                                {plan.features.slice(0, 4).map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                        <span className="line-clamp-2">{feature}</span>
                                                    </li>
                                                ))}
                                                {plan.features.length > 4 && (
                                                    <li className="text-xs text-muted-foreground pr-6">
                                                        +{plan.features.length - 4} ميزة إضافية
                                                    </li>
                                                )}
                                            </ul>
                                        </div>

                                        {/* Actions */}
                                        <div className="px-5 pb-5 pt-0 border-t border-border flex items-center justify-end pt-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                                className="h-9 w-9 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                            >
                                                <Link href={route('admin.subscription-plans.edit', plan.id)} title="تعديل">
                                                    <Edit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                    <Package className="w-16 h-16 opacity-20" />
                                    <p className="text-xl font-medium">لا توجد باقات</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}
