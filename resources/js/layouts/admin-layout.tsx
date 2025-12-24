import React, { useState, useEffect } from 'react';
import {
    Bell,
    Sun,
    Moon,
    LogOut,
} from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check initial dark mode state
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="flex h-screen min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset className="overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Enhanced Header with gradient and modern styling */}
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