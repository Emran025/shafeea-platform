import React from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageProps, School, User, Document } from '@/types';
import { 
    Building2, UserCog, FileText, BarChart2, Phone, Mail, MapPin, 
    Download, Users, UserCheck, BookOpen, ArrowRight, CheckCircle, 
    XCircle, Pause, Play, Globe, Calendar, Clock
} from 'lucide-react';

// Enhanced type definitions to match the controller's output
interface SchoolWithDetails extends School {
    admin: {
        user: User & { documents: Document[] };
        status: string;
    };
    halaqahs_count: number;
    students_count: number;
    teachers_count: number;
    registration_number?: string;
}

interface SchoolShowProps extends PageProps {
    school: SchoolWithDetails;
}

// Helper component for displaying details in a consistent format
const DetailItem = ({ 
    label, 
    value, 
    children, 
    icon: Icon 
}: { 
    label: string; 
    value?: string | number | null; 
    children?: React.ReactNode;
    icon?: React.ElementType;
}) => {
    if (!value && !children) return null;
    return (
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            {Icon && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <dt className="text-sm font-semibold text-muted-foreground mb-1">{label}</dt>
                <dd className="text-sm font-medium text-foreground">
                    {children || value || <span className="text-muted-foreground">غير متوفر</span>}
                </dd>
            </div>
        </div>
    );
};

// Main component
export default function SchoolShow() {
    const { school } = usePage<SchoolShowProps>().props;
    const admin = school.admin.user;

    const handleApprove = () => {
        if (confirm('هل أنت متأكد من قبول هذه المدرسة؟')) {
            router.post(`/admin/schools/${school.id}/approve`, {}, { preserveScroll: true });
        }
    };

    const handleReject = () => {
        if (confirm('هل أنت متأكد من رفض هذه المدرسة؟ هذا القرار غير قابل للتراجع.')) {
            router.post(`/admin/schools/${school.id}/reject`, {}, { preserveScroll: true });
        }
    };

    const handleSuspend = () => {
        if (confirm('هل أنت متأكد من تعليق هذه المدرسة؟ سيتم تقييد وصولهم.')) {
            router.post(`/admin/schools/${school.id}/suspend`, {}, { preserveScroll: true });
        }
    };

    const handleReactivate = () => {
        if (confirm('هل أنت متأكد من إعادة تفعيل هذه المدرسة؟')) {
            router.post(`/admin/schools/${school.id}/approve`, {}, { preserveScroll: true });
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const statusConfig: Record<string, { bg: string; label: string; icon: React.ReactNode }> = {
            'accepted': {
                bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                label: 'مقبولة',
                icon: <CheckCircle className="w-4 h-4" />
            },
            'pending': {
                bg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                label: 'قيد الانتظار',
                icon: <Clock className="w-4 h-4" />
            },
            'rejected': {
                bg: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800',
                label: 'مرفوضة',
                icon: <XCircle className="w-4 h-4" />
            },
            'suspended': {
                bg: 'bg-gray-200 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border-gray-300 dark:border-gray-600',
                label: 'معلقة',
                icon: <Pause className="w-4 h-4" />
            }
        };

        const config = statusConfig[status] || {
            bg: 'bg-gray-100 text-gray-800',
            label: status,
            icon: null
        };

        return (
            <Badge variant="outline" className={`${config.bg} border font-semibold gap-1.5 px-3 py-1.5`}>
                {config.icon}
                {config.label}
            </Badge>
        );
    };
    
    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {school.logo && (
                            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-border shadow-lg">
                                <img 
                                    src={`/storage/${school.logo}`} 
                                    alt={`${school.name} Logo`} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
                                {school.name}
                            </h1>
                            <StatusBadge status={school.admin.status} />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {school.admin.status === 'pending' && (
                            <>
                                <Button onClick={handleApprove} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                                    <CheckCircle className="w-4 h-4" />
                                    قبول
                                </Button>
                                <Button onClick={handleReject} variant="destructive" className="gap-2">
                                    <XCircle className="w-4 h-4" />
                                    رفض
                                </Button>
                            </>
                        )}
                        {school.admin.status === 'accepted' && (
                            <Button onClick={handleSuspend} variant="destructive" className="gap-2">
                                <Pause className="w-4 h-4" />
                                تعليق
                            </Button>
                        )}
                        {school.admin.status === 'suspended' && (
                            <Button onClick={handleReactivate} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                                <Play className="w-4 h-4" />
                                إعادة التفعيل
                            </Button>
                        )}
                        <Button variant="outline" asChild className="gap-2">
                            <a href="/admin/schools">
                                <ArrowRight className="w-4 h-4" />
                                العودة
                            </a>
                        </Button>
                    </div>
                </div>
            
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* School Information */}
                        <Card className="border-2 border-border/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">معلومات المدرسة</CardTitle>
                                        <CardDescription>البيانات الأساسية للمدرسة</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <DetailItem 
                                    label="الاسم الرسمي" 
                                    value={school.name}
                                    icon={Building2}
                                />
                                <DetailItem 
                                    label="رقم الهاتف"
                                    icon={Phone}
                                >
                                    <a href={`tel:${school.phone}`} className="text-primary hover:underline flex items-center gap-2">
                                        {school.phone}
                                    </a>
                                </DetailItem>
                                <DetailItem 
                                    label="الدولة" 
                                    value={school.country}
                                    icon={Globe}
                                />
                                <DetailItem 
                                    label="المدينة" 
                                    value={school.city}
                                    icon={MapPin}
                                />
                                <DetailItem 
                                    label="العنوان" 
                                    value={school.address}
                                    icon={MapPin}
                                />
                                {school.location && (
                                    <DetailItem 
                                        label="الموقع على الخريطة"
                                        icon={MapPin}
                                    >
                                        <a 
                                            href={school.location} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-primary hover:underline flex items-center gap-2"
                                        >
                                            <MapPin className="w-4 h-4" />
                                            عرض على Google Maps
                                        </a>
                                    </DetailItem>
                                )}
                            </CardContent>
                        </Card>

                        {/* Uploaded Documents */}
                        <Card className="border-2 border-border/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">الوثائق المرفوعة</CardTitle>
                                        <CardDescription>الشهادات والتراخيص الرسمية</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {admin.documents && admin.documents.length > 0 ? (
                                    <div className="space-y-3">
                                        {admin.documents.map((doc) => (
                                            <div 
                                                key={doc.id} 
                                                className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 space-y-2">
                                                        <h4 className="font-semibold text-foreground">{doc.name}</h4>
                                                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                            <Badge variant="outline" className="text-xs">
                                                                {doc.certificate_type}
                                                            </Badge>
                                                            {doc.riwayah && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {doc.riwayah}
                                                                </Badge>
                                                            )}
                                                            {doc.issuing_date && (
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {doc.issuing_date}
                                                                </span>
                                                            )}
                                                            {doc.issuing_place && (
                                                                <span>{doc.issuing_place}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button asChild variant="outline" size="sm" className="gap-2">
                                                        <a 
                                                            href={`/storage/${doc.file_path}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            عرض/تحميل
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>لم يتم رفع أي وثائق</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Supervisor Information */}
                        <Card className="border-2 border-border/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                        <UserCog className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">معلومات المشرف</CardTitle>
                                        <CardDescription>بيانات مدير النظام</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <DetailItem 
                                    label="الاسم الكامل" 
                                    value={admin.name}
                                    icon={UserCog}
                                />
                                <DetailItem 
                                    label="البريد الإلكتروني"
                                    icon={Mail}
                                >
                                    <a href={`mailto:${admin.email}`} className="text-primary hover:underline flex items-center gap-2">
                                        {admin.email}
                                    </a>
                                </DetailItem>
                                <DetailItem 
                                    label="رقم الجوال"
                                    icon={Phone}
                                >
                                    <a href={`tel:${admin.phone_zone}${admin.phone}`} className="text-primary hover:underline flex items-center gap-2">
                                        {admin.phone_zone}{admin.phone}
                                    </a>
                                </DetailItem>
                                {admin.whatsapp && (
                                    <DetailItem 
                                        label="واتساب"
                                        icon={Phone}
                                    >
                                        <a 
                                            href={`https://wa.me/${admin.whatsapp_zone}${admin.whatsapp}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-primary hover:underline flex items-center gap-2"
                                        >
                                            {admin.whatsapp_zone}{admin.whatsapp}
                                        </a>
                                    </DetailItem>
                                )}
                                <DetailItem label="الجنس" value={admin.gender} />
                                <DetailItem label="تاريخ الميلاد" value={admin.birth_date} />
                                <DetailItem label="الدولة" value={admin.country} />
                                <DetailItem label="المدينة" value={admin.city} />
                                <DetailItem label="السكن" value={admin.residence} />
                            </CardContent>
                        </Card>

                        {/* Statistics */}
                        {(school.admin.status !== 'pending' && school.admin.status !== 'rejected') && (
                            <Card className="border-2 border-border/50 shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                            <BarChart2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">الإحصائيات التشغيلية</CardTitle>
                                            <CardDescription>إحصائيات المدرسة</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">الطلاب</p>
                                                <p className="text-2xl font-bold text-foreground">{school.students_count}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                                <UserCheck className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">المعلمون</p>
                                                <p className="text-2xl font-bold text-foreground">{school.teachers_count}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                                                <BookOpen className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">الحلقات</p>
                                                <p className="text-2xl font-bold text-foreground">{school.halaqahs_count}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
