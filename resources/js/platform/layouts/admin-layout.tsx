import React, { useState, useEffect } from 'react';
import {
    Bell,
    Sun,
    Moon,
    LogOut,
    AlertTriangle,
    X,
} from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SharedData } from '@/types';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const isUnverified = !auth?.user?.email_verified_at;
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleResendVerification = () => {
        setResending(true);
        router.post(route('verification.send'), {}, {
            onFinish: () => setResending(false),
        });
    };

    return (
        <div className="flex h-screen min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset className="overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    {/* ── Email Verification Warning Banner ── */}
                    {isUnverified && !bannerDismissed && (
                        <div
                            className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                            style={{
                                background: 'linear-gradient(90deg, #78350f, #92400e)',
                                borderBottom: '1px solid rgba(251,191,36,0.3)',
                            }}
                        >
                            <div className="flex items-center gap-2 text-amber-200">
                                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>
                                    بريدك الإلكتروني غير مُفعَّل. تحقق من صندوق الوارد أو{' '}
                                    <button
                                        onClick={handleResendVerification}
                                        disabled={resending}
                                        className="underline font-semibold text-amber-300 hover:text-amber-100 disabled:opacity-60 transition-colors"
                                    >
                                        {resending ? 'جارٍ الإرسال…' : 'أعد إرسال رابط التفعيل'}
                                    </button>
                                </span>
                            </div>
                            <button
                                onClick={() => setBannerDismissed(true)}
                                className="text-amber-400 hover:text-amber-200 transition-colors shrink-0"
                                title="إغلاق"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-md">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger className="hover:bg-accent transition-colors" />
                            <div className="hidden md:block">
                                <h2 className="text-lg font-bold text-foreground">لوحة التحكم</h2>
                                <p className="text-xs text-muted-foreground">إدارة منصة شفيع</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Dark Mode Toggle Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleDarkMode}
                                className="hover:bg-accent transition-colors"
                                title={isDarkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </Button>

                            {/* Notifications */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative hover:bg-accent transition-colors"
                                title="الإشعارات"
                            >
                                <Bell className="w-5 h-5" />
                                <Badge className="absolute top-1 left-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white">
                                    3
                                </Badge>
                            </Button>
                            
                            {/* User Profile / Logout */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 hover:bg-accent transition-colors"
                                title="تسجيل الخروج"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden md:inline">تسجيل الخروج</span>
                            </Button>
                        </div>
                    </header>
                    
                    {/* Main Content Area */}
                    <main className="flex-1 bg-background p-4 sm:p-6 lg:p-8 overflow-auto h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}