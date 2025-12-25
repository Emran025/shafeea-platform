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
import { Edit, Star, TrendingUp } from 'lucide-react';

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

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">إدارة الباقات</h1>
                        <p className="text-sm text-muted-foreground">
                            إدارة أسعار ومميزات باقات الاشتراك في المنصة
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {subscriptionPlans.map((subscriptionPlan) => (
                        <Card key={subscriptionPlan.id} className={`border-l-4 ${subscriptionPlan.is_recommended ? 'border-l-primary shadow-md' : 'border-l-muted'}`}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">{subscriptionPlan.name}</p>
                                        <p className="text-xl font-bold text-foreground mt-1">{subscriptionPlan.price} {subscriptionPlan.currency}</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${subscriptionPlan.is_recommended ? 'bg-primary/10' : 'bg-muted'}`}>
                                        {subscriptionPlan.is_recommended ? <Star className="w-5 h-5 text-primary" /> : <TrendingUp className="w-5 h-5 text-muted-foreground" />}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="overflow-hidden border-2 border-border/50 shadow-lg">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold text-right">الباقة</TableHead>
                                    <TableHead className="font-semibold text-right">السعر</TableHead>
                                    <TableHead className="font-semibold text-right">الفترة</TableHead>
                                    <TableHead className="font-semibold text-right">المميزات</TableHead>
                                    <TableHead className="font-semibold text-right">الحالة</TableHead>
                                    <TableHead className="font-semibold text-right">الأكثر طلباً</TableHead>
                                    <TableHead className="text-left font-semibold">إجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptionPlans.map((subscriptionPlan) => (
                                    <TableRow key={subscriptionPlan.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-bold">{subscriptionPlan.name}</TableCell>
                                        <TableCell>{subscriptionPlan.price} {subscriptionPlan.currency}</TableCell>
                                        <TableCell>{subscriptionPlan.billing_period === 'yearly' ? 'سنوي' : 'شهري'}</TableCell>
                                        <TableCell>
                                            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                                {subscriptionPlan.features.join('، ')}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={subscriptionPlan.is_active ? "default" : "secondary"}>
                                                {subscriptionPlan.is_active ? 'نشط' : 'غير نشط'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {subscriptionPlan.is_recommended && (
                                                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                                    نعم
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                                className="h-9 w-9 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                            >
                                                <Link href={route('admin.subscriptionPlans.edit', subscriptionPlan.id)}>
                                                    <Edit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
