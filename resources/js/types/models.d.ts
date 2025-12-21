export interface Inquiry {
    id: number;
    question: string;
    answer: string | null;
    created_at: string;
    [key: string]: unknown;
}


export interface PrivacyPolicy {
    version: number;
    content: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    sections_json: string;
    summary_json: string;
    last_updated: string;
}

export interface TermsOfUse {
    version: number;
    content: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    sections_json: string;
    summary_json: string;
    last_updated: string;
}
