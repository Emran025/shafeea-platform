import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainProps {
    items: NavItem[];
}

/**
 * NavMain Component
 * Renders the main navigation menu items with precise active state logic.
 */
export function NavMain({ items }: NavMainProps) {
    const { url } = usePage();
    // Remove query strings to compare pure paths
    const currentPath = url.split('?')[0];

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => {
                    // Strict matching logic to prevent overlapping highlights.
                    // Returns true ONLY if the URL matches exactly.
                    // This separates '/admin/schools' from '/admin/schools/pending'.
                    const isActive = currentPath === item.href;

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton 
                                asChild 
                                isActive={isActive} 
                                tooltip={item.title}
                            >
                                <Link href={item.href}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}