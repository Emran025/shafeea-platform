import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  UsersIcon,
  AcademicCapIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  HomeIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import AppLayout from '@/layouts/app-layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer } from 'recharts';

interface School {
  id: number;
  name: string;
  phone: string;
  country: string;
  city: string;
  location: string;
  address: string;
  logo?: string;
  created_at: string;
  users: User[];
  halaqahs: Halaqah[];
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Halaqah {
    id: number;
    name: string;
}

interface AnalyticsData {
    monthly_enrollments: { month: string; count: number }[];
    gender_distribution: { name: string; count: number }[];
    halaqah_performance: { name: string; students_count: number }[];
}

interface Stats {
  total_users: number;
  total_students: number;
  total_teachers: number;
  total_admins: number;
  total_halaqahs: number;
  active_halaqahs: number;
}

interface Props {
  school: School;
  stats: Stats;
}

export default function Show({ school, stats }: Props) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
        try {
            const response = await fetch(route('schools.analytics', school.id));
            const data = await response.json();
            setAnalyticsData(data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        }
    };
    fetchAnalytics();
  }, [school.id]);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      router.delete(route('schools.destroy', school.id));
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <AppLayout>
      <Head title={`${school.name} - School Details`} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={route('schools.index')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Schools
          </Link>
        </div>

        {/* School Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  {school.logo ? (
                    <img 
                      src={school.logo} 
                      alt={school.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{school.name}</h1>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{school.location}, {school.city}, {school.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4" />
                      <span>{school.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>Created {new Date(school.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link
                  href={route('schools.edit', school.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit School
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {stats.total_students} students, {stats.total_teachers} teachers, {stats.total_admins} admins
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Halaqahs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_halaqahs}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {stats.active_halaqahs} active halaqahs
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_halaqahs > 0 ? Math.round((stats.active_halaqahs / stats.total_halaqahs) * 100) : 0}%
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Halaqahs activity rate
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg per Halaqah</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_halaqahs > 0 ? Math.round(stats.total_students / stats.total_halaqahs) : 0}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Students per halaqah
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        {analyticsData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Enrollments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Enrollments</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={analyticsData.monthly_enrollments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gender Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={analyticsData.gender_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.gender_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Halaqah Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Halaqah Performance</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={analyticsData.halaqah_performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students_count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Address Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Country</span>
              </div>
              <p className="text-gray-900">{school.country}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">City</span>
              </div>
              <p className="text-gray-900">{school.city}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Location</span>
              </div>
              <p className="text-gray-900">{school.location}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Phone</span>
              </div>
              <p className="text-gray-900">{school.phone}</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-1">
              <HomeIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Full Address</span>
            </div>
            <p className="text-gray-900">{school.address}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
