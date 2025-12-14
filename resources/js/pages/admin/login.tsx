import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import UAParser from 'ua-parser-js';
import GuestLayout from '@/layouts/guest-layout';
import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck } from 'lucide-react';

import { EmailInput } from '@/components/email-input'; 
import { PasswordInput } from '@/components/password-input'; 

export default function AdminLoginPage() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
        device_info: {},
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const parser = new UAParser();
        const result = parser.getResult();
        const deviceInfo = {
            device_id: `web-${crypto.randomUUID()}`,
            model: `${result.browser.name || ''} ${result.browser.major || ''}`.trim(),
            manufacturer: result.device.vendor || 'WebApp',
            os_version: `${result.os.name || ''} ${result.os.version || ''}`.trim(),
            app_version: result.browser.version,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            locale: navigator.language,
            fcm_token: null,
        };

        setData('device_info', deviceInfo);
        post('/admin/login');
    }

    return (
        <GuestLayout>
            <Head title="دخول المشرفين" />

            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
                <p className="text-sm text-muted-foreground mt-2">تسجيل دخول المشرفين والمسؤولين</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email Field */}
                <div>
                    <EmailInput
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        placeholder="admin@example.com"
                        autoComplete="username"
                    />
                </div>

                {/* Password Field */}
                <div>
                    <PasswordInput
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary/20 transition-colors cursor-pointer"
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors select-none">
                            تذكر تسجيلي
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <div>
                    <Button 
                        type="submit" 
                        disabled={processing} 
                        className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20"
                    >
                        {processing ? 'جاري الدخول...' : 'تسجيل الدخول'}
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}