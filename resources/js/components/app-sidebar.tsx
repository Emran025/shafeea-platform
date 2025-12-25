import * as React from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Settings,
    HelpCircle,
    FileText,
    Grid3x3,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';

// --- Configuration ---

/**
 * Main navigation items for the Admin Panel.
 * All items are in Arabic for consistency with the platform.
 */
const adminNavItems: NavItem[] = [
    {
        title: 'لوحة التحكم',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'المدارس',
        href: '/admin/schools',
        icon: Users,
    },
    {
        title: 'الدعم والمساعدة',
        href: '/admin/inquiries',
        icon: HelpCircle,
    },
    {
        title: 'الخدمات',
        href: '/admin/services',
        icon: Grid3x3,
    },
    {
        title: 'السياسات والشروط',
        href: '/admin/policies',
        icon: FileText,
    },
    {
        title: 'الإعدادات',
        href: '/admin/account',
        icon: Settings,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar 
            collapsible="icon" 
            variant="inset" 
            side="right" 
            {...props}
        >
            {/* 
                1. Header Section
                Enhanced with gradient background and modern styling matching public site
            */}
            <SidebarHeader className="bg-gradient-to-br from-primary via-primary to-primary/90 p-4 border-b border-primary-foreground/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg" 
                            asChild 
                            className="group-data-[collapsible=icon]:!p-0 hover:bg-primary-foreground/10 transition-all duration-300"
                        >
                            <Link href="/admin" prefetch className="flex items-center gap-3 group">
                                {/* Enhanced Logo Container with shadow and hover effects */}
                                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-white overflow-hidden">
                                    <img 
                                        src="/logo.png" 
                                        alt="شعار شفيع" 
                                        className="size-7 object-contain" 
                                    />
                                </div>
                                {/* Text Info with Arabic styling */}
                                <div className="grid flex-1 text-right text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="truncate font-bold text-lg text-primary-foreground">شفيع</span>
                                    <span className="truncate text-xs text-primary-foreground/80 font-medium">لوحة التحكم</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* 
                2. Main Content Section
                Renders the primary navigation links with enhanced styling
            */}
            <SidebarContent className="p-2">
                <NavMain items={adminNavItems} />
            </SidebarContent>
            
            {/* Adds the resize handle for the sidebar */}
            <SidebarRail />
        </Sidebar>
    );
}