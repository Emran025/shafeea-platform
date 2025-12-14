import * as React from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Settings,
    HelpCircle,
    FileText,
    Folder,
    BookOpen
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { NavFooter } from '@/components/nav-footer';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
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
 * Mapped from the previous sidebar structure.
 */
const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Schools',
        href: '/admin/schools',
        icon: Users,
    },
    {
        title: 'Advanced Schools',
        href: '/admin/schools/pending',
        icon: Users, // You might want to use 'UserPlus' or similar here to differentiate
    },
    {
        title: 'Inquiries',
        href: '/admin/inquiries',
        icon: HelpCircle,
    },
    {
        title: 'Policies',
        href: '/admin/policies',
        icon: FileText,
    },
    {
        title: 'Account',
        href: '/admin/account',
        icon: Settings,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    // Mock user data for the NavUser component (Replace with actual auth data)

    return (
        <Sidebar 
            collapsible="icon" 
            variant="inset" 
            side="right" 
            {...props}
        >
            {/* 
                1. Header Section
                Contains the Logo and Title. Wraps in SidebarMenuButton to handle 
                collapsing gracefully (icon mode shows logo only).
            */}
            <SidebarHeader>
                <SidebarMenu >
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="group-data-[collapsible=icon]:!p-0">
                            <Link href="/admin" prefetch className="flex items-center gap-2">
                                {/* Logo Container */}
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white shadow-sm border border-gray-100 text-sidebar-primary-foreground">
                                    <img 
                                        src="/logo.png" 
                                        alt="Shafeea Logo" 
                                        className="size-6 object-contain" 
                                    />
                                </div>
                                {/* Text Info */}
                                <div className="grid flex-1 text-right text-sm leading-tight">
                                    <span className="truncate font-semibold">Shafeea</span>
                                    <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* 
                2. Main Content Section
                Renders the primary navigation links.
            */}
            <SidebarContent>
                <NavMain items={adminNavItems} />
            </SidebarContent>

            {/* 
                3. Footer Section
                Renders secondary links and the User Profile dropdown.
            */}
            {/* <SidebarFooter> */}
                {/* Optional: Footer Links */}
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                
                {/* <NavUser/> */}
            {/* </SidebarFooter> */}
            
            {/* Adds the resize handle for the sidebar */}
            <SidebarRail />
        </Sidebar>
    );
}