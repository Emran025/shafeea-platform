import React from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageProps, School, User, Document } from '@/types';
import { Building2, UserCog, FileText, BarChart2, Phone, Mail, MapPin, Download, Users, UserCheck, BookOpen } from 'lucide-react';

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

// Helper component for displaying details in a consistent grid
const DetailItem = ({ label, value, children }: { label: string; value?: string | number | null; children?: React.ReactNode }) => {
    if (!value && !children) return null;
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 py-3 px-4 even:bg-gray-50 dark:even:bg-gray-800/50 rounded-md">
            <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white md:mt-0 md:col-span-2">
                {children || value || <span className="text-gray-400 dark:text-gray-500">Not provided</span>}
            </dd>
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
        const baseClasses = "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full";
        let statusClasses = "";
        let statusText = status;

        switch (status) {
            case 'accepted':
                statusClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
                statusText = 'Active';
                break;
            case 'pending':
                statusClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
                statusText = 'Pending Review';
                break;
            case 'rejected':
                statusClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
                statusText = 'Rejected';
                break;
            case 'suspended':
                statusClasses = 'bg-gray-200 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
                statusText = 'Suspended';
                break;
            default:
                statusClasses = 'bg-gray-100 text-gray-800';
        }

        return <span className={`${baseClasses} ${statusClasses}`}>{statusText}</span>;
    };
    
    return (
        <AdminLayout>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {school.logo && (
                        <img src={`/storage/${school.logo}`} alt={`${school.name} Logo`} className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{school.name}</h1>
                    <StatusBadge status={school.admin.status} />
                </div>
                <div className="flex gap-4">
                    {school.admin.status === 'pending' && (
                        <>
                            <Button onClick={handleApprove} variant="default">
                                قبول
                            </Button>
                            <Button onClick={handleReject} variant="destructive">
                                رفض
                            </Button>
                        </>
                    )}
                    {school.admin.status === 'accepted' && (
                        <Button onClick={handleSuspend} variant="destructive">
                            تعليق
                        </Button>
                    )}
                    {school.admin.status === 'suspended' && (
                        <Button onClick={handleReactivate} variant="default">
                            إعادة التفعيل
                        </Button>
                    )}
                </div>
            </div>
            
        
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* --- School Information --- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center space-x-4">
                            <Building2 className="w-6 h-6 text-primary" />
                            <CardTitle>School Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <DetailItem label="Official Name" value={school.name} />
                            <DetailItem label="Contact Phone">
                                <a href={`tel:${school.phone}`} className="text-primary hover:underline flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> {school.phone}
                                </a>
                            </DetailItem>
                            <DetailItem label="Country" value={school.country} />
                            <DetailItem label="City" value={school.city} />
                            <DetailItem label="Address" value={school.address} />
                            <DetailItem label="Location on Map">
                                <a href={school.location} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> View on Google Maps
                                </a>
                            </DetailItem>
                        </CardContent>
                    </Card>

                    {/* --- Uploaded Documents --- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center space-x-4">
                            <FileText className="w-6 h-6 text-primary" />
                            <CardTitle>Uploaded Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                             {admin.documents && admin.documents.length > 0 ? (
                                <ul className="space-y-4">
                                    {admin.documents.map((doc) => (
                                        <li key={doc.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{doc.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Type: {doc.certificate_type}
                                                    {doc.riwayah && ` | Riwayah: ${doc.riwayah}`}
                                                    {doc.issuing_date && ` | Issued: ${doc.issuing_date}`}
                                                </p>
                                            </div>
                                            <Button asChild variant="outline" size="sm">
                                                <a href={`/storage/${doc.file_path}`} target="_blank" rel="noopener noreferrer">
                                                    <Download className="w-4 h-4 mr-2" /> View/Download
                                                </a>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No documents were uploaded.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* --- Supervisor Information --- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center space-x-4">
                            <UserCog className="w-6 h-6 text-primary" />
                            <CardTitle>School admin Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <DetailItem label="Full Name" value={admin.name} />
                            <DetailItem label="Email Address">
                                <a href={`mailto:${admin.email}`} className="text-primary hover:underline flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> {admin.email}
                                </a>
                            </DetailItem>
                             <DetailItem label="Phone Number">
                                <a href={`tel:${admin.phone_zone}${admin.phone}`} className="text-primary hover:underline flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> {admin.phone_zone}{admin.phone}
                                </a>
                            </DetailItem>
                            <DetailItem label="WhatsApp">
                                <a href={`https://wa.me/${admin.whatsapp_zone}${admin.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                                   <Phone className="w-4 h-4" /> {admin.whatsapp_zone}{admin.whatsapp}
                                </a>
                            </DetailItem>
                            <DetailItem label="Gender" value={admin.gender} />
                            <DetailItem label="Date of Birth" value={admin.birth_date} />
                            <DetailItem label="Country" value={admin.country} />
                            <DetailItem label="City" value={admin.city} />
                            <DetailItem label="Residence" value={admin.residence} />
                        </CardContent>
                    </Card>

                     {/* --- Conditional Statistics --- */}
                    {(school.admin.status !== 'pending' && school.admin.status !== 'rejected') && (
                        <Card>
                            <CardHeader className="flex flex-row items-center space-x-4">
                                <BarChart2 className="w-6 h-6 text-primary" />
                                <CardTitle>Operational Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-blue-500" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Students</span>
                                    </div>
                                    <span className="font-bold text-lg text-gray-900 dark:text-white">{school.students_count}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <UserCheck className="w-5 h-5 text-green-500" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Teachers</span>
                                    </div>
                                    <span className="font-bold text-lg text-gray-900 dark:text-white">{school.teachers_count}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-5 h-5 text-purple-500" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Halaqas</span>
                                    </div>
                                    <span className="font-bold text-lg text-gray-900 dark:text-white">{school.halaqahs_count}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
