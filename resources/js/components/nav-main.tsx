import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface NavMainProps {
    items: NavItem[];
}

/**
 * NavMain Component
 * Enhanced with modern styling, animations, and better visual feedback matching public site aesthetic.
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
                    const isActive = currentPath === item.href;

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton 
                                asChild 
                                isActive={isActive} 
                                tooltip={item.title}
                                className={cn(
                                    "group relative transition-all duration-300",
                                    "hover:bg-primary-foreground/15 hover:translate-x-[-4px]",
                                    // Active state: subtle box-shadow on entire container, no icon shading
                                    isActive && "shadow-lg shadow-black/10 dark:shadow-black/20"
                                )}
                            >
                                <Link 
                                    href={item.href}
                                    className="flex items-center gap-3 w-full relative"
                                >
                                    {item.icon && (
                                        <div className={cn(
                                            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                                            // Removed bg-primary-foreground/20 from active state - icon stays crisp
                                            isActive 
                                                ? "text-primary-foreground scale-110" 
                                                : "text-primary-foreground/70 group-hover:text-primary-foreground group-hover:bg-primary-foreground/10"
                                        )}>
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                    )}
                                    <span className={cn(
                                        "font-semibold text-sm transition-colors duration-300",
                                        isActive ? "text-primary-foreground" : "text-primary-foreground/90"
                                    )}>
                                        {item.title}
                                    </span>
                                    {/* White vertical strip indicator for active state */}
                                    {isActive && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-sm" />
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}