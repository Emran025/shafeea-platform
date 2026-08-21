/**
 * ACCSYSTEM Engine — Contract Types & Type Guards
 * The rendering contracts delivered by the engine to the renderer.
 */
import type { PagePayload } from './page';
import type { Navigation } from './navigation';

export interface ErrorPayload {
    error_type: string;
    http_hint:  number;
    message:    string;
    navigation: Navigation;
}

export interface PageContract {
    contract_version: string;
    contract_type:    'page' | 'partial';
    engine_version:   string;
    request_id:       string;
    composed_at:      string;
    payload:          PagePayload;
}

export interface ErrorContract {
    contract_version: string;
    contract_type:    'error';
    engine_version:   string;
    request_id:       string;
    composed_at:      string;
    payload:          ErrorPayload;
}

export type ContractEnvelope = PageContract | ErrorContract;

// ─── Type Guards ──────────────────────────────────────────────────────────────

export function isPageContract(c: ContractEnvelope): c is PageContract {
    return c.contract_type === 'page' || c.contract_type === 'partial';
}

export function isErrorContract(c: ContractEnvelope): c is ErrorContract {
    return c.contract_type === 'error';
}
