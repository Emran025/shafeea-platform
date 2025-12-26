import React from 'react';

interface GuestLayoutProps {
    children: React.ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <div>
                <a href="/">
                    <div className="flex items-center gap-3 group">
                        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
                            <img
                                src="/logo.svg"
                                alt="Shafeea Logo"
                                className="w-12 h-12 object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                                شفيع
                            </h1>
                            <p className="text-sm text-muted-foreground">المنصة القرآنية الرائدة</p>
                        </div>
                    </div>
                </a>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
