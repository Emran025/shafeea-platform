import React from 'react';
import {
    Bell,
    User,
} from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex h-screen min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <header className="flex items-center justify-between p-4 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
                        <div className="flex items-center gap-2">
                             <SidebarTrigger className="-ml-1" />
                        </div>

                        <div className="flex items-center">
                            <button className="text-muted-foreground hover:text-primary mr-4">
                                <Bell className="w-6 h-6" />
                            </button>
                            <div className="relative">
                                <button className="flex items-center text-foreground">
                                    <User className="w-6 h-6 mr-2" />
                                    <span>Admin</span>
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