import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
    errors?;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}


export interface Category {
    id: number;
    name: string;
}

export interface Faq {
    id: number;
    question: string;
    answer: string;
    view_count: number;
    category: Category;
    created_at?: string;
    updated_at?: string;
}

export interface School {
    id: number;
    name: string;
    logo: string;
    phone: string;
    country: string;
    city: string;
    location: string;
    address: string;
    created_at: string;
    updated_at: string;
}

