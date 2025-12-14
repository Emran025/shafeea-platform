import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { Inquiry, Policy, Term, PrivacyPolicy, TermsOfUse } from './models';

declare module 'ziggy-js' {
    interface RouteList extends Config {}
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};

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
    phone_zone: number | null;
    phone: number | null;
    whatsapp_zone: number | null;
    whatsapp: number | null;
    gender: 'Male' | 'Female' | null;
    birth_date: string | null;
    country: string | null;
    city: string | null;
    residence: string | null;
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

export interface Document {
    id: number | null,
    name: string,
    certificate_type: string,
    certificate_type_other: string,
    riwayah: string,
    issuing_place: string,
    issuing_date: string,
    file: File | null,
    file_path : string | null
}
type NullableString = string | null;

export interface Session {
    device_id?: NullableString;
    model?: NullableString;
    manufacturer?: NullableString;
    os_version?: NullableString;
    app_version?: NullableString;
    timezone?: NullableString;
    locale?: NullableString;
    fcm_token?: NullableString;
    login_time?: Date | null;
}

export { Inquiry, Policy, Term, PrivacyPolicy, TermsOfUse , Session };

