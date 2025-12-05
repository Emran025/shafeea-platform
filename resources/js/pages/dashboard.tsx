import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import {
  Users,
  GraduationCap,
  BookOpen,
  UserPlus,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  User,
  Shield
} from 'lucide-react';

// Types for props
interface DashboardProps extends PageProps {
  kpis: {
    students: number;
    teachers: number;
    halaqahs: number;
    new_enrollments: number;
    avg_behavior: number;
    students_by_qualification: Array<{ qualification: string; total: number }>;
    students_by_gender: Array<{ gender: string; total: number }>;
    active_enrollments: number;
    admins: any[];
    scheduled_halaqahs: number;
  };
  charts: {
    studentsPerHalaqah: Array<{ id: number; name: string; enrollments_count: number }>;
    enrollmentTrends: Array<{ month: string; count: number }>;
    behaviorTrends: Array<{ date: string; avg_behavior: number }>;
    enrollmentStatus: Array<{ status: string; total: number }>;
    genderPerHalaqah: Array<{ halaqah: string; male: number; female: number }>;
  };
  tables: {
    halaqahs: any[];
    teachers: any[];
    students: any[];
    enrollments: any[];
    admins: any[];
  };
  notifications: any[];
  alerts: {
    fullHalaqahs: any[];
    lowBehaviorStudents: any[];
    upcomingSchedules: any[];
  };
}

// KPI Card Component
const KPICard = ({ title, value, icon: Icon, color, trend }: {
  title: string;
  value: number;
  icon: any;
  color: string;
  trend?: string;
}) => (
  <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 ${color}`}></div>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color.replace('text-', 'text-').replace('bg-', 'text-')}`} />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold">{value.toLocaleString()}</span>
        {trend && (
          <span className="text-sm text-green-600 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard({ kpis, charts, tables, notifications, alerts }: DashboardProps) {
  // Debug: Log the received data
  console.log('Dashboard data:', { kpis, charts, tables, notifications, alerts });

  // Add default values and error handling
  const defaultData = {
    kpis: {
      students: 0,
      teachers: 0,
      halaqahs: 0,
      new_enrollments: 0,
      avg_behavior: 0,
      students_by_qualification: [],
      students_by_gender: [],
      active_enrollments: 0,
      admins: [],
      scheduled_halaqahs: 0,
    },
    charts: {
      studentsPerHalaqah: [],
      enrollmentTrends: [],
      behaviorTrends: [],
      enrollmentStatus: [],
      genderPerHalaqah: [],
    },
    tables: {
      halaqahs: [],
      teachers: [],
      students: [],
      enrollments: [],
      admins: [],
    },
    notifications: [],
    alerts: {
      fullHalaqahs: [],
      lowBehaviorStudents: [],
      upcomingSchedules: [],
    },
  };

  // Use provided data or fall back to defaults
  const data = {
    kpis: kpis || defaultData.kpis,
    charts: charts || defaultData.charts,
    tables: tables || defaultData.tables,
    notifications: notifications || defaultData.notifications,
    alerts: alerts || defaultData.alerts,
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'لوحة التحكم', href: '/dashboard' }]}>
      <Head title="لوحة تحكم الإدارة" />
      <div className="flex flex-col gap-8 p-6 bg-gray-50 min-h-screen" dir="rtl">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600">مرحبًا بعودتك! إليك ما يحدث في مدرستك اليوم.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
          <KPICard
            title="إجمالي الطلاب"
            value={data.kpis.students}
            icon={Users}
            color="text-blue-600 bg-blue-600"
            trend="+12%"
          />
          <KPICard
            title="المعلمين"
            value={data.kpis.teachers}
            icon={GraduationCap}
            color="text-green-600 bg-green-600"
            trend="+5%"
          />
          <KPICard
            title="الحلقات "
            value={data.kpis.halaqahs}
            icon={BookOpen}
            color="text-purple-600 bg-purple-600"
          />
          <KPICard
            title="التحاق جديد"
            value={data.kpis.new_enrollments}
            icon={UserPlus}
            color="text-orange-600 bg-orange-600"
            trend="+8%"
          />
          <KPICard
            title="متوسط السلوك"
            value={data.kpis.avg_behavior}
            icon={TrendingUp}
            color="text-emerald-600 bg-emerald-600"
          />
          <KPICard
            title="التحاق نشط"
            value={data.kpis.active_enrollments}
            icon={Calendar}
            color="text-indigo-600 bg-indigo-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 pt-1">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>الطلاب في كل حلقة</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                {data.charts.studentsPerHalaqah.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.studentsPerHalaqah}>
                      <XAxis dataKey="name" className="text-sm" />
                      <YAxis className="text-sm" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="enrollments_count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>لا توجد بيانات متاحة</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 p-1">
            <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>اتجاهات الالتحاق (6 أشهر)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                {data.charts.enrollmentTrends.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.charts.enrollmentTrends}>
                      <XAxis dataKey="month" className="text-sm" />
                      <YAxis className="text-sm" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>لا توجد بيانات متاحة</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 p-1">
            <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-amber-50">
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-orange-600" />
                <span>التحاق حديث</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">الطالب</TableHead>
                    <TableHead className="font-semibold">الحلقة </TableHead>
                    <TableHead className="font-semibold">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.tables.enrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                        <UserPlus className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>لم يتم العثور على التحاق</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.tables.enrollments.slice(0, 5).map((enr: any) => (
                      <TableRow key={enr.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{enr.student?.user?.name || 'غير محدد'}</TableCell>
                        <TableCell>{enr.halaqah?.name || 'غير محدد'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={enr.status === 'active' ? 'default' : 'secondary'}
                            className={enr.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {enr.status === 'active' ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 p-1">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-violet-50">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span>المسؤولون</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">الاسم</TableHead>
                    <TableHead className="font-semibold">الأدوار</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.tables.admins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                        <Shield className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>لم يتم العثور على مسؤولين</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.tables.admins.slice(0, 5).map((admin: any) => (
                      <TableRow key={admin.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{admin.user?.name || 'غير محدد'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {admin.user?.roles?.map((r: any, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {r.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Notifications and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <span>الإشعارات</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {data.notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>لا توجد إشعارات</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.notifications.map((n: any) => (
                    <Alert key={n.id} className="border-l-4 border-l-blue-500 bg-blue-50">
                      <AlertTitle className="text-blue-900">{n.title || 'إشعار'}</AlertTitle>
                      <AlertDescription className="text-blue-700">{n.body || n.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="border-b bg-gradient-to-r from-red-50 to-pink-50">
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>تنبيهات النظام</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.alerts.fullHalaqahs.length > 0 && (
                  <Alert variant="destructive" className="border-l-4 border-l-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>الحلقات الممتلئة</AlertTitle>
                    <AlertDescription>
                      {data.alerts.fullHalaqahs.map((h: any) => h.name).join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
                {data.alerts.lowBehaviorStudents.length > 0 && (
                  <Alert className="border-l-4 border-l-yellow-500 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-900">طلاب منخفضو السلوك</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      {data.alerts.lowBehaviorStudents.map((s: any) => s.student?.user?.name).join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
                {data.alerts.upcomingSchedules.length > 0 && (
                  <Alert className="border-l-4 border-l-blue-500 bg-blue-50">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-900">الجداول القادمة</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      {data.alerts.upcomingSchedules.map((s: any) => s.title || s.id).join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
                {data.alerts.fullHalaqahs.length === 0 && data.alerts.lowBehaviorStudents.length === 0 && data.alerts.upcomingSchedules.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
                    <p>جميع الأنظمة تعمل</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
