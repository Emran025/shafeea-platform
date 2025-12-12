import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

export default function AccountIndex() {
    const { auth, sessions, flash } = usePage().props;

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
                {/* Active Sessions */}
                <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Sessions</h2>
                        <div className="mt-4 space-y-4">
                            {sessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{session.ip_address}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Last active: {new Date(session.last_activity * 1000).toLocaleString()}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => router.delete(`/admin/account/sessions/${session.id}`, { preserveScroll: true })}
                                        variant="destructive"
                                    >
                                        Terminate
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
