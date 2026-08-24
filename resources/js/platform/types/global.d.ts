import { User } from '@/types';
import { route as ziggyRoute } from 'ziggy-js';

declare module '@inertiajs/react' {
    interface Page<T = Record<string, unknown>> {
        props: T & {
            auth: {
                user: User;
            };
            [key: string]: unknown;
        };
    }
}

declare global {
    var route: typeof ziggyRoute;
}
