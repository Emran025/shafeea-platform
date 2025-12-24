import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { 
    Users, GraduationCap, BookOpen, TrendingUp, 
    AlertTriangle, Bell
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { PageProps } from '@/types';
import { LucideIcon } from 'lucide-react';

// Define interfaces for the props
interface Kpis {
    students: number;
    new_enrollments: number;
    teachers: number;
    halaqahs: number;
    scheduled_halaqahs: number;
    avg_behavior: number;
}

interface EnrollmentTrend {
    month: string;
    count: number;
}

interface GenderDistribution {
    halaqah: string;
    male: number;
    female: number;
}

interface Charts {
    enrollmentTrends: EnrollmentTrend[];
    genderPerHalaqah: GenderDistribution[];
}

interface SimpleHalaqah {
    id: number;
    name: string;
}

interface StudentReport {
    id: number;
    behavior: number;
    student?: {
        user?: {
            name: string;
        };
    };
}

interface UpcomingSchedule {
    id: number;
    // Define other properties if available and needed
}

interface Alerts {
    fullHalaqahs: SimpleHalaqah[];
    lowBehaviorStudents: StudentReport[];
    upcomingSchedules: UpcomingSchedule[];
}

interface Notification {
    id: number;
    title?: string;
    message?: string;
    data?: {
        message: string;
    };
    created_at: string;
}

interface TableItem {
    name?: string;
    user?: {
        name: string;
        email?: string;
    };
    enrollments?: unknown[];
    qualification?: string;
}

interface Tables {
    halaqahs: TableItem[];
    teachers: TableItem[];
    students: TableItem[];
    [key: string]: TableItem[];
}

interface DashboardPageProps extends PageProps {
    kpis: Kpis;
    charts: Charts;
    notifications: Notification[];
    alerts: Alerts;
    tables: Tables;
}

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    color: string;
    subtext?: string;
}

