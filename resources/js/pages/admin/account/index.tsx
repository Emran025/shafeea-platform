import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { type SharedData , PageProps  , Session} from '@/types';
import {
    Globe,
    Smartphone,
    ShieldCheck,
    Clock,
    Trash2,
} from 'lucide-react';
interface UserIndexProps extends PageProps {
    sessions:  Session[];
}

export default function AccountIndex() {
  
    const { sessions} = usePage<UserIndexProps>().props;
    const { auth , flash} = usePage<SharedData>().props;

    const { data: profileData, setData: setProfileData, put: updateProfile, processing: processingProfile, errors: profileErrors } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
    });

    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: processingPassword, errors: passwordErrors, reset: resetPasswordForm } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function handleProfileSubmit(e: React.FormEvent) {
        e.preventDefault();
        updateProfile('/admin/account/profile');
    }

    function handlePasswordSubmit(e: React.FormEvent) {
        e.preventDefault();
        updatePassword('/admin/account/password', {
            onSuccess: () => resetPasswordForm(),
        });
    }

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Account Management</h1>

                {flash?.success && (
                    <Alert className="mb-6 mt-4 animate-fade-in bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {/* Profile Information */}
                <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                        <form onSubmit={handleProfileSubmit} className="mt-6 space-y-6">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {profileErrors.name && <p className="mt-2 text-sm text-red-600">{profileErrors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData('email', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {profileErrors.email && <p className="mt-2 text-sm text-red-600">{profileErrors.email}</p>}
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processingProfile}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Update Password */}
                <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Password</h2>
                        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-6">
                            <div>
                                <Label htmlFor="current_password">Current Password</Label>
                                <Input
                                    id="current_password"
                                    type="password"
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData('current_password', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {passwordErrors.current_password && <p className="mt-2 text-sm text-red-600">{passwordErrors.current_password}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {passwordErrors.password && <p className="mt-2 text-sm text-red-600">{passwordErrors.password}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={passwordData.password_confirmation}
                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processingPassword}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Two-Factor Authentication (Coming Soon) */}
                {/*
                <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
                        <div className="mt-4 text-gray-600 dark:text-gray-400">
                            <p>
                                Add an extra layer of security to your account by enabling two-factor authentication.
                            </p>
                            <div className="mt-6">
                                <button
                                    // onClick={handleEnableTwoFactor}
                                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Enable 2FA (Coming Soon)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                */}
                {/* Active Sessions */}{/* Active Sessions */}
                <div className="mt-8 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Sessions</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage and view your active sessions on other devices.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {sessions.map((session, index) => (
                                <div 
                                    key={session.device_id || index} 
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500/30 hover:bg-blue-50/30 dark:hover:bg-gray-700/30 transition-all duration-200"
                                >
                                    {/* Device Info Side */}
                                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                                        {/* Dynamic Icon based on OS or generic */}
                                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <Smartphone className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                        </div>

                                        <div className="space-y-1">
                                            {/* Primary Identifier: Model & Manufacturer */}
                                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                {session.manufacturer ? session.manufacturer.charAt(0).toUpperCase() + session.manufacturer.slice(1) : ''} {session.model || 'Unknown Device'}
                                                {/* Optional: Add 'Current Device' badge if applicable logic exists */}
                                            </h3>

                                            {/* Secondary Tech Details: OS & App Version */}
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/50">
                                                    {session.os_version || 'Unknown OS'}
                                                </span>
                                                <span>•</span>
                                                <span>App v{session.app_version || '?'}</span>
                                            </div>

                                            {/* Context Details: Time & Location (Timezone) */}
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                <span title={session.login_time ? new Date(session.login_time).toString() : ''}>
                                                    {session.login_time 
                                                        ? new Intl.DateTimeFormat('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric', 
                                                            hour: 'numeric', 
                                                            minute: 'numeric', 
                                                            hour12: true 
                                                          }).format(new Date(session.login_time))
                                                        : 'Unknown Time'}
                                                </span>
                                                {session.timezone && (
                                                    <>
                                                        <span>•</span>
                                                        <Globe className="w-3 h-3" />
                                                        <span>{session.timezone}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Side */}
                                    <div className="flex items-center">
                                        <Button
                                            onClick={() => router.delete(`/admin/account/sessions/${session.device_id}`, { preserveScroll: true })}
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm h-10 px-4 rounded-lg w-full sm:w-auto transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Revoke Access
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            
                            {sessions.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                                        <ShieldCheck className="w-6 h-6 opacity-50" />
                                    </div>
                                    <p>No active sessions found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
