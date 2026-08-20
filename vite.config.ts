import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/platform/app.css',
                'resources/js/platform/app.tsx',
                'resources/css/schools/app.css',
                'resources/js/schools/app.tsx',
            ],
            ssr: 'resources/js/platform/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: [
            {
                find: 'ziggy-js',
                replacement: resolve(__dirname, 'vendor/tightenco/ziggy'),
            },
            {
                find: '@',
                replacement: resolve(__dirname, 'resources/js'),
            },
        ],
    },
});
