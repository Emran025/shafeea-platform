import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Settings,
    HelpCircle,
    FileText,
    Bell,
    User,
    Menu,
    X,
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigationItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Schools', href: '/admin/schools', icon: Users },
        { name: 'Advanced Schools', href: '/admin/schools/pending', icon: Users },
        { name: 'Inquiries', href: '/admin/inquiries', icon: HelpCircle },
        { name: 'Policies', href: '/admin/policies', icon: FileText },
        { name: 'Account', href: '/admin/account', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <div className="flex h-screen">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 right-0 z-50 w-64 bg-card border-l border-border shadow-lg transform ${
                        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex-shrink-0`}
                >
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <Link href="/admin" className="flex items-center gap-2 group hover-lift">
                            <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
                                <img src="/logo.png" alt="Shafeea Logo" className="w-10 h-10 object-contain" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    Admin Panel
                                </h1>
                            </div>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="py-4">
                        <ul>
                            {navigationItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center px-4 py-2 text-foreground hover:bg-secondary hover:text-primary transition-colors duration-200"
                                    >
                                        <item.icon className="w-5 h-5 ml-3 text-muted-foreground" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="flex items-center justify-between p-4 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
                        <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground lg:hidden">
                            <Menu className="w-6 h-6" />
                        </button>
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
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
