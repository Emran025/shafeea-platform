export interface Inquiry {
    id: number;
    question: string;
    answer: string | null;
    created_at: string;
    [key: string]: any;
}

export interface Policy {
    id: number;
    content: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Term {
    id: number;
    content: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PrivacyPolicy {
    id: number;
    content: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    sections_json: string;
    last_updated: string;
}

export interface TermsOfUse {
    id: number;
    content: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    sections_json: string;
    last_updated: string;
}