// مكون بسيط للبطاقات (Stats Card) - Enhanced Professional Design
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
                {subtext && <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>}
            </div>
            <div className={`p-4 rounded-xl ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7 text-white" />
            </div>
        </div>
    </div>
);

export default function AdminDashboard() {
    const { kpis, charts, notifications, alerts, tables } = usePage<DashboardPageProps>().props;
    const [activeTab, setActiveTab] = useState('halaqahs');

    // تجهيز البيانات للرسم البياني (Trends)
    const trendData = charts.enrollmentTrends.map(item => ({
        name: item.month,
        students: item.count
    }));

    return (
        <AdminLayout>
            <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* 1. قسم الإحصائيات العلوية (KPIs) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="إجمالي الطلاب" 
                        value={kpis.students} 
                        icon={Users} 
                        color="bg-blue-500" 
                        subtext={`${kpis.new_enrollments} طالب جديد هذا الشهر`}
                    />
                    <StatCard 
                        title="إجمالي المعلمين" 
                        value={kpis.teachers} 
                        icon={GraduationCap} 
                        color="bg-green-500" 
                    />
                    <StatCard 
                        title="الحلقات النشطة" 
                        value={kpis.halaqahs} 
                        icon={BookOpen} 
                        color="bg-purple-500" 
                        subtext={`${kpis.scheduled_halaqahs} حصة مجدولة هذا الأسبوع`}
                    />
                    <StatCard 
                        title="متوسط السلوك" 
                        value={kpis.avg_behavior} 
                        icon={TrendingUp} 
                        color="bg-orange-500" 
                        subtext="من 5.0"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* 2. القسم الرئيسي (الرسوم البيانية) - يأخذ ثلثين المساحة */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Enrollment Trends Chart */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">اتجاهات التسجيل (آخر 6 أشهر)</h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                        <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                                        <YAxis stroke="#6B7280" fontSize={12} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                        />
                                        <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={3} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Data Tables Tabs */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="border-b border-gray-200 dark:border-gray-700 flex">
                                {[
                                    { key: 'halaqahs', label: 'الحلقات' },
                                    { key: 'teachers', label: 'المعلمين' },
                                    { key: 'students', label: 'الطلاب' }
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`px-6 py-4 text-sm font-medium focus:outline-none transition-colors ${
                                            activeTab === tab.key 
                                                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400' 
                                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        }`}
                                    >
                                        آخر {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="p-0 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الاسم</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">التفاصيل</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الحالة</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {/* عرض البيانات بناءً على التبويب المختار - فقط آخر 5 صفوف */}
                                        {tables[activeTab].slice(0, 5).map((item: TableItem, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {item.name || item.user?.name || 'غير متوفر'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {activeTab === 'halaqahs' && `${item.enrollments?.length || 0} طالب`}
                                                    {activeTab === 'teachers' && item.user?.email}
                                                    {activeTab === 'students' && item.qualification}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        نشط
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {tables[activeTab].length === 0 && (
                                    <div className="p-4 text-center text-gray-500">لا توجد بيانات متاحة</div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* 3. القسم الجانبي (التنبيهات والإشعارات) - يأخذ ثلث المساحة */}
                    <div className="space-y-8">
                        
                        {/* Alerts Section */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <AlertTriangle className="w-5 h-5 text-red-500 ml-2" />
                                يحتاج إلى انتباه
                            </h3>
                            <div className="space-y-4">
                                {alerts.fullHalaqahs.length > 0 && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">حلقات ممتلئة ({alerts.fullHalaqahs.length})</p>
                                        <ul className="mt-1 text-xs text-red-600 dark:text-red-400 list-disc list-inside">
                                            {alerts.fullHalaqahs.slice(0, 3).map((h: SimpleHalaqah) => <li key={h.id}>{h.name}</li>)}
                                        </ul>
                                    </div>
                                )}
                                
                                {alerts.lowBehaviorStudents.length > 0 && (
                                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
                                        <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">درجات سلوك منخفضة</p>
                                        <ul className="mt-1 text-xs text-orange-600 dark:text-orange-400 list-disc list-inside">
                                            {alerts.lowBehaviorStudents.slice(0, 3).map((report: StudentReport) => (
                                                <li key={report.id}>{report.student?.user?.name} ({report.behavior})</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {alerts.upcomingSchedules.length > 0 && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">الجداول القادمة (الـ 3 أيام القادمة)</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                            {alerts.upcomingSchedules.length} حصة مجدولة.
                                        </p>
                                    </div>
                                )}

                                {alerts.fullHalaqahs.length === 0 && alerts.lowBehaviorStudents.length === 0 && (
                                    <p className="text-sm text-green-600 dark:text-green-400">كل شيء يبدو جيداً!</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Notifications */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <Bell className="w-5 h-5 text-gray-500 ml-2" />
                                الإشعارات
                            </h3>
                            <div className="space-y-4">
                                {notifications.length > 0 ? (
                                    notifications.map((notif: Notification) => (
                                        <div key={notif.id} className="flex items-start pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full ml-3">
                                                <Bell className="w-3 h-3 text-blue-600 dark:text-blue-300" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{notif.title || 'إشعار النظام'}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message || notif.data?.message}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.created_at).toLocaleDateString('ar-SA')}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">لا توجد إشعارات جديدة.</p>
                                )}
                            </div>
                        </div>

                        {/* Gender Distribution Chart (Small) */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">توزيع الجنس</h3>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={charts.genderPerHalaqah.slice(0, 5)}> 
                                        {/* نعرض فقط أول 5 حلقات للحفاظ على المساحة */}
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis dataKey="halaqah" fontSize={10} hide />
                                        <Tooltip cursor={{fill: 'transparent'}} />
                                        <Legend />
                                        <Bar dataKey="male" stackId="a" fill="#3B82F6" name="Male" />
                                        <Bar dataKey="female" stackId="a" fill="#EC4899" name="Female" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}