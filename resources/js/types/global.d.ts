import { Page } from '@inertiajs/react';
import { User } from '@/types';
import { Config, route as ziggyRoute } from 'ziggy-js';

declare module '@inertiajs/react' {
    interface Page<T = Record<string, unknown>> {
        props: T & {
            auth: {
                user: User;
            };
            [key: string]: any;
        };
    }
}

declare global {
    var route: typeof ziggyRoute;
}

declare module 'ziggy-js' {
    interface RouteList extends Config {}
}
