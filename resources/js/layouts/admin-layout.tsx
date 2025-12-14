import React, { useState } from 'react';
import {
    Bell,
    LayoutDashboard ,
    Sun,
    Moon
} from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {

    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="flex h-screen min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset className="overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <header className="flex items-center justify-between p-4 bg-card/95 dark:bg-gray-700 backdrop-blur-lg border-b border-border shadow-sm">
                        <div className="flex items-center gap-2">
                             <SidebarTrigger className="-ml-1" />
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Dark Mode Toggle Button */}
                            <button
                                onClick={toggleDarkMode}
                                className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors duration-200"
                                title="تغيير المظهر"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <button className="text-muted-foreground hover:text-primary">
                                <Bell className="w-6 h-6" />
                            </button>
                            
                            <div className="relative">
                                <button className="flex items-center text-foreground mr-2">
                                    <LayoutDashboard  className="w-6 h-6 ml-2" />
                                    <span>الإشراف الـــعام</span>
                                </button>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 bg-background p-6 overflow-auto h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}