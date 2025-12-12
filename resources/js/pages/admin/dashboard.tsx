import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { 
    Users, GraduationCap, BookOpen, TrendingUp, 
    AlertTriangle, Bell, Calendar, UserCheck 
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from 'recharts';

// مكون بسيط للبطاقات (Stats Card)
const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);

export default function AdminDashboard() {
    const { kpis, charts, notifications, alerts, tables } = usePage().props;
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
                        title="Total Students" 
                        value={kpis.students} 
                        icon={Users} 
                        color="bg-blue-500" 
                        subtext={`${kpis.new_enrollments} new this month`}
                    />
                    <StatCard 
                        title="Total Teachers" 
                        value={kpis.teachers} 
                        icon={GraduationCap} 
                        color="bg-green-500" 
                    />
                    <StatCard 
                        title="Active Halaqahs" 
                        value={kpis.halaqahs} 
                        icon={BookOpen} 
                        color="bg-purple-500" 
                        subtext={`${kpis.scheduled_halaqahs} scheduled this week`}
                    />
                    <StatCard 
                        title="Avg Behavior" 
                        value={kpis.avg_behavior} 
                        icon={TrendingUp} 
                        color="bg-orange-500" 
                        subtext="Out of 5.0 scale"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* 2. القسم الرئيسي (الرسوم البيانية) - يأخذ ثلثين المساحة */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Enrollment Trends Chart */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enrollment Trends (Last 6 Months)</h3>
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
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="border-b border-gray-200 dark:border-gray-700 flex">
                                {['halaqahs', 'teachers', 'students'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-4 text-sm font-medium capitalize focus:outline-none transition-colors ${
                                            activeTab === tab 
                                            ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400' 
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        }`}
                                    >
                                        Latest {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="p-0 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {/* عرض البيانات بناءً على التبويب المختار - فقط آخر 5 صفوف */}
                                        {tables[activeTab].slice(0, 5).map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {item.name || item.user?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {activeTab === 'halaqahs' && `${item.enrollments?.length || 0} Students`}
                                                    {activeTab === 'teachers' && item.user?.email}
                                                    {activeTab === 'students' && item.qualification}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        Active
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {tables[activeTab].length === 0 && (
                                    <div className="p-4 text-center text-gray-500">No data available</div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* 3. القسم الجانبي (التنبيهات والإشعارات) - يأخذ ثلث المساحة */}
                    <div className="space-y-8">
                        
                        {/* Alerts Section */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                                Attention Required
                            </h3>
                            <div className="space-y-4">
                                {alerts.fullHalaqahs.length > 0 && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">Full Halaqahs ({alerts.fullHalaqahs.length})</p>
                                        <ul className="mt-1 text-xs text-red-600 dark:text-red-400 list-disc list-inside">
                                            {alerts.fullHalaqahs.slice(0, 3).map(h => <li key={h.id}>{h.name}</li>)}
                                        </ul>
                                    </div>
                                )}
                                
                                {alerts.lowBehaviorStudents.length > 0 && (
                                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
                                        <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Low Behavior Score</p>
                                        <ul className="mt-1 text-xs text-orange-600 dark:text-orange-400 list-disc list-inside">
                                            {alerts.lowBehaviorStudents.slice(0, 3).map(report => (
                                                <li key={report.id}>{report.student?.user?.name} ({report.behavior})</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {alerts.upcomingSchedules.length > 0 && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Upcoming Schedules (Next 3 Days)</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                            {alerts.upcomingSchedules.length} sessions scheduled.
                                        </p>
                                    </div>
                                )}

                                {alerts.fullHalaqahs.length === 0 && alerts.lowBehaviorStudents.length === 0 && (
                                    <p className="text-sm text-green-600 dark:text-green-400">Everything looks good!</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Notifications */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Bell className="w-5 h-5 text-gray-500 mr-2" />
                                Notifications
                            </h3>
                            <div className="space-y-4">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div key={notif.id} className="flex items-start pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                                                <Bell className="w-3 h-3 text-blue-600 dark:text-blue-300" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{notif.title || 'System Notification'}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message || notif.data?.message}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No new notifications.</p>
                                )}
                            </div>
                        </div>

                        {/* Gender Distribution Chart (Small) */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gender Distribution</h3>
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